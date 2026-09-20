import { computed } from 'vue'
import { useTranslation } from '../../i18n.ts'
import { genColumns } from '../../../helpers/tableColumns.ts'
import { filterItems } from '../../../helpers/filters.ts'
import { setupFilterState } from '../shared/FilterState.ts'
import { useUsersStore } from '../../../store/users.ts'
import { ClusterUser } from './ClusterUsers.ts'
import { supportsSecurityDeprecatedMetadata, supportsUserEnabledInBody } from '../../../helpers/securitySupport.ts'

export type UsersTableProps = {
  users: ClusterUser[]
}

export const useUsersTable = (props: UsersTableProps) => {
  const t = useTranslation()
  const usersStore = useUsersStore()

  const results = computed(() => props.users)
  const filteredResults = computed(() => {
    return filterItems(results.value, usersStore.filter, ['username', 'full_name', 'email', 'roles'])
  })

  const filterStateProps = setupFilterState(results, filteredResults)

  const showEnabled = supportsUserEnabledInBody()
  const showDeprecated = supportsSecurityDeprecatedMetadata()

  const columns = genColumns([
    { label: t('cluster_users.users_table.table.headers.username'), field: 'username', align: 'left' },
    { label: t('cluster_users.users_table.table.headers.roles'), field: 'roles', align: 'left' },
    { label: t('cluster_users.users_table.table.headers.full_name'), field: 'full_name', align: 'left' },
    { label: t('cluster_users.users_table.table.headers.email'), field: 'email', align: 'left' },
    showEnabled ? { label: t('cluster_users.users_table.table.headers.enabled'), field: 'enabled', align: 'left' } : null,
    { label: t('cluster_users.users_table.table.headers.reserved'), field: 'reserved', align: 'left' },
    showDeprecated
      ? { label: t('cluster_users.users_table.table.headers.deprecated'), field: 'deprecated', align: 'left' }
      : null,
    { label: '' }
  ])

  return {
    filteredResults,
    filterStateProps,
    columns,
    showEnabled,
    showDeprecated
  }
}
