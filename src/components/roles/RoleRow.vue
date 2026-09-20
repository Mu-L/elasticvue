<template>
  <tr class="clickable" @click="expand = !expand">
    <td>
      <q-icon :name="expand ? 'expand_less' : 'expand_more'" />
    </td>
    <td>{{ role.name }}</td>
    <td v-if="showDescription">{{ role.description }}</td>
    <td>
      <q-chip v-for="privilege in role.cluster" :key="privilege" dense color="primary-dark" text-color="white">
        {{ privilege }}
      </q-chip>
    </td>
    <td>{{ role.reserved }}</td>
    <td v-if="showDeprecated">
      {{ role.deprecated }}
      <q-icon v-if="role.deprecated_reason" name="help">
        <q-tooltip>
          {{ role.deprecated_reason }}
        </q-tooltip>
      </q-icon>
    </td>
    <td @click.stop>
      <q-btn-group>
        <q-btn icon="edit" color="dark-grey" data-testid="edit-role" :disable="role.reserved" @click="emit('edit', role)" />
        <q-btn icon="delete" color="dark-grey" data-testid="delete-role" :disable="role.reserved" @click="deleteRole" />
      </q-btn-group>
    </td>
  </tr>

  <tr v-if="expand">
    <td colspan="100%">
      <div class="q-pa-md">
        <resizable-container>
          <code-viewer :value="JSON.stringify(role.raw)" />
        </resizable-container>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import ResizableContainer from '../shared/ResizableContainer.vue'
import { ClusterRole } from '../../composables/components/roles/ClusterRoles.ts'
import { useRoleRow } from '../../composables/components/roles/RoleRow.ts'
import { supportsRoleDescription, supportsSecurityDeprecatedMetadata } from '../../helpers/securitySupport.ts'

const CodeViewer = defineAsyncComponent(() => import('../shared/CodeViewer.vue'))

const props = defineProps<{ role: ClusterRole }>()
const emit = defineEmits<{ reload: []; edit: [role: ClusterRole] }>()
const expand = ref(false)

const showDescription = supportsRoleDescription()
const showDeprecated = supportsSecurityDeprecatedMetadata()
const { deleteRole } = useRoleRow(props, emit)
</script>
