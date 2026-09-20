import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSnackbar } from '../../../src/composables/Snackbar'
import { useSnackbarStore } from '../../../src/store/snackbar'
import { RequestState } from '../../../src/composables/CallElasticsearch'

describe('composables/Snackbar.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows an explicit Forbidden title for 403 responses', () => {
    const { showSnackbar } = useSnackbar()
    const store = useSnackbarStore()

    const requestState: RequestState = {
      loading: false,
      networkError: false,
      apiError: true,
      apiErrorMessage: JSON.stringify({
        error: {
          type: 'security_exception',
          reason: 'no permissions for [indices:admin/aliases/get]'
        },
        status: 403
      }),
      status: 403
    }

    showSnackbar(requestState)

    expect(store.title).toBe('403 Forbidden - security_exception')
    expect(store.body).toBe('Reason: no permissions for [indices:admin/aliases/get]')
    expect(store.color).toBe('warning')
  })
})
