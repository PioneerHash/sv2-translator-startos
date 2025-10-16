import { configToml } from './fileModels/config.toml'
import { sdk } from './sdk'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting SV2 Translator Proxy!')

  // watch the config.toml for changes and restart
  // read(file => file.whatever) watches specific aspects of the file
  await configToml.read().const(effects)

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * The SV2 Translator Proxy provides Stratum V2 protocol translation for mining devices.
   */
  return sdk.Daemons.of(effects, started).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: 'sv2-translator' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/data',
        readonly: false,
      }),
      'sv2-translator-sub',
    ),
    exec: {
      command: ['translator_sv2', '-c', '/data/config.toml']
    },
    ready: {
      display: 'SV2 Translator Service',
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, 34255, {
          successMessage: 'The SV2 Translator is accepting mining device connections',
          errorMessage: 'The SV2 Translator is not ready',
        }),
    },
    requires: [],
  })
})
