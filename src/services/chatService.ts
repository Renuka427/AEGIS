import { api } from "./api";
import type { TraceStage } from "@/lib/mock-data";

export interface AegisChatResponse {
  requestId: string;
  answer: string;
  model: string;
  decision: "ALLOWED" | "REDACTED" | "BLOCKED";
  trace: TraceStage[];
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
}

const SECRET_PATTERNS = [/sk-[a-z0-9]/i, /AKIA[0-9A-Z]{6,}/, /api[_ -]?key/i, /password\s*[:=]/i];
const PII_PATTERNS = [/[\w.+-]+@[\w-]+\.[a-z]{2,}/i, /\b\d{10}\b/, /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/];
const INJECTION_PATTERNS = [/ignore (all )?(previous|prior) instructions/i, /system prompt/i];
const CONFIDENTIAL_PATTERNS = [/confidential/i, /internal only/i];

function id() {
  return `REQ-${Math.random().toString(16).slice(2, 7).toUpperCase()}`;
}

/**
 * ASSUMPTION (documented): the gateway endpoint will be POST /api/chat returning
 * { requestId, answer, decision, trace }. The local evaluation below mirrors the
 * documented Aegis pipeline so the console can be demonstrated without the backend.
 */
export const chatService = {
  async send(prompt: string, modelName: string, modelType: "EXTERNAL" | "PRIVATE"): Promise<AegisChatResponse> {
    await api.simulateLatency(900);

    const hasSecret = SECRET_PATTERNS.some((r) => r.test(prompt));
    const hasPII = PII_PATTERNS.some((r) => r.test(prompt));
    const injection = INJECTION_PATTERNS.some((r) => r.test(prompt));
    const confidential = CONFIDENTIAL_PATTERNS.some((r) => r.test(prompt));
    const blockedByPolicy = confidential && modelType === "EXTERNAL";
    const blocked = hasSecret || injection || blockedByPolicy;
    const routedModel = blocked ? "Not forwarded" : confidential ? "Aegis Local" : modelName;

    const trace: TraceStage[] = [
      { name: "Authentication", status: "PASS", detail: "JWT verified · issuer aegis-auth" },
      { name: "Authorization (RBAC)", status: "PASS", detail: "scope ai:invoke granted" },
      {
        name: "Policy Evaluation",
        status: blockedByPolicy ? "FAIL" : "PASS",
        detail: blockedByPolicy
          ? "POL-001 · CONFIDENTIAL + EXTERNAL → BLOCK"
          : `${confidential ? "Confidential content → internal routing" : "6 policies evaluated"}`,
      },
      {
        name: "Security Scan",
        status: hasSecret || injection ? "FAIL" : hasPII ? "WARN" : blockedByPolicy ? "SKIPPED" : "PASS",
        detail: hasSecret
          ? "Credential pattern detected"
          : injection
            ? "Prompt injection pattern detected"
            : hasPII
              ? "Personal identifiers detected"
              : blockedByPolicy
                ? "Request halted before scanning"
                : "No PII, secrets or injection",
      },
      {
        name: "Sanitization",
        status: blocked ? "SKIPPED" : hasPII ? "PASS" : "SKIPPED",
        detail: blocked ? "Request halted" : hasPII ? "Identifiers redacted before routing" : "Nothing to redact",
      },
      {
        name: "Model Router",
        status: blocked ? "SKIPPED" : "PASS",
        detail: blocked ? "Not forwarded" : `Routed to ${routedModel}`,
      },
      { name: "AI Model", status: blocked ? "SKIPPED" : "PASS", detail: blocked ? "Not forwarded" : `${routedModel} responded` },
      { name: "Output Guard", status: blocked ? "SKIPPED" : "PASS", detail: blocked ? "No output" : "Output scan clean" },
      { name: "Audit Log", status: "PASS", detail: "Record persisted to audit store" },
    ];

    const answer = blocked
      ? hasSecret
        ? "This request was blocked by Aegis. A credential was detected in your prompt and it was never sent to a model. Remove the secret and try again."
        : injection
          ? "This request was blocked by Aegis. The prompt contained an instruction-override pattern and was not forwarded."
          : "This request was blocked by Aegis. Confidential content cannot be sent to an external model — switch to Aegis Local to continue."
      : hasPII
        ? "Here is the analysis. Personal identifiers in your prompt were redacted before the model saw them, so names, emails and numbers have been replaced with placeholders in the response."
        : "Here is the analysis. The request passed every governance stage and the response was scanned before delivery.";

    return {
      requestId: id(),
      answer,
      model: routedModel,
      decision: blocked ? "BLOCKED" : hasPII ? "REDACTED" : "ALLOWED",
      trace,
      latencyMs: blocked ? 210 : 1480,
      inputTokens: Math.max(40, Math.round(prompt.length / 3)),
      outputTokens: blocked ? 0 : 420,
    };
  },
};