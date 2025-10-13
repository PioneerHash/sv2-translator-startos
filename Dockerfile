# Stage 1: Build the translator
FROM rust:1.89-bookworm AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /build

# Copy the sv2-apps source
COPY sv2-apps ./sv2-apps

# Build the translator from the workspace
WORKDIR /build/sv2-apps/miner-apps
RUN cargo build --release --package translator_sv2

# Stage 2: Create minimal runtime image
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Create app directories
RUN mkdir -p /app/config /app/data

# Copy the binary from builder
COPY --from=builder /build/sv2-apps/miner-apps/target/release/translator_sv2 /usr/local/bin/translator_sv2

# Copy config examples for reference
COPY sv2-apps/miner-apps/translator/config-examples /app/config-examples

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
