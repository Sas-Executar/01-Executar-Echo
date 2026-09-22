import { useAuth } from "@clerk/expo";
import { light } from "@repo/design-tokens";
import { V1_SYMBOL_IDS, V1_SYMBOL_TO_COMMAND } from "@repo/scanner";
import type { VisualSymbolSemantic } from "@repo/schemas";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/themed";
import {
  postEnrollSymbol,
  SYMBOL_LABEL_PT,
} from "@/src/features/scanner/commands/visual-symbols";
import { captureFrame } from "@/src/features/scanner/vision/camera-frame-source";
import { encodeFrame } from "@/src/features/scanner/vision/dinov2-encoder";
import { isModelDownloaded } from "@/src/features/scanner/vision/model-store";

const MAX_REFERENCE_CAPTURES = 3;

/**
 * V1's 3 physical symbols, offered as fixed choices rather than free
 * text — V1_SYMBOL_IDS's own keys ("CHAT"|"SELECTOR"|"DONE") are
 * literally the VisualSymbolSemantic enum values, so deriving semantic
 * this way can't produce a symbolId/semantic/command combination that
 * doesn't already match V1_SYMBOL_TO_COMMAND (visual-symbols.ts's own
 * SYMBOL_LABEL_PT is reused for the same PT-BR labels the Scanner tab
 * shows once a symbol is recognized).
 */
const ENROLLMENT_TARGETS = (
  Object.keys(V1_SYMBOL_IDS) as (keyof typeof V1_SYMBOL_IDS)[]
).map((key) => {
  const symbolId = V1_SYMBOL_IDS[key];
  return {
    symbolId,
    semantic: key as VisualSymbolSemantic,
    command: V1_SYMBOL_TO_COMMAND[symbolId],
    label: SYMBOL_LABEL_PT[symbolId] ?? symbolId,
  };
});

/**
 * Symbol enrollment screen (Task 5 of the Scroll+Scanner P0 plan) —
 * closes REQ-SCAN-004's previously entirely-missing enrollment path.
 * Reuses the exact same camera + encodeFrame() pipeline the Scanner tab
 * uses for recognition (captureFrame → encodeFrame), never duplicating
 * that logic — this screen only accumulates 1-3 reference embeddings
 * and posts them to the same registerSymbol()-backed route
 * (POST /scanner/symbols) the GET side already reads from.
 */
export default function ScannerEnrollScreen() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [targetIndex, setTargetIndex] = useState(0);
  const target = ENROLLMENT_TARGETS[targetIndex];

  const [embeddings, setEmbeddings] = useState<Float32Array[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const modelReady = isModelDownloaded();

  const onSelectTarget = (index: number) => {
    setTargetIndex(index);
    setEmbeddings([]);
    setError(null);
    setSuccess(false);
  };

  const onCapture = async () => {
    if (!cameraRef.current || embeddings.length >= MAX_REFERENCE_CAPTURES) {
      return;
    }
    setIsCapturing(true);
    setError(null);
    try {
      const frame = await captureFrame(cameraRef.current);
      const embedding = await encodeFrame(frame.base64);
      setEmbeddings((current) => [...current, embedding]);
    } catch (captureError) {
      setError(
        captureError instanceof Error
          ? captureError.message
          : String(captureError)
      );
    } finally {
      setIsCapturing(false);
    }
  };

  const onSubmit = async () => {
    if (embeddings.length === 0) {
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No active Clerk session token.");
      }
      await postEnrollSymbol(
        {
          symbolId: target.symbolId,
          semantic: target.semantic,
          command: target.command,
          embeddings,
        },
        token
      );
      setSuccess(true);
      setEmbeddings([]);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : String(submitError)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Cadastrar símbolo" }} />
        <Text style={styles.status}>
          A câmera é necessária para cadastrar um símbolo.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Permitir câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (!modelReady) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Cadastrar símbolo" }} />
        <Text style={styles.status}>
          O modelo DINOv2 ainda não foi baixado neste dispositivo. Abra a aba
          Scanner e baixe o modelo antes de cadastrar um símbolo.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Cadastrar símbolo" }} />
      <View style={styles.targetRow}>
        {ENROLLMENT_TARGETS.map((option, index) => (
          <TouchableOpacity
            key={option.symbolId}
            onPress={() => onSelectTarget(index)}
            style={[
              styles.targetChip,
              index === targetIndex && styles.targetChipActive,
            ]}
          >
            <Text
              style={[
                styles.targetChipText,
                index === targetIndex && styles.targetChipTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <CameraView ref={cameraRef} style={styles.camera}>
        <View style={styles.roiOverlay} />
      </CameraView>

      <View style={styles.statusBar}>
        <Text style={styles.status}>
          {embeddings.length}/{MAX_REFERENCE_CAPTURES} capturas de referência
          para "{target.label}"
        </Text>
        {error && <Text style={styles.error}>{error}</Text>}
        {success && (
          <Text style={styles.success}>Símbolo cadastrado com sucesso.</Text>
        )}

        <TouchableOpacity
          disabled={isCapturing || embeddings.length >= MAX_REFERENCE_CAPTURES}
          onPress={onCapture}
          style={styles.button}
        >
          {isCapturing ? (
            <ActivityIndicator color={light.color.background} />
          ) : (
            <Text style={styles.buttonText}>Capturar referência</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isSubmitting || embeddings.length === 0}
          onPress={onSubmit}
          style={[
            styles.button,
            (isSubmitting || embeddings.length === 0) && styles.buttonDisabled,
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator color={light.color.background} />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  targetRow: { flexDirection: "row", gap: 8 },
  targetChip: {
    borderWidth: 1,
    borderColor: light.color.border,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  targetChipActive: {
    backgroundColor: light.color.action.primary,
    borderColor: light.color.action.primary,
  },
  targetChipText: { fontSize: 13, color: light.color.text.primary },
  targetChipTextActive: { color: light.color.background },
  camera: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  roiOverlay: {
    width: "60%",
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: `${light.color.background}aa`,
    borderRadius: 12,
  },
  statusBar: { padding: 16, gap: 8, alignItems: "center" },
  status: { fontSize: 14, textAlign: "center" },
  success: { color: light.color.status.success, fontSize: 13 },
  button: {
    backgroundColor: light.color.action.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    minWidth: 200,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: light.color.background, fontWeight: "600" },
  error: {
    color: light.color.status.error,
    fontSize: 12,
    textAlign: "center",
  },
  link: { color: light.color.focus, fontSize: 13, marginTop: 4 },
});
