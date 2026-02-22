export const buildQueryFromTableOptions = (pagination: any) => {
  if (!pagination) return {}

  const from = (pagination.page - 1) * pagination.rowsPerPage
  const size = pagination.rowsPerPage
  const newQueryParts = { size, from, sort: [] }

  const order = pagination.descending ? 'desc' : 'asc'
  const sort: string = pagination.sortBy

  if (sort && order) {
    const sortOptions = {}
    // @ts-expect-error any
    sortOptions[sort] = { order }
    // @ts-expect-error never type
    newQueryParts.sort = [sortOptions]
  }

  return newQueryParts
}

function tableSortMatchesQuerySort(tableSort: unknown, querySort: unknown): boolean {
  if (!Array.isArray(tableSort) || tableSort.length !== 1) return false
  if (!Array.isArray(querySort) || querySort.length < 1) return false
  return JSON.stringify(tableSort[0]) === JSON.stringify(querySort[0])
}

export const getTableOptionsToApply = (
  query: Record<string, unknown>,
  tableOptions: Record<string, unknown>,
  pagination: { sortBy?: string }
): Record<string, unknown> => {
  const querySort = query['sort']
  const hasMultiSort = Array.isArray(querySort) && querySort.length > 1
  const hasSingleSort = Array.isArray(querySort) && querySort.length === 1
  const tableHasSort = Boolean(pagination.sortBy)
  const tableMatchesQuery = hasSingleSort && tableHasSort && tableSortMatchesQuerySort(tableOptions.sort, querySort)

  if (hasMultiSort) return onlyFromAndSize(tableOptions)
  if (hasSingleSort && !tableMatchesQuery) return onlyFromAndSize(tableOptions)
  return tableOptions
}

function onlyFromAndSize(tableOptions: Record<string, unknown>): Record<string, unknown> {
  return {
    size: (tableOptions as { size?: number }).size,
    from: (tableOptions as { from?: number }).from
  }
}
