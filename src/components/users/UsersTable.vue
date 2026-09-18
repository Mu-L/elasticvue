<template>
  <div class="flex justify-between q-pa-md">
    <filter-state
      v-model="usersStore.filter"
      :results-count="filterStateProps.resultsCount"
      :filtered-results-count="filterStateProps.filteredResultsCount"
    />

    <filter-input v-model="usersStore.filter" :columns="['username', 'full_name', 'email', 'roles']" />
  </div>

  <q-table
    class="table-mono table-hide-overflow"
    flat
    dense
    row-key="username"
    :columns="columns"
    :rows="filteredResults"
    data-testid="users-table"
    :rows-per-page-options="DEFAULT_ROWS_PER_PAGE"
    v-model:pagination="usersStore.pagination"
  >
    <template #body="{ row }: { row: ClusterUser }">
      <user-row :user="row" />
    </template>
  </q-table>
</template>

<script setup lang="ts">
import FilterInput from '../shared/FilterInput.vue'
import FilterState from '../shared/FilterState.vue'
import { DEFAULT_ROWS_PER_PAGE } from '../../consts'
import { ClusterUser } from '../../composables/components/users/ClusterUsers.ts'
import { UsersTableProps, useUsersTable } from '../../composables/components/users/UsersTable.ts'
import { useUsersStore } from '../../store/users.ts'
import UserRow from './UserRow.vue'

const usersStore = useUsersStore()
const props = defineProps<UsersTableProps>()
const { columns, filteredResults, filterStateProps } = useUsersTable(props)
</script>
