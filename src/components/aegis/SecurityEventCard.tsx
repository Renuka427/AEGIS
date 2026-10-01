import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import type { SecurityEvent } from "@/lib/mock-data";

const DOT: Record<string, string> = {
  CRITICAL: "bg-critical",
  HIGH: "bg-high",
  MEDIUM: "bg-medium",
  LOW: "bg-muted-foreground",
};

export function SecurityEventCard({ event }: { event: SecurityEvent }) {
  return (
    <Link
      to="/investigations/$eventId"
      params={{ eventId: event.id }}
      className="panel group flex items-start gap-3 p-4 transition-colors hover:bg-accent/40"
    >
      <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", DOT[event.severity])} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold">{event.type}</p>
          <StatusBadge value={event.severity} dot={false} />
          <StatusBadge value={event.action} dot={false} />
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {event.user} · {event.model} · {event.ago}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{event.summary}</p>
      </div>
      <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}