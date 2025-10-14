import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { configToml } from '../fileModels/config.toml'
import { sdk } from '../sdk'
import { setConfig } from '../actions/setConfig'

export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
    ;(await Promise.all([
      configToml.write(effects, {
        // Downstream Mining Device Connection
        downstream_address: '0.0.0.0',
        downstream_port: 34255,

        // Protocol Version Support
        min_supported_version: 2,
        max_supported_version: 2,

        // Extranonce Configuration
        downstream_extranonce2_size: 4,

        // User Identity
        user_identity: 'start9',

        // Channel Aggregation
        aggregate_channels: true,

        // Log File
        log_file: './tproxy.log',

        // Downstream Difficulty Configuration
        downstream_difficulty_config: {
          min_individual_miner_hashrate: 10000000000000,
          shares_per_minute: 6.0,
          enable_vardiff: true,
        },

        // Upstream SV2 Pool/JDC Connections
        upstreams: [
          {
            address: '75.119.150.111',
            port: 34254,
            authority_pubkey:
              '9auqWEzQDVyd2oe1JVGFLMLHZtCo2FFqZwtKA5gd9xbuEu7PH72',
          },
        ],
      }),
    ]),
      // critical - needs to be done before start
      // important - dismissible
      // optional - less in the user's face
      await sdk.action.createOwnTask(effects, setConfig, 'critical', {
        reason: 'Configure your SV2 Translator Proxy settings',
      }))
  },
})
