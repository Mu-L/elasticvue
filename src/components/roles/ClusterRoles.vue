<template>
  <q-card>
    <q-card-section class="flex items-center">
      <h1 class="text-h5 q-my-none">
        {{ t('cluster_roles.heading') }}
      </h1>
      <reload-button :action="load" v-model="rolesStore.reloadInterval" />
    </q-card-section>

    <q-separator />

    <loader-status :request-state="requestState">
      <roles-table :roles="data || []" @reload="load" />
    </loader-status>
  </q-card>
</template>

<script setup lang="ts">
import RolesTable from './RolesTable.vue'
import LoaderStatus from '../shared/LoaderStatus.vue'
import ReloadButton from '../shared/ReloadButton.vue'
import { useTranslation } from '../../composables/i18n.ts'
import { useClusterRoles } from '../../composables/components/roles/ClusterRoles.ts'

const t = useTranslation()
const { rolesStore, requestState, data, load } = useClusterRoles()
</script>
