FROM grafana/alloy:latest

WORKDIR /etc/alloy
COPY config.alloy config.alloy

CMD ["run", "config.alloy", "--server.http.listen-addr", "0.0.0.0:12345"]