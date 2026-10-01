/**
 * MOCK DATA — clearly separated from the API service layer (src/services).
 * Every service function reads from here until the Spring Boot REST endpoint
 * exists. Shapes mirror the documented Aegis backend contracts.
 */

export type Role = "EMPLOYEE" | "ADMIN" | "SECURITY";

export type PolicyAction = "ALLOW" | "WARN" | "REDACT" | "BLOCK" | "ESCALATE";
export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface AegisUser {
  id: string;
  name: string;
  email: string;
  department: string;
  role: Role;
  status: "ACTIVE" | "SUSPENDED";
  requests: number;
  blocked: number;
  tokens: number;
  models: { name: string; allowed: boolean }[];
}

export const users: AegisUser[] = [
  {
    id: "USR-1001",
    name: "Alex Johnson",
    email: "alex@company.com",
    department: "Engineering",
    role: "EMPLOYEE",
    status: "ACTIVE",
    requests: 128,
    blocked: 7,
    tokens: 42800,
    models: [
      { name: "GPT-4", allowed: true },
      { name: "Claude 3.5", allowed: true },
      { name: "Finance-LLM", allowed: false },
    ],
  },
  {
    id: "USR-1002",
    name: "Sarah Miller",
    email: "sarah@company.com",
    department: "Security",
    role: "SECURITY",
    status: "ACTIVE",
    requests: 64,
    blocked: 1,
    tokens: 18400,
    models: [
      { name: "GPT-4", allowed: true },
      { name: "Aegis Local", allowed: true },
      { name: "Finance-LLM", allowed: false },
    ],
  },
  {
    id: "USR-1003",
    name: "David Smith",
    email: "david@company.com",
    department: "IT",
    role: "ADMIN",
    status: "ACTIVE",
    requests: 212,
    blocked: 3,
    tokens: 61250,
    models: [
      { name: "GPT-4", allowed: true },
      { name: "Claude 3.5", allowed: true },
      { name: "Aegis Local", allowed: true },
    ],
  },
  {
    id: "USR-1004",
    name: "Priya Nair",
    email: "priya@company.com",
    department: "Marketing",
    role: "EMPLOYEE",
    status: "ACTIVE",
    requests: 96,
    blocked: 12,
    tokens: 30100,
    models: [
      { name: "GPT-4", allowed: true },
      { name: "Claude 3.5", allowed: false },
      { name: "Aegis Local", allowed: true },
    ],
  },
  {
    id: "USR-1005",
    name: "John Carter",
    email: "john@company.com",
    department: "Finance",
    role: "EMPLOYEE",
    status: "SUSPENDED",
    requests: 41,
    blocked: 19,
    tokens: 12900,
    models: [
      { name: "GPT-4", allowed: false },
      { name: "Finance-LLM", allowed: true },
    ],
  },
];

export interface AegisModel {
  id: string;
  name: string;
  provider: string;
  type: "EXTERNAL" | "PRIVATE";
  status: "ACTIVE" | "DISABLED";
  costTier: "$" | "$$" | "$$$";
  costPer1k: number;
  priority: number;
  capabilities: string[];
  access: { role: string; allowed: boolean }[];
  usageShare: number;
}

export const models: AegisModel[] = [
  {
    id: "MDL-01",
    name: "GPT-4",
    provider: "OpenAI",
    type: "EXTERNAL",
    status: "ACTIVE",
    costTier: "$$$",
    costPer1k: 0.03,
    priority: 2,
    capabilities: ["Reasoning", "Code", "General"],
    access: [
      { role: "Employee", allowed: true },
      { role: "Developer", allowed: true },
      { role: "Finance", allowed: false },
    ],
    usageShare: 42,
  },
  {
    id: "MDL-02",
    name: "Claude 3.5",
    provider: "Anthropic",
    type: "EXTERNAL",
    status: "ACTIVE",
    costTier: "$$",
    costPer1k: 0.018,
    priority: 3,
    capabilities: ["Long context", "Analysis", "Writing"],
    access: [
      { role: "Employee", allowed: true },
      { role: "Developer", allowed: true },
      { role: "Finance", allowed: false },
    ],
    usageShare: 31,
  },
  {
    id: "MDL-03",
    name: "Aegis Local",
    provider: "Internal",
    type: "PRIVATE",
    status: "ACTIVE",
    costTier: "$",
    costPer1k: 0.002,
    priority: 1,
    capabilities: ["Confidential data", "Summarisation", "Redacted routing"],
    access: [
      { role: "Employee", allowed: true },
      { role: "Developer", allowed: true },
      { role: "Finance", allowed: true },
    ],
    usageShare: 27,
  },
];

