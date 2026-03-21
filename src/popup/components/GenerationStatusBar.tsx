import {
  CircleAlert,
  CircleCheckBig,
  Clock3,
  LoaderCircle,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type GenerationStatus = "success" | "loading" | "error" | "waiting";

type GenerationStatusBarProps = {
  endpoint: string;
  status: GenerationStatus;
  onRetry: () => void;
  retryLabel: string;
  retryDisabled?: boolean;
  isRetrying?: boolean;
};

const statusConfig: Record<
  GenerationStatus,
  {
    label: string;
    Icon: LucideIcon;
    className: string;
    iconClassName?: string;
  }
> = {
  success: {
    label: "Ready",
    Icon: CircleCheckBig,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  loading: {
    label: "Generating",
    Icon: LoaderCircle,
    className: "border-sky-200 bg-sky-50 text-sky-700",
    iconClassName: "animate-spin",
  },
  error: {
    label: "Error",
    Icon: CircleAlert,
    className: "border-rose-200 bg-rose-50 text-rose-700",
  },
  waiting: {
    label: "Waiting",
    Icon: Clock3,
    className: "border-slate-200 bg-white text-slate-500",
  },
};

export function GenerationStatusBar({
  endpoint,
  status,
  onRetry,
  retryLabel,
  retryDisabled = false,
  isRetrying = false,
}: GenerationStatusBarProps) {
  const { label, Icon, className, iconClassName } = statusConfig[status];

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2">
      <div className="flex min-w-0 items-center gap-2" aria-live="polite">
        <span
          className={cn(
            "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
            className,
          )}
          title={label}
        >
          <Icon className={cn("h-4 w-4", iconClassName)} />
          <span className="sr-only">{label}</span>
        </span>

        <p className="m-0 truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          POST{" "}
          <span className="normal-case tracking-normal text-slate-700">
            {getEndpointPath(endpoint)}
          </span>
        </p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        disabled={retryDisabled}
        aria-label={isRetrying ? `${retryLabel} in progress` : retryLabel}
        title={isRetrying ? `${retryLabel} in progress` : retryLabel}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 text-cyan-800 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isRetrying ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        <span className="sr-only">
          {isRetrying ? `${retryLabel} in progress` : retryLabel}
        </span>
      </button>
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
