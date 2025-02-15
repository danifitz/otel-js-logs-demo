const opentelemetry = require("@opentelemetry/sdk-node")
const {getNodeAutoInstrumentations} = require("@opentelemetry/auto-instrumentations-node")
const { PinoInstrumentation } = require('@opentelemetry/instrumentation-pino');
const {OTLPTraceExporter} = require('@opentelemetry/exporter-trace-otlp-grpc')
const {containerDetector} = require('@opentelemetry/resource-detector-container')
const {envDetector, hostDetector, osDetector, processDetector} = require('@opentelemetry/resources')
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');

// Set up OpenTelemetry diagnostics for debugging
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// Initialize OpenTelemetry SDK with logs
const logExporter = new OTLPLogExporter({ url: 'http://grafana-alloy:4318/v1/logs' });

const sdk = new opentelemetry.NodeSDK({
    logRecordProcessor: new opentelemetry.logs.SimpleLogRecordProcessor(logExporter),
    logExporter,
    traceExporter: new OTLPTraceExporter(),
    instrumentations: [
      getNodeAutoInstrumentations(),
      new PinoInstrumentation({
        // See below for Pino instrumentation options.
      }),
    ],
    resourceDetectors: [
      // containerDetector,
      envDetector,
      // hostDetector,
      // osDetector,
      // processDetector,
    ],
  })
  
sdk.start();
console.log('OpenTelemetry SDK initialized.');
module.export = sdk;