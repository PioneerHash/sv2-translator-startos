import { sdk } from './sdk'
import { downstreamPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // SV2 Translator exposes a TCP interface for mining devices
  const downstreamMulti = sdk.MultiHost.of(effects, 'downstream-multi')
  const downstreamMultiOrigin = await downstreamMulti.bindPort(downstreamPort, {
    protocol: 'tcp',
  })
  const downstreamInterface = sdk.createInterface(effects, {
    name: 'Stratum Mining',
    id: 'stratum-mining',
    description: 'Stratum mining interface for connecting mining devices',
    type: 'tcp',
    masked: false,
    schemeOverride: null,
    username: null,
    path: null,
    query: null,
  })

  const downstreamReceipt = await downstreamMultiOrigin.export([downstreamInterface])

  return [downstreamReceipt]
})
