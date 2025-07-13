// src/lib/server/observability.ts
import { Otlp } from "@effect/opentelemetry";
import { FetchHttpClient } from "@effect/platform"; // Correct import from @effect/platform
import { Layer } from "effect";

// This single layer will handle Tracing, Metrics, and Logging.
export const ObservabilityLive = Otlp.layer({
  // You will get this URL from your BetterStack/Logtail settings.
  // It's the base URL for their OTLP Ingest API.
  baseUrl: process.env.OTLP_BASE_URL!, 
  resource: {
    serviceName: "life-io-backend",
    serviceVersion: "0.1.0" // Or read from package.json
  },
  // These are optional but good for performance tuning.
  loggerExportInterval: "1 second",
  tracerExportInterval: "5 seconds",
  metricsExportInterval: "10 seconds"
}).pipe(
  // Provide the FetchHttpClient layer.
  // When run in Bun, this will automatically use Bun's native fetch.
  Layer.provide(FetchHttpClient.layer)
);
