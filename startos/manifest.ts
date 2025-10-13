import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const BUILD = process.env.BUILD || ''

const architectures =
  BUILD === 'x86_64' || BUILD === 'aarch64' ? [BUILD] : ['x86_64', 'aarch64']

export const manifest = setupManifest({
  id: 'sv2-translator',
  title: 'SV2 Translator Proxy',
  license: 'MIT OR Apache-2.0',
  wrapperRepo: 'https://github.com/Start9Labs/sv2-translator-startos',
  upstreamRepo: 'https://github.com/stratum-mining/sv2-apps',
  supportSite: 'https://stratumprotocol.org',
  marketingSite: 'https://stratumprotocol.org',
  donationUrl: 'https://opensats.org/projects/stratumv2',
  docsUrl:
    'https://github.com/stratum-mining/sv2-apps/blob/main/miner-apps/translator/README.md',
  description: {
    short: 'Stratum V2 protocol translation for mining',
    long: 'The SV2 Translator Proxy provides Stratum V2 protocol translation services for mining devices, enabling enhanced efficiency, security, and flexibility for Bitcoin mining operations.',
  },
  volumes: ['main'],
  images: {
    'sv2-translator': {
      source: { dockerTag: 'start9/sv2-translator' },
      arch: architectures,
    } as SDKImageInputSpec,
  },
  hardwareRequirements: {
    arch: architectures,
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
