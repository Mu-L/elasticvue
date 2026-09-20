<template>
  <q-card>
    <q-card-section class="flex items-center">
      <h1 class="text-h5 q-my-none">
        {{ t('shards.heading') }}
      </h1>
      <reload-button :action="load" v-model="shardsStore.reloadInterval" />
    </q-card-section>

    <q-separator />

    <loader-status :request-state="requestState">
      <shards-table :shards="shards" @reload="load">
        <q-select
          v-model="shardsStore.health"
          :options="['green', 'yellow', 'red']"
          :label="t('shards.health')"
          clearable
          dense
          outlined
          class="q-mr-md"
          style="min-width: 140px"
        />
      </shards-table>
    </loader-status>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref, watch } from 'vue'
import ReloadButton from '../shared/ReloadButton.vue'
import LoaderStatus from '../shared/LoaderStatus.vue'
import { useElasticsearchAdapter } from '../../composables/CallElasticsearch'
import { convertShards, EsShardIndex, EsShard, TableShards } from '../../helpers/shards'
import ShardsTable from './ShardsTable.vue'
import { useTranslation } from '../../composables/i18n'
import { EsNode } from '../../types/types.ts'
import { useShardsStore } from '../../store/shards.ts'
const t = useTranslation()
const shards: Ref<TableShards> = ref({} as TableShards)
const shardsStore = useShardsStore()
const { requestState, callElasticsearch } = useElasticsearchAdapter()
const { callElasticsearch: callEnrichment } = useElasticsearchAdapter()

type CatIndicesParams = {
  h: string[]
  s: string[]
  health?: string
}

const load = async () => {
  const catIndicesParams: CatIndicesParams = {
    h: ['index', 'health', 'pri', 'rep', 'status'],
    s: ['health:desc', 'index']
  }

  if (shardsStore.health) catIndicesParams['health'] = shardsStore.health

  try {
    const rawShards = (await callElasticsearch('catShards', CAT_SHARDS_PARAMS)) as EsShard[]

    let indices: EsShardIndex[] = []
    try {
      indices = (await callEnrichment('catIndices', catIndicesParams)) as EsShardIndex[]
    } catch {
      // Index health is enrichment; still show shards without it
      indices = [...new Set(rawShards.map((shard) => shard.index))].map((index) => ({
        index,
        health: '',
        pri: '',
        rep: '',
        status: ''
      }))
    }

    let nodes: Partial<EsNode>[] = []
    try {
      nodes = (await callEnrichment('catNodes', { h: ['name'] })) as Partial<EsNode>[]
    } catch {
      // Node list is enrichment; derive names from shard assignments when missing
      nodes = [
        ...new Set(rawShards.map((shard) => shard.node?.split(/\s/)[0]).filter((name): name is string => Boolean(name)))
      ].map((name) => ({ name }))
    }

    shards.value = convertShards(rawShards, indices, nodes)
  } catch (e) {
    console.error(e)
  }
}

watch(() => shardsStore.health, load)
onMounted(load)

const CAT_SHARDS_PARAMS = {
  h: ['index', 'shard', 'prirep', 'state', 'node', 'docs', 'store', 'ip', 'node', 'unassigned.reason']
}
</script>
