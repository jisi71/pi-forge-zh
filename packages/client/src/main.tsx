import { Component, StrictMode, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { App } from "./App";
import "./index.css";
import { bootTheme } from "./lib/theme";
import { bootLocale, t } from "./i18n";

// Apply the persisted theme BEFORE React mounts so the first paint
// uses the correct palette (no dark→light flash on a Light theme
// reload). `bootTheme` reads localStorage synchronously and sets
// `<html data-theme>`; CSS rules in index.css then provide the
// matching neutral palette to every Tailwind class.
bootTheme();

// Resolve the UI language BEFORE React mounts (persisted preference →
// `?lang=` override → browser detection) and stamp `<html lang>` so the
// first paint is already in the right language. Missing translations
// fall back to English at lookup time — see ./i18n.
bootLocale();

// Auto-register the service worker (vite-plugin-pwa). `autoUpdate` mode
// silently swaps in new shells on the next reload — no banner needed.
registerSW({ immediate: true });

/**
 * Dev-time error boundary that renders the error visibly on the page when
 * a render throws. Without this, an uncaught React error in StrictMode
 * leaves the page blank — the very symptom we just hit. Production builds
 * keep this too: a visible error is better than a silent blank screen.
 */
class RootErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  override state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Console-only. We previously fired a "log breadcrumb" `GET
    // /api/v1/health`, which surfaced nothing useful server-side and
    // was confusing in dev tools. Real client-error reporting is a
    // Phase 18 polish item.
    console.error("[pi-forge] root render error", error, info);
  }

  override render(): ReactNode {
    if (this.state.error !== null) {
      return (
        <main
          style={{
            padding: "2rem",
            fontFamily: "monospace",
            color: "#fca5a5",
            background: "#0a0a0a",
            minHeight: "100vh",
            whiteSpace: "pre-wrap",
            overflow: "auto",
          }}
        >
          <h1 style={{ color: "#fff", marginBottom: "1rem" }}>{t("errors.crash.title")}</h1>
          <p style={{ color: "#d4d4d4", marginBottom: "1rem" }}>{this.state.error.message}</p>
          <pre style={{ fontSize: "11px", color: "#a3a3a3" }}>
            {this.state.error.stack ?? t("errors.crash.noStack")}
          </pre>
          <p style={{ marginTop: "2rem", color: "#71717a", fontSize: "12px" }}>
            {t("errors.crash.tip")}
          </p>
        </main>
      );
    }
    return this.props.children;
  }
}

window.addEventListener("error", (e) => {
  console.error("[pi-forge] uncaught error", e.error);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("[pi-forge] unhandled rejection", e.reason);
});

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("#root element missing in index.html");
}

createRoot(rootEl).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);
