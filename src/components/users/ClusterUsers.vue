<template>
  <q-card>
    <q-card-section class="flex items-center">
      <h1 class="text-h5 q-my-none">
        {{ t('cluster_users.heading') }}
      </h1>
      <reload-button :action="load" v-model="usersStore.reloadInterval" />
    </q-card-section>

    <q-separator />

    <loader-status :request-state="requestState">
      <users-table :users="data || []" />
    </loader-status>
  </q-card>
</template>

<script setup lang="ts">
import UsersTable from './UsersTable.vue'
import LoaderStatus from '../shared/LoaderStatus.vue'
import ReloadButton from '../shared/ReloadButton.vue'
import { useTranslation } from '../../composables/i18n.ts'
import { useClusterUsers } from '../../composables/components/users/ClusterUsers.ts'

const t = useTranslation()
const { usersStore, requestState, data, load } = useClusterUsers()
</script>
