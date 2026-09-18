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
      <q-icon name="help" v-if="user.deprecated_reason">
        <q-tooltip>
          {{ user.deprecated_reason }}
        </q-tooltip>
      </q-icon>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ClusterUser } from '../../composables/components/users/ClusterUsers.ts'

defineProps<{ user: ClusterUser }>()
</script>
