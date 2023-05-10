import { defineStore } from 'pinia'
import { DEFAULT_PAGINATION, DEFAULT_SEARCH_QUERY } from '../consts'

export const useSearchStore = defineStore('search', {
  state: () => ({
    q: '*',
    indices: '*',
    searchQuery: DEFAULT_SEARCH_QUERY,
    searchQueryCollapsed: false,
    filter: '',
    selectedColumns: [],
    columns: [],
    stickyTableHeader: true,
    pagination: DEFAULT_PAGINATION
  }),
  actions: {
    resetSearchQuery () {
      this.searchQuery = DEFAULT_SEARCH_QUERY
    }
  },
  persist: {
    paths: [
      'q',
      'indices',
      'searchQuery',
      'searchQueryCollapsed',
      'stickyTableHeader',
      'pagination'
    ]
  }
})
