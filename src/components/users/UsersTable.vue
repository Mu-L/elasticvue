<template>
  <div class="flex justify-between q-pa-md">
    <div class="flex items-center">
      <new-user @reload="emit('reload')" />
      <filter-state
        v-model="usersStore.filter"
        :results-count="filterStateProps.resultsCount"
        :filtered-results-count="filterStateProps.filteredResultsCount"
        class="q-ml-md"
      />
    </div>

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
      <user-row :user="row" @reload="emit('reload')" @edit="openEditDialog" />
    </template>
  </q-table>

  <edit-user ref="editUser" @reload="emit('reload')" />
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import FilterInput from '../shared/FilterInput.vue'
import FilterState from '../shared/FilterState.vue'
import { DEFAULT_ROWS_PER_PAGE } from '../../consts'
import { ClusterUser } from '../../composables/components/users/ClusterUsers.ts'
import { UsersTableProps, useUsersTable } from '../../composables/components/users/UsersTable.ts'
import { useUsersStore } from '../../store/users.ts'
import UserRow from './UserRow.vue'
import NewUser from './NewUser.vue'
import EditUser from './EditUser.vue'

const usersStore = useUsersStore()
const props = defineProps<UsersTableProps>()
const emit = defineEmits(['reload'])
const { columns, filteredResults, filterStateProps } = useUsersTable(props)

const editUser = useTemplateRef<InstanceType<typeof EditUser>>('editUser')
const openEditDialog = (user: ClusterUser) => {
  editUser.value?.openDialog(user)
}
</script>
