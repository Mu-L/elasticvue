import { defineStore } from 'pinia'
import { useConnectionStore } from './connection'
import {
  type PaginationStorePartial,
  type ReloadIntervalStorePartial,
  persistPaginationProps,
  persistReloadIntervalProps,
  paginationStoreDefaultProps
} from './shared'

type UsersState = {
  filter: string
} & PaginationStorePartial &
  ReloadIntervalStorePartial

export const useUsersStore = () => {
  const connectionStore = useConnectionStore()
  const clusterUuid = connectionStore.activeCluster?.uuid || ''
  return defineStore(`users-${clusterUuid}`, {
    state: (): UsersState => ({
      filter: '',
      reloadInterval: null,
      pagination: paginationStoreDefaultProps('username')
    }),
    persist: {
      pick: ['filter', ...persistReloadIntervalProps(), ...persistPaginationProps()],
      key: `users-${clusterUuid}`
    }
  })()
}
