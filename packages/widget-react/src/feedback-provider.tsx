import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_API_ORIGIN,
  FasterFixesClient,
  resolveReviewerToken,
} from "@fasterfixes/core";
import type {
  Labels,
  WidgetConfig,
  WidgetPosition,
} from "@fasterfixes/core";
import type { ClassNames } from "./context.js";
import { FeedbackProviderCore } from "./feedback-provider-core.js";

type FeedbackProviderProps = {
  /** Public Project ID (`proj_...`) from your Faster Fixes project settings. */
  projectId?: string;
  /**
   * @deprecated Use `projectId` instead. Still accepted for backward
   * compatibility; will be removed in a future major version.
   */
  apiKey?: string;
  apiOrigin?: string;
  color?: string;
  position?: WidgetPosition;
  classNames?: Partial<ClassNames>;
  labels?: Partial<Labels>;
  // Capture a Diagnostic Trail (console + network) with each feedback. Code-managed,
  // not a dashboard setting; set false to opt a site out of capture entirely.
  captureDiagnostics?: boolean;
  children: React.ReactNode;
};

export function FeedbackProvider({
  projectId,
  apiKey,
  apiOrigin,
  color,
  position,
  classNames,
  labels,
  captureDiagnostics = true,
  children,
}: FeedbackProviderProps) {
  const [reviewerToken, setReviewerToken] = useState<string | null>(null);
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Prefer projectId; fall back to the deprecated apiKey. The server resolves
  // either a `proj_` Project ID or a legacy `ff_` key from the same header.
  const identifier = projectId ?? apiKey ?? "";

  const client = useMemo(
    () => new FasterFixesClient({ apiKey: identifier, apiOrigin }),
    [identifier, apiOrigin],
  );

  useEffect(() => {
    const token = resolveReviewerToken();
    if (!token) {
      setInitialized(true);
      return;
    }
    setReviewerToken(token);

    async function init() {
      try {
        const cfg = await client.getConfig();
        setConfig(cfg);
      } catch {
        // Config fetch failed — widget won't render
      }
      setInitialized(true);
    }

    void init();
  }, [client]);

  // Always render the core so the element type above `children` never changes.
  // Switching between a bare fragment and the core after the config fetch
  // resolves would reparent — and therefore remount — the entire host app.
  // The core stays inert (no effects, no portal) until token + config arrive.
  const active =
    initialized && !!reviewerToken && !!config && config.enabled;

  return (
    <FeedbackProviderCore
      client={client}
      reviewerToken={active ? reviewerToken : null}
      config={active ? config : null}
      color={color}
      position={position}
      classNames={classNames}
      labels={labels}
      captureDiagnostics={captureDiagnostics}
      apiOrigin={apiOrigin ?? DEFAULT_API_ORIGIN}
    >
      {children}
    </FeedbackProviderCore>
  );
}
