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
        // Upstream SV2 Pool/JDC Connection
        upstream_address: '75.119.150.111',
        upstream_port: 34254,
        upstream_authority_pubkey:
          '9auqWEzQDVyd2oe1JVGFLMLHZtCo2FFqZwtKA5gd9xbuEu7PH72',

        // Downstream Mining Device Connection
        downstream_address: '0.0.0.0',
        downstream_port: 34255,

        // Protocol Version Support
        min_supported_version: 2,
        max_supported_version: 2,

        // Extranonce Configuration
        min_extranonce2_size: 4,

        // Downstream Difficulty Configuration
        downstream_difficulty_config: {
          min_individual_miner_hashrate: 10000000000000,
          shares_per_minute: 6.0,
        },

        // Upstream Difficulty Configuration
        upstream_difficulty_config: {
          channel_diff_update_interval: 60,
          channel_nominal_hashrate: 10000000000000,
        },
        log_file: './tproxy.log',
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
