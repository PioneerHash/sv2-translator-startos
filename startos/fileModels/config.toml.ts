import { matches, FileHelper } from '@start9labs/start-sdk'
const { object, string, number, literal } = matches

const shape = object({
  // Upstream SV2 Pool/JDC Connection
  upstream_address: string,
  upstream_port: number,
  upstream_authority_pubkey: string,


  // We don't want people changing Downstream and protocol versions
  // Downstream Mining Device Connection
  downstream_address: literal('0.0.0.0').onMismatch('0.0.0.0'),
  downstream_port: literal(34255).onMismatch(34255),
  
  // We don't want people changing Downstream and protocol versions
  // Protocol Version Support
  min_supported_version: literal(2).onMismatch(2),
  max_supported_version: literal(2).onMismatch(2),

  // Extranonce Configuration
  min_extranonce2_size: number,

  // Optional Log File
  log_file: literal('./tproxy.log').onMismatch('./tproxy.log'),

  // Downstream Difficulty Configuration
  downstream_difficulty_config: object({
    min_individual_miner_hashrate: number,
    shares_per_minute: number,
  }),

  // Upstream Difficulty Configuration
  upstream_difficulty_config: object({
    channel_diff_update_interval: number,
    channel_nominal_hashrate: number,
  }),
})

export const configToml = FileHelper.toml(
  {
    volumeId: 'main',
    subpath: '/config.toml',
  },
  shape,
)