export interface Policy {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "DISABLED";
  action: PolicyAction;
  severity: Severity;
  scope: string;
  conditions: { field: string; operator: string; value: string }[];
  createdBy: string;
  createdAt: string;
  triggers30d: number;
}

export const policies: Policy[] = [
  {
    id: "POL-001",
    name: "External Model + Confidential Data",
    description: "Confidential classified content may never leave the tenant boundary.",
    status: "ACTIVE",
    action: "BLOCK",
    severity: "CRITICAL",
    scope: "All Employees",
    conditions: [
      { field: "Data Classification", operator: "equals", value: "CONFIDENTIAL" },
      { field: "Model Type", operator: "equals", value: "EXTERNAL" },
    ],
    createdBy: "Admin",
    createdAt: "Sep 7, 2026",
    triggers30d: 214,
  },
  {
    id: "POL-002",
    name: "PII Protection",
    description: "Detected personal identifiers are redacted before model routing.",
    status: "ACTIVE",
    action: "REDACT",
    severity: "HIGH",
    scope: "Organization",
    conditions: [{ field: "Detection", operator: "contains", value: "PII" }],
    createdBy: "Admin",
    createdAt: "Aug 21, 2026",
    triggers30d: 486,
  },
  {
    id: "POL-003",
    name: "Secret Protection",
    description: "API keys, tokens and credentials are blocked at the gateway.",
    status: "ACTIVE",
    action: "BLOCK",
    severity: "CRITICAL",
    scope: "Organization",
    conditions: [{ field: "Detection", operator: "equals", value: "SECRET" }],
    createdBy: "Security",
    createdAt: "Aug 14, 2026",
    triggers30d: 92,
  },
  {
    id: "POL-004",
    name: "Prompt Injection Escalation",
    description: "Suspected injection attempts are blocked and escalated to the SOC.",
    status: "ACTIVE",
    action: "ESCALATE",
    severity: "HIGH",
    scope: "Organization",
    conditions: [{ field: "Detection", operator: "equals", value: "PROMPT_INJECTION" }],
    createdBy: "Security",
    createdAt: "Aug 30, 2026",
    triggers30d: 57,
  },
  {
    id: "POL-005",
    name: "Employee Model Access",
    description: "Employees may use approved general-purpose models only.",
    status: "ACTIVE",
    action: "ALLOW",
    severity: "LOW",
    scope: "Employees",
    conditions: [{ field: "Role", operator: "equals", value: "EMPLOYEE" }],
    createdBy: "Admin",
    createdAt: "Jul 30, 2026",
    triggers30d: 12842,
  },
  {
    id: "POL-006",
    name: "Request Volume Anomaly",
    description: "Warns when a single identity exceeds 800 requests per hour.",
    status: "DISABLED",
    action: "WARN",
    severity: "MEDIUM",
    scope: "Organization",
    conditions: [{ field: "Requests / hour", operator: "greater than", value: "800" }],
    createdBy: "Security",
    createdAt: "Sep 1, 2026",
    triggers30d: 4,
  },
];

export type StageStatus = "PASS" | "WARN" | "FAIL" | "SKIPPED";
export interface TraceStage {
  name: string;
  status: StageStatus;
  detail: string;
}

