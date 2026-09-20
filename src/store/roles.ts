import { defineStore } from 'pinia'
import { useConnectionStore } from './connection'
import {
  type PaginationStorePartial,
  type ReloadIntervalStorePartial,
  persistPaginationProps,
  persistReloadIntervalProps,
  paginationStoreDefaultProps
} from './shared'

type RolesState = {
  filter: string
} & PaginationStorePartial &
  ReloadIntervalStorePartial

export const useRolesStore = () => {
  const connectionStore = useConnectionStore()
  const clusterUuid = connectionStore.activeCluster?.uuid || ''
  return defineStore(`roles-${clusterUuid}`, {
    state: (): RolesState => ({
      filter: '',
      reloadInterval: null,
      pagination: paginationStoreDefaultProps('name')
    }),
    persist: {
      pick: ['filter', ...persistReloadIntervalProps(), ...persistPaginationProps()],
      key: `roles-${clusterUuid}`
    }
  })()
}
