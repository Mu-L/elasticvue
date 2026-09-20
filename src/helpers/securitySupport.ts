import { clusterVersionAtLeast, clusterVersionGte, versionAtLeast } from './minClusterVersion.ts'
import { useConnectionStore } from '../store/connection.ts'

export const supportsNativeSecurityApi = () => {
  const connectionStore = useConnectionStore()
  const majorVersion = connectionStore.activeCluster?.majorVersion
  if (!majorVersion) return true
  return parseInt(majorVersion) >= 5
}

export const currentSecurityApiBasePath = () => {
  const connectionStore = useConnectionStore()
  const version = connectionStore.activeCluster?.version
  if (!version) return '_security'
  return versionAtLeast(version, '6.6.0') ? '_security' : '_xpack/security'
}

export const securityApiBasePath = (clusterVersion?: string | null) => {
  if (!clusterVersion) return '_security'
  return versionAtLeast(clusterVersion, '6.6.0') ? '_security' : '_xpack/security'
}

export const supportsUserEnabledInBody = () => clusterVersionGte(6)

export const supportsSecurityDeprecatedMetadata = () => clusterVersionAtLeast('7.6.0')

export const supportsRoleApplications = () => clusterVersionAtLeast('6.4.0')

export const supportsAllowRestrictedIndices = () => clusterVersionAtLeast('6.7.0')

export const supportsRoleDescription = () => clusterVersionAtLeast('8.15.0')
