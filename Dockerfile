# Stage 1: Build the translator
FROM rust:1.89-bookworm AS builder

# Set working directory
WORKDIR /build

# Copy the stratum source
COPY stratum ./stratum

# Build the translator from the workspace
WORKDIR /build/stratum/roles
RUN cargo build --release --package translator_sv2

# Stage 2: Create minimal runtime image
FROM debian:bookworm-slim

# Create app directories
RUN mkdir -p /app/config /app/data

# Copy the binary from builder
COPY --from=builder /build/stratum/roles/target/release/translator_sv2 /usr/local/bin/translator_sv2

# Copy config examples for reference
COPY stratum/roles/translator/config-examples /app/config-examples

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set working directory
WORKDIR /app

# Expose default ports
# 34255 - Downstream (mining devices)
EXPOSE 34255

# Entrypoint and default command (will be overridden by StartOS)
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["/app/config/tproxy-config.toml"]
