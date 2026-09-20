import { computed } from 'vue'
import { useTranslation } from '../../i18n.ts'
import { genColumns } from '../../../helpers/tableColumns.ts'
import { filterItems } from '../../../helpers/filters.ts'
import { setupFilterState } from '../shared/FilterState.ts'
import { useRolesStore } from '../../../store/roles.ts'
import { ClusterRole } from './ClusterRoles.ts'
import { supportsRoleDescription, supportsSecurityDeprecatedMetadata } from '../../../helpers/securitySupport.ts'

export type RolesTableProps = {
  roles: ClusterRole[]
}

export const useRolesTable = (props: RolesTableProps) => {
  const t = useTranslation()
  const rolesStore = useRolesStore()

  const results = computed(() => props.roles)
  const showDescription = supportsRoleDescription()
  const showDeprecated = supportsSecurityDeprecatedMetadata()

  const filteredResults = computed(() => {
    const columns = showDescription ? ['name', 'description', 'cluster'] : ['name', 'cluster']
    return filterItems(results.value, rolesStore.filter, columns)
  })

  const filterStateProps = setupFilterState(results, filteredResults)

  const columns = genColumns([
    { label: '' },
    { label: t('cluster_roles.roles_table.table.headers.name'), field: 'name', align: 'left' },
    showDescription
      ? { label: t('cluster_roles.roles_table.table.headers.description'), field: 'description', align: 'left' }
      : null,
    { label: t('cluster_roles.roles_table.table.headers.cluster'), field: 'cluster', align: 'left' },
    { label: t('cluster_roles.roles_table.table.headers.reserved'), field: 'reserved', align: 'left' },
    showDeprecated
      ? { label: t('cluster_roles.roles_table.table.headers.deprecated'), field: 'deprecated', align: 'left' }
      : null,
    { label: '' }
  ])

  return {
    filteredResults,
    filterStateProps,
    columns,
    showDescription,
    showDeprecated
  }
}
