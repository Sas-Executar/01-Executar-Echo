import type { TaskState } from "@repo/schemas";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import type { ScrollTaskUnitWithState } from "../app/(authenticated)/scroll/scroll-task-slide";
import { ScrollTaskView } from "../app/(authenticated)/scroll/scroll-task-view";

const refresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

const completeAction = vi.fn();
vi.mock("@/app/actions/execution/complete-action", () => ({
  completeAction: (input: unknown) => completeAction(input),
}));

const unit = (
  refId: string,
  titulo: string,
  state: TaskState = "READY"
): ScrollTaskUnitWithState => ({ refId, scope: "task", state, titulo });

const UNITS: readonly ScrollTaskUnitWithState[] = [
  unit("task_1", "Responder cliente"),
  unit("task_2", "Revisar contrato"),
];

const EMPTY_STATE_PATTERN = /Nada elegível agora/;
const DETALHE_TASK_1_PATTERN = /Escopo: task · refId: task_1/;

// Vitest globals aren't enabled in apps/app/vitest.config.ts, so
// @testing-library/react can't auto-detect `afterEach` to register its
// usual automatic cleanup — without this, DOM from one test leaks into
// the next and getByText/getByRole start matching duplicates.
afterEach(() => {
  cleanup();
  completeAction.mockReset();
  refresh.mockReset();
});

test("renders every unit's title, active one first with its state badge", () => {
  render(<ScrollTaskView units={UNITS} />);
  expect(screen.getByText("Responder cliente")).toBeDefined();
  expect(screen.getByText("Revisar contrato")).toBeDefined();
  expect(screen.getByText("Parado")).toBeDefined();
});

test("renders the empty state when there are no eligible units", () => {
  render(<ScrollTaskView units={[]} />);
  expect(screen.getByText(EMPTY_STATE_PATTERN)).toBeDefined();
});

test("starting execution takes exactly 1 interaction (idle -> running) and persists READY->DOING", async () => {
  completeAction.mockResolvedValue({});
  render(<ScrollTaskView units={UNITS} />);

  expect(screen.getByText("Parado")).toBeDefined();
  fireEvent.click(screen.getByRole("button", { name: "Iniciar" }));

  await waitFor(() => expect(screen.getByText("Em execução")).toBeDefined());
  expect(completeAction).toHaveBeenCalledWith({
    taskId: "task_1",
    toState: "DOING",
  });
  expect(refresh).toHaveBeenCalled();
});

test("a DOING unit's primary action sends it to verification, not directly to done — no evidence required", async () => {
  completeAction.mockResolvedValue({});
  render(
    <ScrollTaskView units={[unit("task_1", "Responder cliente", "DOING")]} />
  );

  const button = screen.getByRole("button", {
    name: "Enviar para verificação",
  });
  expect(screen.queryByRole("button", { name: "Concluir" })).toBeNull();
  fireEvent.click(button);

  await waitFor(() =>
    expect(completeAction).toHaveBeenCalledWith({
      taskId: "task_1",
      toState: "VERIFY",
    })
  );
  expect(refresh).toHaveBeenCalled();
});

test("a VERIFY unit's primary action requires evidence before completing", async () => {
  completeAction.mockResolvedValue({});
  render(
    <ScrollTaskView units={[unit("task_1", "Responder cliente", "VERIFY")]} />
  );

  fireEvent.click(screen.getByRole("button", { name: "Concluir" }));
  expect(completeAction).not.toHaveBeenCalled();

  fireEvent.change(
    screen.getByLabelText("Descrição da evidência de conclusão"),
    { target: { value: "Cliente confirmou por e-mail." } }
  );
  fireEvent.click(screen.getByRole("button", { name: "Confirmar conclusão" }));

  await waitFor(() =>
    expect(completeAction).toHaveBeenCalledWith({
      taskId: "task_1",
      toState: "DONE",
      evidence: {
        description: "Cliente confirmou por e-mail.",
        grade: "A_OBSERVADO",
      },
    })
  );
});

test("deferring the active unit is local-only — no further completeAction call", async () => {
  completeAction.mockResolvedValue({});
  render(<ScrollTaskView units={UNITS} />);
  fireEvent.click(screen.getByRole("button", { name: "Iniciar" }));
  await waitFor(() => expect(screen.getByText("Em execução")).toBeDefined());
  completeAction.mockClear();
  refresh.mockClear();

  fireEvent.click(screen.getByRole("button", { name: "Adiar" }));

  expect(completeAction).not.toHaveBeenCalled();
  expect(refresh).not.toHaveBeenCalled();
});

test("double-clicking the title expands it to show scope/refId detail (only once running)", async () => {
  completeAction.mockResolvedValue({});
  render(<ScrollTaskView units={UNITS} />);
  fireEvent.click(screen.getByRole("button", { name: "Iniciar" }));
  await waitFor(() => expect(screen.getByText("Em execução")).toBeDefined());

  fireEvent.doubleClick(screen.getByText("Responder cliente"));

  expect(screen.getByText("Detalhado")).toBeDefined();
  expect(screen.getByText(DETALHE_TASK_1_PATTERN)).toBeDefined();
});

test("the only actions visible while idle are 'Iniciar' and the timer options — no direct 'Concluir'", () => {
  render(<ScrollTaskView units={UNITS} />);
  expect(screen.getByRole("button", { name: "Iniciar" })).toBeDefined();
  expect(
    screen.getByRole("button", { name: "Iniciar com timer 15min" })
  ).toBeDefined();
  expect(screen.queryByRole("button", { name: "Concluir" })).toBeNull();
});
