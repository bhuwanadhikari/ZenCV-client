import type { ReactNode } from "react";
import {
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type GenerationStatus = "success" | "loading" | "error" | "waiting";

type GenerationStatusBarProps = {
  endpoint: string;
  status: GenerationStatus;
  onRetry: () => void;
  retryLabel: string;
  extraAction?: ReactNode;
  retryDisabled?: boolean;
  isRetrying?: boolean;
  showEndpoint?: boolean;
};

const statusConfig: Record<
  GenerationStatus,
  {
    label: string;
    className: string;
  }
> = {
  success: {
    label: "Ready",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  loading: {
    label: "Generating",
    className: "border-sky-200 bg-sky-50 text-sky-700",
  },
  error: {
    label: "Error",
    className: "border-rose-200 bg-rose-50 text-rose-700",
  },
  waiting: {
    label: "Waiting",
    className: "border-slate-200 bg-white text-slate-500",
  },
};

export function GenerationStatusBar({
  endpoint,
  status,
  onRetry,
  retryLabel,
  extraAction,
  retryDisabled = false,
  isRetrying = false,
  showEndpoint = false,
}: GenerationStatusBarProps) {
  const { label, className } = statusConfig[status];

  return (
    <div className="flex items-stretch gap-2">
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 rounded-2xl border px-2.5 py-1.5",
          className,
        )}
        aria-live="polite"
      >
        <button
          type="button"
          onClick={onRetry}
          disabled={retryDisabled}
          aria-label={isRetrying ? `${retryLabel} in progress` : retryLabel}
          title={isRetrying ? `${retryLabel} in progress` : retryLabel}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 text-cyan-800 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRetrying ? (
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          <span className="sr-only">
            {isRetrying ? `${retryLabel} in progress` : retryLabel}
          </span>
        </button>

        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          {showEndpoint && (
            <p className="m-0 truncate text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-600">
              POST{" "}
              <span className="normal-case tracking-normal text-slate-700">
                {getEndpointPath(endpoint)}
              </span>
            </p>
          )}

          <span className="shrink-0 text-[12px] font-bold uppercase tracking-[0.12em]">
            {label}
          </span>
        </div>
      </div>

      {extraAction ? (
        <div className="flex shrink-0 items-center rounded-2xl border border-sky-100 bg-sky-50/60 p-0.5">
          {extraAction}
        </div>
      ) : null}
    </div>
  );
}

function getEndpointPath(endpoint: string) {
  try {
    const parsedEndpoint = new URL(endpoint);
    return `${parsedEndpoint.pathname}${parsedEndpoint.search}`;
  } catch {
    if (endpoint.startsWith("/")) {
      return endpoint;
    }

    return endpoint.replace(/^https?:\/\/[^/]+/, "");
  }
}
