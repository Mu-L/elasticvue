<template>
  <q-dialog v-model="dialog" transition-duration="100" @hide="resetForm">
    <q-card style="width: 500px">
      <q-card-section class="flex justify-between">
        <h2 class="text-h6 q-my-none">
          {{ t('cluster_users.edit_user.heading') }}
        </h2>
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>

      <q-separator />

      <user-form
        v-model="user"
        :form-valid="formValid"
        :loading="loading"
        :roles-loading="rolesLoading"
        :filtered-role-options="filteredRoleOptions"
        :submit-label="t('defaults.update')"
        :reserved="reserved"
        submit-id="update_user"
        is-edit
        @submit="updateUser"
        @filter-roles="filterRoles"
      />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useTranslation } from '../../composables/i18n'
import { useEditUser } from '../../composables/components/users/EditUser'
import UserForm from './UserForm.vue'

const t = useTranslation()
const emit = defineEmits(['reload'])

const {
  dialog,
  user,
  reserved,
  formValid,
  loading,
  rolesLoading,
  filteredRoleOptions,
  openDialog,
  updateUser,
  resetForm,
  filterRoles
} = useEditUser(emit)

defineExpose({ openDialog })
</script>
