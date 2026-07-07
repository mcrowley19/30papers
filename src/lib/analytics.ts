type AnalyticsProvider = "none" | "goatcounter";

function normalizeProvider(rawProvider: string | undefined): AnalyticsProvider {
  if (!rawProvider) return "none";
  const normalized = rawProvider.trim().toLowerCase();
  if (normalized === "goatcounter") return "goatcounter";
  return "none";
}

function appendScript(src: string, dataset?: Record<string, string>): void {
  if (typeof document === "undefined") return;
  if (document.querySelector(`script[src="${src}"]`)) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = src;

  if (dataset) {
    Object.entries(dataset).forEach(([key, value]) => {
      script.dataset[key] = value;
    });
  }

  document.head.appendChild(script);
}

function loadGoatCounter(): void {
  const code = import.meta.env.VITE_GOATCOUNTER_CODE as string | undefined;
  if (!code) {
    console.warn("[analytics] GoatCounter is enabled but VITE_GOATCOUNTER_CODE is missing.");
    return;
  }

  const endpoint = code.startsWith("http") ? code : `https://${code}.goatcounter.com/count`;
  appendScript("//gc.zgo.at/count.js", { goatcounter: endpoint });
}

export function initAnalytics(): void {
  const provider = normalizeProvider(import.meta.env.VITE_ANALYTICS_PROVIDER as string | undefined);
  if (provider === "goatcounter") {
    loadGoatCounter();
  }
}
