import { sdk } from '../sdk'
import { configToml } from '../fileModels/config.toml'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  // Upstream SV2 Pool/JDC Connection
  upstream_address: Value.text({
    name: 'Upstream Pool Address',
    description:
      'IP address or hostname of the upstream SV2 pool or Job Declarator Client',
    required: true,
    default: '75.119.150.111',
    placeholder: '75.119.150.111',
  }),
  upstream_port: Value.number({
    name: 'Upstream Pool Port',
    description:
      'Port number for the upstream SV2 pool (typically 34254 for pool, 34265 for JDC)',
    required: true,
    default: 34254,
    min: 1,
    max: 65535,
    integer: true,
  }),
  upstream_authority_pubkey: Value.text({
    name: 'Upstream Authority Public Key',
    description: 'The authority public key of the upstream SV2 pool',
    required: true,
    default: '9auqWEzQDVyd2oe1JVGFLMLHZtCo2FFqZwtKA5gd9xbuEu7PH72',
    placeholder: '9auqWEzQDVyd2oe1JVGFLMLHZtCo2FFqZwtKA5gd9xbuEu7PH72',
  }),

  // Extranonce Configuration
  min_extranonce2_size: Value.number({
    name: 'Minimum Extranonce2 Size',
    description: 'Minimum extranonce2 size (2-16, CGminer max: 8)',
    required: true,
    default: 4,
    min: 2,
    max: 16,
    integer: true,
  }),

  // Downstream Difficulty Configuration
  downstream_difficulty_config: Value.object(
    {
      name: 'Downstream Difficulty Settings',
      description: 'Difficulty settings for mining devices',
    },
    InputSpec.of({
      min_individual_miner_hashrate: Value.number({
        name: 'Minimum Miner Hashrate (H/s)',
        description:
          'Hashrate of the weakest miner in hashes per second (e.g., 10 TH/s = 10000000000000)',
        required: true,
        default: 10000000000000,
        min: 1000000000,
        integer: false,
      }),
      shares_per_minute: Value.number({
        name: 'Target Shares Per Minute',
        description:
          'Target number of shares per minute each miner should submit',
        required: true,
        default: 6.0,
        min: 0.1,
        max: 60,
        integer: false,
      }),
    }),
  ),

  // Upstream Difficulty Configuration
  upstream_difficulty_config: Value.object(
    {
      name: 'Upstream Difficulty Settings',
      description: 'Difficulty settings for pool communication',
    },
    InputSpec.of({
      channel_diff_update_interval: Value.number({
        name: 'Channel Difficulty Update Interval (seconds)',
        description:
          'Seconds to wait before updating channel hashrate with the pool',
        required: true,
        default: 60,
        min: 1,
        integer: true,
      }),
      channel_nominal_hashrate: Value.number({
        name: 'Channel Nominal Hashrate (H/s)',
        description:
          'Total estimated hashrate of all downstream miners in hashes per second',
        required: true,
        default: 10000000000000,
        min: 1000000000,
        integer: false,
      }),
    }),
  ),
})

export const setConfig = sdk.Action.withInput(
  // id
  'set-config',

  // metadata
  async ({ effects }) => ({
    name: 'Configure Translator',
    description:
      'Configure SV2 Translator Proxy settings for pool and mining device connections',
    warning: 'Changing these settings will require restarting the service',
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => configToml.read().const(effects),

  // the execution function
  async ({ effects, input }) => {
    await configToml.merge(effects, input)
  },
)
