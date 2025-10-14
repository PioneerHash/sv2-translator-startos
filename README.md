<p align="center">
  <img src="icon.png" alt="Project Logo" width="21%">
</p>

# SV2 Translator Proxy for StartOS

A StartOS service package for the Stratum V2 Translator Proxy, enabling mining device connectivity with SV2 pools.

## About

The SV2 Translator Proxy provides protocol translation services for Stratum V2 mining operations. It enables mining devices to connect to SV2 pools with enhanced efficiency, security, and flexibility.

### Features

- Stratum V2 protocol translation
- Enhanced security with encrypted connections to SV2 pools
- Improved efficiency and reduced bandwidth usage
- Support for custom block templates (when used with Job Declarator)

## Setup

Follow the StartOS documentation [guides](https://docs.start9.com/packaging-guide/environment-setup.html) to set up your development environment.

The service uses the [stratum](https://github.com/stratum-mining/stratum) repository as a submodule for the Translator implementation.

## Building

```bash
make
```

## Configuration

The Translator requires configuration to connect to an upstream SV2 pool. Configuration options include:

- Upstream SV2 pool address and port
- Upstream pool authority public key
- Downstream listening address and port (default: 34255)
- Difficulty parameters for both upstream and downstream connections

See the [Translator documentation](https://github.com/stratum-mining/stratum/blob/main/roles/translator/README.md) for detailed configuration options.