export interface AuditRecord {
  id: string;
  time: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  model: string;
  result: "ALLOWED" | "BLOCKED" | "REDACTED" | "SUCCESS";
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  policy: string;
  trace: TraceStage[];
}

const fullPass: TraceStage[] = [
  { name: "Authentication", status: "PASS", detail: "JWT verified · issuer aegis-auth" },
  { name: "Authorization (RBAC)", status: "PASS", detail: "Role EMPLOYEE · scope ai:invoke" },
  { name: "Policy Evaluation", status: "PASS", detail: "6 policies evaluated" },
  { name: "Security Scan", status: "PASS", detail: "No PII, secrets or injection" },
  { name: "Sanitization", status: "SKIPPED", detail: "Nothing to redact" },
  { name: "Model Router", status: "PASS", detail: "Priority routing applied" },
  { name: "AI Model", status: "PASS", detail: "Response received" },
  { name: "Output Guard", status: "PASS", detail: "Output scan clean" },
  { name: "Audit Log", status: "PASS", detail: "Record persisted" },
];

export const auditLogs: AuditRecord[] = [
  {
    id: "REQ-83921",
    time: "20:31",
    timestamp: "Sep 7, 2026 20:31:42 IST",
    user: "Alex Johnson",
    action: "AI_REQUEST",
    resource: "chat/completions",
    model: "GPT-4",
    result: "ALLOWED",
    latencyMs: 1820,
    inputTokens: 842,
    outputTokens: 1240,
    policy: "POL-005",
    trace: fullPass,
  },
  {
    id: "REQ-8392A",
    time: "20:28",
    timestamp: "Sep 7, 2026 20:28:03 IST",
    user: "John Carter",
    action: "AI_REQUEST",
    resource: "chat/completions",
    model: "Claude 3.5",
    result: "BLOCKED",
    latencyMs: 240,
    inputTokens: 610,
    outputTokens: 0,
    policy: "POL-003",
    trace: [
      { name: "Authentication", status: "PASS", detail: "JWT verified" },
      { name: "Authorization (RBAC)", status: "PASS", detail: "Role EMPLOYEE" },
      { name: "Policy Evaluation", status: "PASS", detail: "SECRET_PROTECTION_001 armed" },
      { name: "Security Scan", status: "FAIL", detail: "AWS access key detected in prompt" },
      { name: "Sanitization", status: "SKIPPED", detail: "Request halted" },
      { name: "Model Router", status: "SKIPPED", detail: "Not forwarded" },
      { name: "AI Model", status: "SKIPPED", detail: "Not forwarded" },
      { name: "Output Guard", status: "SKIPPED", detail: "No output" },
      { name: "Audit Log", status: "PASS", detail: "Blocked request recorded" },
    ],
  },
  {
    id: "REQ-8391F",
    time: "20:21",
    timestamp: "Sep 7, 2026 20:21:55 IST",
    user: "David Smith",
    action: "POLICY_UPDATE",
    resource: "POL-004",
    model: "—",
    result: "SUCCESS",
    latencyMs: 120,
    inputTokens: 0,
    outputTokens: 0,
    policy: "—",
    trace: [
      { name: "Authentication", status: "PASS", detail: "JWT verified" },
      { name: "Authorization (RBAC)", status: "PASS", detail: "Role ADMIN · scope policy:write" },
      { name: "Policy Evaluation", status: "SKIPPED", detail: "Control-plane action" },
      { name: "Security Scan", status: "SKIPPED", detail: "Control-plane action" },
      { name: "Sanitization", status: "SKIPPED", detail: "—" },
      { name: "Model Router", status: "SKIPPED", detail: "—" },
      { name: "AI Model", status: "SKIPPED", detail: "—" },
      { name: "Output Guard", status: "SKIPPED", detail: "—" },
      { name: "Audit Log", status: "PASS", detail: "Change recorded with diff" },
    ],
  },
  {
    id: "REQ-8391C",
    time: "20:14",
    timestamp: "Sep 7, 2026 20:14:11 IST",
    user: "Sarah Miller",
    action: "AI_REQUEST",
    resource: "chat/completions",
    model: "Aegis Local",
    result: "REDACTED",
    latencyMs: 990,
    inputTokens: 1120,
    outputTokens: 870,
    policy: "POL-002",
    trace: [
      { name: "Authentication", status: "PASS", detail: "JWT verified" },
      { name: "Authorization (RBAC)", status: "PASS", detail: "Role SECURITY" },
      { name: "Policy Evaluation", status: "PASS", detail: "PII_PROTECTION matched" },
      { name: "Security Scan", status: "WARN", detail: "2 email addresses, 1 phone number" },
      { name: "Sanitization", status: "PASS", detail: "3 entities redacted" },
      { name: "Model Router", status: "PASS", detail: "Routed to internal model" },
      { name: "AI Model", status: "PASS", detail: "Aegis Local responded" },
      { name: "Output Guard", status: "PASS", detail: "Output scan clean" },
      { name: "Audit Log", status: "PASS", detail: "Record persisted" },
    ],
  },
  {
    id: "REQ-83915",
    time: "20:02",
    timestamp: "Sep 7, 2026 20:02:37 IST",
    user: "Priya Nair",
    action: "AI_REQUEST",
    resource: "chat/completions",
    model: "GPT-4",
    result: "ALLOWED",
    latencyMs: 1410,
    inputTokens: 320,
    outputTokens: 640,
    policy: "POL-005",
    trace: fullPass,
  },
  {
    id: "REQ-8390B",
    time: "19:54",
    timestamp: "Sep 7, 2026 19:54:02 IST",
    user: "Priya Nair",
    action: "AI_REQUEST",
    resource: "chat/completions",
    model: "Claude 3.5",
    result: "BLOCKED",
    latencyMs: 180,
    inputTokens: 512,
    outputTokens: 0,
    policy: "POL-001",
    trace: [
      { name: "Authentication", status: "PASS", detail: "JWT verified" },
      { name: "Authorization (RBAC)", status: "PASS", detail: "Role EMPLOYEE" },
      { name: "Policy Evaluation", status: "FAIL", detail: "CONFIDENTIAL + EXTERNAL → BLOCK" },
      { name: "Security Scan", status: "SKIPPED", detail: "Request halted" },
      { name: "Sanitization", status: "SKIPPED", detail: "—" },
      { name: "Model Router", status: "SKIPPED", detail: "Not forwarded" },
      { name: "AI Model", status: "SKIPPED", detail: "Not forwarded" },
      { name: "Output Guard", status: "SKIPPED", detail: "No output" },
      { name: "Audit Log", status: "PASS", detail: "Blocked request recorded" },
    ],
  },
];

