import { onMounted, Ref, ref } from 'vue'
import { RequestState, useElasticsearchAdapter } from '../../CallElasticsearch.ts'
import { useRolesStore } from '../../../store/roles.ts'

export type ClusterRole = {
  name: string
  description: string
  cluster: string[]
  reserved: boolean
  deprecated: boolean
  deprecated_reason: string
  raw: Record<string, unknown>
}

type ElasticsearchRole = {
  description?: string | null
  cluster?: string[]
  metadata?: {
    _reserved?: boolean
    _deprecated?: boolean
    _deprecated_reason?: string
  }
  [key: string]: unknown
}

export const useClusterRoles = () => {
  const rolesStore = useRolesStore()
  const { requestState, callElasticsearch } = useElasticsearchAdapter()
  const data: Ref<ClusterRole[] | null> = ref(null)

  const load = async () => {
    try {
      const roles = (await callElasticsearch('securityRoles')) as Record<string, ElasticsearchRole>
      data.value = mapElasticsearchRoles(roles)
    } catch (e) {
      console.error(e)
      data.value = null
    }
  }

  onMounted(load)

  return {
    rolesStore,
    requestState: requestState as Ref<RequestState>,
    data,
    load
  }
}

const mapElasticsearchRoles = (roles: Record<string, ElasticsearchRole>): ClusterRole[] => {
  return Object.entries(roles)
    .map(([name, role]) => ({
      name,
      description: role.description || '',
      cluster: Array.isArray(role.cluster) ? [...role.cluster].sort() : [],
      reserved: !!role.metadata?._reserved,
      deprecated: !!role.metadata?._deprecated,
      deprecated_reason: role.metadata?._deprecated_reason || '',
      raw: { name, ...role }
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}
