/**
 * The Aegis governance pipeline — the visual language of the whole product.
 * Every stage owns one semantic colour, a plain-language explanation and a
 * technical explanation so the same screen serves employees and engineers.
 */
import {
  BrainCircuit,
  Compass,
  Eraser,
  FileClock,
  KeyRound,
  ScanSearch,
  Scale,
  ShieldCheck,
  User,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

export type ToneKey =
  | "identity"
  | "access"
  | "scan"
  | "policy"
  | "sanitize"
  | "ai"
  | "safe"
  | "warn"
  | "threat"
  | "insight";

/** Literal class strings so Tailwind can see every variant at build time. */
export const TONE: Record<
  ToneKey,
  { text: string; bg: string; border: string; ring: string; fill: string; label: string }
> = {
  identity: {
    text: "text-identity",
    bg: "bg-identity/10",
    border: "border-identity/35",
    ring: "ring-identity/40",
    fill: "bg-identity",
    label: "Identity",
  },
  access: {
    text: "text-access",
    bg: "bg-access/10",
    border: "border-access/35",
    ring: "ring-access/40",
    fill: "bg-access",
    label: "Access",
  },
  scan: {
    text: "text-scan",
    bg: "bg-scan/10",
    border: "border-scan/35",
    ring: "ring-scan/40",
    fill: "bg-scan",
    label: "Security",
  },
  policy: {
    text: "text-policy",
    bg: "bg-policy/10",
    border: "border-policy/35",
    ring: "ring-policy/40",
    fill: "bg-policy",
    label: "Policy",
  },
  sanitize: {
    text: "text-sanitize",
    bg: "bg-sanitize/10",
    border: "border-sanitize/35",
    ring: "ring-sanitize/40",
    fill: "bg-sanitize",
    label: "Sanitization",
  },
  ai: {
    text: "text-ai",
    bg: "bg-ai/10",
    border: "border-ai/35",
    ring: "ring-ai/40",
    fill: "bg-ai",
    label: "AI model",
  },
  safe: {
    text: "text-safe",
    bg: "bg-safe/10",
    border: "border-safe/35",
    ring: "ring-safe/40",
    fill: "bg-safe",
    label: "Safe",
  },
  warn: {
    text: "text-warn",
    bg: "bg-warn/10",
    border: "border-warn/35",
    ring: "ring-warn/40",
    fill: "bg-warn",
    label: "Warning",
  },
  threat: {
    text: "text-threat",
    bg: "bg-threat/10",
    border: "border-threat/35",
    ring: "ring-threat/40",
    fill: "bg-threat",
    label: "Threat",
  },
  insight: {
    text: "text-insight",
    bg: "bg-insight/10",
    border: "border-insight/35",
    ring: "ring-insight/40",
    fill: "bg-insight",
    label: "Analytics",
  },
};

export interface PipelineStage {
  key: string;
  label: string;
  short: string;
  icon: LucideIcon;
  tone: ToneKey;
  /** Human explanation — Simple view. */
  simple: string;
  /** Engineering explanation — Technical view. */
  technical: string;
  metric: string;
  checks: { name: string; result: string; ok: boolean }[];
}

export const pipeline: PipelineStage[] = [
  {
    key: "user",
    label: "Person",
    short: "Someone asks the AI something",
    icon: User,
    tone: "identity",
    simple: "An employee types a question or pastes a document for the AI.",
    technical: "Client submits POST /api/chat with a bearer token and model hint.",
    metric: "214 active people",
    checks: [
      { name: "Request received", result: "OK", ok: true },
      { name: "Workspace session", result: "Valid", ok: true },
    ],
  },
  {
    key: "identity",
    label: "Identity",
    short: "Aegis checks who you are",
    icon: KeyRound,
    tone: "identity",
    simple: "Aegis confirms the person really is who they say they are.",
    technical: "JWT signature + issuer aegis-auth verified, claims extracted.",
    metric: "100% verified",
    checks: [
      { name: "Token signature", result: "Verified", ok: true },
      { name: "Token expiry", result: "Valid", ok: true },
      { name: "Issuer", result: "aegis-auth", ok: true },
    ],
  },
  {
    key: "access",
    label: "Access",
    short: "Checks what they are allowed to use",
    icon: ShieldCheck,
    tone: "access",
    simple: "Aegis checks whether this person is allowed to use this AI model.",
    technical: "RBAC evaluation — role EMPLOYEE, scope ai:invoke, model allow-list.",
    metric: "3 roles",
    checks: [
      { name: "Role", result: "EMPLOYEE", ok: true },
      { name: "Scope ai:invoke", result: "Granted", ok: true },
      { name: "Model allow-list", result: "GPT-4 permitted", ok: true },
    ],
  },
  {
    key: "security",
    label: "Security",
    short: "Looks for risky content",
    icon: ScanSearch,
    tone: "scan",
    simple: "Aegis reads the request looking for passwords, personal data or tricks.",
    technical: "Detector chain: secrets, PII, prompt injection, malicious payloads.",
    metric: "96 alerts today",
    checks: [
      { name: "PII", result: "PASS", ok: true },
      { name: "Secrets", result: "PASS", ok: true },
      { name: "Prompt injection", result: "PASS", ok: true },
      { name: "Malicious content", result: "PASS", ok: true },
    ],
  },
  {
    key: "policy",
    label: "Policy",
    short: "Applies the company rules",
    icon: Scale,
    tone: "policy",
    simple: "Company rules decide whether this request is allowed to continue.",
    technical: "Rule engine evaluates ordered policies, first decisive match wins.",
    metric: "6 rules evaluated",
    checks: [
      { name: "Employee access", result: "PASS", ok: true },
      { name: "Model approved", result: "PASS", ok: true },
      { name: "Confidential data", result: "Detected", ok: false },
    ],
  },
  {
    key: "sanitize",
    label: "Sanitize",
    short: "Removes anything sensitive",
    icon: Eraser,
    tone: "sanitize",
    simple: "Sensitive details are hidden before the AI ever sees them.",
    technical: "Tokenised redaction of matched spans; reversible map stored in audit.",
    metric: "8.2% redacted",
    checks: [
      { name: "Email addresses", result: "2 redacted", ok: true },
      { name: "Account numbers", result: "None", ok: true },
    ],
  },
  {
    key: "router",
    label: "Router",
    short: "Picks the right AI model",
    icon: Compass,
    tone: "access",
    simple: "Aegis chooses the safest suitable AI — internal when data is sensitive.",
    technical: "Priority + cost + classification routing across the model registry.",
    metric: "3 models",
    checks: [
      { name: "Classification", result: "INTERNAL", ok: true },
      { name: "Selected model", result: "GPT-4", ok: true },
    ],
  },
  {
    key: "model",
    label: "AI model",
    short: "The AI produces an answer",
    icon: BrainCircuit,
    tone: "ai",
    simple: "The approved AI model produces an answer.",
    technical: "Upstream invocation with streamed completion, tokens metered.",
    metric: "1.2s average",
    checks: [
      { name: "Provider", result: "OpenAI", ok: true },
      { name: "Latency", result: "1,180 ms", ok: true },
    ],
  },
  {
    key: "output",
    label: "Output guard",
    short: "Checks the answer before you see it",
    icon: ShieldCheck,
    tone: "scan",
    simple: "The answer is checked too, so nothing unsafe comes back.",
    technical: "Output scanners: leakage, toxicity, secret echo, policy re-check.",
    metric: "0.4% flagged",
    checks: [
      { name: "Data leakage", result: "PASS", ok: true },
      { name: "Secret echo", result: "PASS", ok: true },
    ],
  },
  {
    key: "response",
    label: "Safe response",
    short: "You get a safe answer",
    icon: CheckCircle2,
    tone: "safe",
    simple: "The person receives an answer that follows every company rule.",
    technical: "Response returned with request ID for traceability.",
    metric: "94.4% delivered",
    checks: [{ name: "Delivered", result: "OK", ok: true }],
  },
  {
    key: "audit",
    label: "Audit",
    short: "Everything is recorded",
    icon: FileClock,
    tone: "insight",
    simple: "A permanent record is kept so the company can prove what happened.",
    technical: "Append-only audit record with full stage trace and token metering.",
    metric: "12,842 records",
    checks: [{ name: "Record persisted", result: "OK", ok: true }],
  },
];

export const severityCounts = [
  { level: "CRITICAL", count: 4, tone: "threat" as ToneKey },
  { level: "HIGH", count: 17, tone: "policy" as ToneKey },
  { level: "MEDIUM", count: 38, tone: "warn" as ToneKey },
  { level: "LOW", count: 62, tone: "scan" as ToneKey },
];

export const eventDistribution = [
  { type: "Secret exposure", share: 38, tone: "threat" as ToneKey },
  { type: "Prompt injection", share: 27, tone: "policy" as ToneKey },
  { type: "PII violation", share: 21, tone: "warn" as ToneKey },
  { type: "Policy violation", share: 14, tone: "insight" as ToneKey },
];

export const securityTimeline = [
  { hour: "10:00", events: 2, critical: 0 },
  { hour: "12:00", events: 6, critical: 1 },
  { hour: "14:00", events: 11, critical: 2 },
  { hour: "16:00", events: 5, critical: 0 },
  { hour: "18:00", events: 8, critical: 1 },
  { hour: "20:00", events: 14, critical: 3 },
];

export const departmentRequests = [
  { department: "Engineering", requests: 5240 },
  { department: "Marketing", requests: 2810 },
  { department: "Finance", requests: 1920 },
  { department: "HR", requests: 1180 },
  { department: "Support", requests: 1692 },
];

export const tokenTrend = [
  { day: "Mon", tokens: 820 },
  { day: "Tue", tokens: 960 },
  { day: "Wed", tokens: 1040 },
  { day: "Thu", tokens: 1180 },
  { day: "Fri", tokens: 1420 },
  { day: "Sat", tokens: 520 },
  { day: "Sun", tokens: 700 },
];