export interface SecurityEvent {
  id: string;
  type: string;
  severity: Severity;
  user: string;
  model: string;
  action: "BLOCKED" | "REDACTED" | "FLAGGED";
  status: "OPEN" | "INVESTIGATING" | "CLOSED";
  ago: string;
  timestamp: string;
  requestId: string;
  detection: string;
  policy: string;
  forwarded: boolean;
  summary: string;
}

export const securityEvents: SecurityEvent[] = [
  {
    id: "SEC-4410",
    type: "Secret exposure attempt",
    severity: "CRITICAL",
    user: "John Carter",
    model: "Claude 3.5 (External)",
    action: "BLOCKED",
    status: "OPEN",
    ago: "2 min ago",
    timestamp: "Sep 7, 2026 20:31:42",
    requestId: "REQ-8392A",
    detection: "Secret / Credential — AWS access key pattern",
    policy: "POL-003 · SECRET_PROTECTION_001",
    forwarded: false,
    summary: "A live cloud credential was pasted into a prompt bound for an external provider.",
  },
  {
    id: "SEC-4409",
    type: "Prompt injection",
    severity: "HIGH",
    user: "Priya Nair",
    model: "GPT-4 (External)",
    action: "BLOCKED",
    status: "INVESTIGATING",
    ago: "8 min ago",
    timestamp: "Sep 7, 2026 20:25:10",
    requestId: "REQ-83919",
    detection: "Instruction override pattern in uploaded document",
    policy: "POL-004 · INJECTION_GUARD",
    forwarded: false,
    summary: "Uploaded PDF contained hidden text instructing the model to ignore system rules.",
  },
  {
    id: "SEC-4408",
    type: "Unusual request volume",
    severity: "HIGH",
    user: "Sarah Miller",
    model: "Aegis Local",
    action: "FLAGGED",
    status: "OPEN",
    ago: "24 min ago",
    timestamp: "Sep 7, 2026 20:09:44",
    requestId: "REQ-838F2",
    detection: "1,200 requests / hour — 6x baseline",
    policy: "POL-006 · VOLUME_ANOMALY",
    forwarded: true,
    summary: "Automation token issued a sustained burst well above the identity baseline.",
  },
  {
    id: "SEC-4407",
    type: "PII disclosure",
    severity: "MEDIUM",
    user: "Alex Johnson",
    model: "Aegis Local",
    action: "REDACTED",
    status: "CLOSED",
    ago: "1 hr ago",
    timestamp: "Sep 7, 2026 19:31:02",
    requestId: "REQ-8391C",
    detection: "2 email addresses, 1 phone number",
    policy: "POL-002 · PII_PROTECTION",
    forwarded: true,
    summary: "Customer identifiers were redacted before the request reached the internal model.",
  },
  {
    id: "SEC-4406",
    type: "Policy violation",
    severity: "MEDIUM",
    user: "Priya Nair",
    model: "Claude 3.5 (External)",
    action: "BLOCKED",
    status: "CLOSED",
    ago: "2 hr ago",
    timestamp: "Sep 7, 2026 18:12:19",
    requestId: "REQ-8390B",
    detection: "Confidential classification sent to external model",
    policy: "POL-001 · EXTERNAL_CONFIDENTIAL",
    forwarded: false,
    summary: "Contract text classified CONFIDENTIAL was routed to an external provider.",
  },
];

