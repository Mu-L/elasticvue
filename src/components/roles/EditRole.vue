<template>
  <q-dialog v-model="dialog" transition-duration="100" @show="triggerResize" @hide="resetForm">
    <q-card style="width: 700px; max-width: 90vw">
      <q-card-section class="flex justify-between">
        <h2 class="text-h6 q-my-none">
          {{ t('cluster_roles.edit_role.heading') }}
        </h2>
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>

      <q-separator />

      <role-form
        v-model="role"
        :form-valid="formValid"
        :loading="loading"
        :submit-label="t('defaults.update')"
        submit-id="update_role"
        is-edit
        @submit="updateRole"
      />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useTranslation } from '../../composables/i18n'
import { useEditRole } from '../../composables/components/roles/EditRole'
import RoleForm from './RoleForm.vue'

const t = useTranslation()
const emit = defineEmits(['reload'])

const { dialog, role, formValid, loading, openDialog, updateRole, resetForm } = useEditRole(emit)
const triggerResize = () => window.dispatchEvent(new Event('resize'))

defineExpose({ openDialog })
</script>
