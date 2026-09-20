import { onMounted, Ref, ref } from 'vue'
import { RequestState, useElasticsearchAdapter } from '../../CallElasticsearch.ts'
import { useUsersStore } from '../../../store/users.ts'

export type ClusterUser = {
  username: string
  roles: string[]
  full_name: string
  email: string
  enabled: boolean
  reserved: boolean
  deprecated?: boolean
  deprecated_reason?: string
}

type ElasticsearchUser = {
  username?: string
  roles?: string[]
  full_name?: string | null
  email?: string | null
  enabled?: boolean
  metadata?: {
    _reserved?: boolean
    _deprecated?: boolean
    _deprecated_reason?: string
  }
}

export const useClusterUsers = () => {
  const usersStore = useUsersStore()
  const { requestState, callElasticsearch } = useElasticsearchAdapter()
  const data: Ref<ClusterUser[] | null> = ref(null)

  const load = async () => {
    try {
      const users = (await callElasticsearch('securityUsers')) as Record<string, ElasticsearchUser>
      data.value = mapElasticsearchUsers(users)
    } catch (e) {
      console.error(e)
      data.value = null
    }
  }

  onMounted(load)

  return {
    usersStore,
    requestState: requestState as Ref<RequestState>,
    data,
    load
  }
}

const mapElasticsearchUsers = (users: Record<string, ElasticsearchUser>): ClusterUser[] => {
  return Object.entries(users)
    .map(([username, user]) => ({
      username: user.username || username,
      roles: [...(user.roles || [])].sort(),
      full_name: user.full_name || '',
      email: user.email || '',
      enabled: user.enabled !== false,
      reserved: !!user.metadata?._reserved,
      deprecated: !!user.metadata?._deprecated,
      deprecated_reason: user.metadata?._deprecated_reason || ''
    }))
    .sort((a, b) => a.username.localeCompare(b.username))
}
