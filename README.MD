# Otel JS Logs demo

## Setup

1. Replace your details in `alloy/config.alloy` with the OTLP details from your Grafana Cloud stack

```
otelcol.exporter.otlphttp "grafana_cloud" {
	client {
		endpoint = "REPLACE"
		auth     = otelcol.auth.basic.grafana_cloud.handler
	}
}

otelcol.auth.basic "grafana_cloud" {
	username = "REPLACE"
	password = "REPLACE"
}
```

2. `podman compose up --build`