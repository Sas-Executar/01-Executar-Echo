# EXECUTAR Scanner — DINOv2 ONNX model asset

Branch órfã dedicada só a hospedar o artefato binário do modelo do Scanner.
Sem relação de histórico com `main` — propositalmente, pra não inchar o
histórico do repositório principal com blobs binários grandes.

## Modelo publicado

- **Origem**: `facebook/dinov2-small` (ViT-S/14, 21M parâmetros), exportado
  via `torch.onnx.export`, opset 17.
- **Contrato**: entrada `pixel_values` shape `[1,3,224,224]` float32 (NCHW,
  normalização ImageNet: `mean=[0.485,0.456,0.406]`, `std=[0.229,0.224,0.225]`,
  resize 224×224), saída `embedding` shape `[1,384]` float32 (pooler_output).
- **Validação**: comparado numericamente contra o modelo PyTorch original —
  similaridade de cosseno 0.9999999, diferença máxima absoluta ~2.3e-5.
- **Arquivo**: `dinov2-vits14.onnx` (~84.2 MB), autocontido (sem `.data`
  externo — pesos embutidos, necessário pro `onnxruntime-react-native` no
  mobile carregar de um arquivo só).
- **SHA-256**: ver `dinov2-vits14.onnx.sha256`.

## Consumido por

`apps/mobile/src/features/scanner/vision/model-store.ts` (branch `main`),
via `EXPO_PUBLIC_DINOV2_MODEL_URL`/`EXPO_PUBLIC_DINOV2_MODEL_SHA256`
apontando pra URL raw desta branch, pinada num commit SHA específico (não
na branch em si, pra a URL nunca mudar de conteúdo silenciosamente).

## Atualizar o modelo no futuro

Um novo commit nesta mesma branch órfã, com um novo arquivo `.onnx` +
`.sha256`, e atualizar a URL pinada (novo SHA de commit) nas env vars do
mobile — nunca sobrescrever o commit anterior nem forçar a branch, pra a
URL antiga continuar servindo o binário antigo até a migração ser
confirmada.