export const requestVolume = [
  { day: "Mon", allowed: 1420, blocked: 84 },
  { day: "Tue", allowed: 1680, blocked: 96 },
  { day: "Wed", allowed: 1520, blocked: 132 },
  { day: "Thu", allowed: 1980, blocked: 108 },
  { day: "Fri", allowed: 2240, blocked: 164 },
  { day: "Sat", allowed: 860, blocked: 41 },
  { day: "Sun", allowed: 1142, blocked: 97 },
];

export const latencyTrend = [
  { day: "Mon", ms: 1240 },
  { day: "Tue", ms: 1180 },
  { day: "Wed", ms: 1420 },
  { day: "Thu", ms: 1310 },
  { day: "Fri", ms: 1620 },
  { day: "Sat", ms: 980 },
  { day: "Sun", ms: 1120 },
];

export const departmentSpend = [
  { department: "Engineering", spend: 620, budget: 800 },
  { department: "Marketing", spend: 340, budget: 500 },
  { department: "Finance", spend: 210, budget: 250 },
  { department: "HR", spend: 114, budget: 300 },
];

export const modelSpend = [
  { model: "GPT-4", spend: 620 },
  { model: "Claude 3.5", spend: 440 },
  { model: "Aegis Local", spend: 224 },
];

export const employeeActivity = [
  { title: "Summarize quarterly report", model: "GPT-4", result: "ALLOWED", requestId: "REQ-83921" },
  { title: "Analyze customer document", model: "Aegis Local", result: "REDACTED", requestId: "REQ-8391C" },
  { title: "Generate migration script", model: "Claude 3.5", result: "ALLOWED", requestId: "REQ-83915" },
  { title: "Draft vendor contract email", model: "Claude 3.5", result: "BLOCKED", requestId: "REQ-8390B" },
];