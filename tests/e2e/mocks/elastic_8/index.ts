import { Page } from '@playwright/test'
import { mockElasticHome } from './home'
import { mockElasticNodes } from './nodes'
import { catAliases } from '../default/indices'
import { catIndices } from './indices'
import { securityUsers, opensearchInternalUsers } from '../default/users'

export const mockElastic8 = async (page: Page, { health }: { health: string } = { health: 'green' }) => {
  await mockElasticHome(page, { health })
  await mockElasticNodes(page)

  const defaultMocks = {
    catIndices,
    catAliases,
    securityUsers,
    opensearchInternalUsers
  }

  for (const method in defaultMocks) {
    const url = defaultMocks[method].url
    const json = defaultMocks[method].json

    await page.route(url, async (route) => await route.fulfill({ json }))
  }
}
