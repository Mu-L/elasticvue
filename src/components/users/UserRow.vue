<template>
  <tr>
    <td>
      {{ user.username }}
    </td>
    <td>
      <q-chip v-for="role in user.roles" :key="role" dense color="primary-dark" text-color="white">
        {{ role }}
      </q-chip>
    </td>
    <td>{{ user.full_name }}</td>
    <td>{{ user.email }}</td>
    <td>{{ user.enabled }}</td>
    <td>{{ user.reserved }}</td>
    <td>
      {{ user.deprecated }}
      <q-icon v-if="user.deprecated_reason" name="help">
        <q-tooltip>
          {{ user.deprecated_reason }}
        </q-tooltip>
      </q-icon>
    </td>
    <td>
      <q-btn-group>
        <q-btn icon="edit" color="dark-grey" data-testid="edit-user" @click="emit('edit', user)" />
        <q-btn icon="delete" color="dark-grey" data-testid="delete-user" :disable="user.reserved" @click="deleteUser" />
      </q-btn-group>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ClusterUser } from '../../composables/components/users/ClusterUsers.ts'
import { useUserRow } from '../../composables/components/users/UserRow.ts'

const props = defineProps<{ user: ClusterUser }>()
const emit = defineEmits<{ reload: []; edit: [user: ClusterUser] }>()

const { deleteUser } = useUserRow(props, emit)
</script>
