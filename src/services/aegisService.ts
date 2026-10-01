/**
 * Domain services for Aegis.
 *
 * ASSUMPTION (documented): the Spring Boot backend will expose
 *   GET  /api/users, /api/models, /api/policies, /api/audit, /api/security/events
 *   POST /api/policies, /api/chat
 * Until those endpoints exist each function resolves mock data from
 * src/lib/mock-data.ts after a simulated latency, so swapping in `api.request`
 * is a one-line change per function.
 */
import { api } from "./api";
import {
  auditLogs,
  models,
  policies,
  securityEvents,
  users,
  type AuditRecord,
  type Policy,
} from "@/lib/mock-data";

export const userService = {
  async list() {
    await api.simulateLatency(300);
    return users;
  },
};

export const modelService = {
  async list() {
    await api.simulateLatency(300);
    return models;
  },
};

export const policyService = {
  async list() {
    await api.simulateLatency(300);
    return policies;
  },
  async create(policy: Omit<Policy, "id" | "createdAt" | "createdBy" | "triggers30d">) {
    await api.simulateLatency(500);
    return {
      ...policy,
      id: `POL-${Math.floor(Math.random() * 900 + 100)}`,
      createdAt: "Sep 7, 2026",
      createdBy: "Admin",
      triggers30d: 0,
    } satisfies Policy;
  },
};

export const auditService = {
  async list() {
    await api.simulateLatency(300);
    return auditLogs;
  },
  async byId(id: string): Promise<AuditRecord | undefined> {
    await api.simulateLatency(200);
    return auditLogs.find((r) => r.id === id);
  },
};

export const securityService = {
  async events() {
    await api.simulateLatency(300);
    return securityEvents;
  },
  async event(id: string) {
    await api.simulateLatency(200);
    return securityEvents.find((e) => e.id === id);
  },
};