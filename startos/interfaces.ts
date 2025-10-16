import { sdk } from './sdk'
import { DOWNSTREAM_PORT } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // SV2 Translator exposes a TCP interface for mining devices
  const downstreamMulti = sdk.MultiHost.of(effects, 'downstream-multi')
  const downstreamMultiOrigin = await downstreamMulti.bindPort(DOWNSTREAM_PORT, {
    protocol: null,
    addSsl: null,
    preferredExternalPort: DOWNSTREAM_PORT,
    secure: { ssl: false }
  })
  const downstreamInterface = sdk.createInterface(effects, {
    name: 'Sv2 Translator Mining',
    id: 'translator-mining',
    description: 'Stratum mining interface for connecting Sv1 mining devices',
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const downstreamReceipt = await downstreamMultiOrigin.export([downstreamInterface])

  return [downstreamReceipt]
})
