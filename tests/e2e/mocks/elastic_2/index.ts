import { Page } from '@playwright/test'
import { mockElasticHome } from './home'
import { mockElasticNodes } from './nodes'
import { catIndices, catAliases } from '../default/indices'
import { buildSecurityUsers, buildSecurityRoles, opensearchInternalUsers } from '../default/users'

const VERSION = '2.4.6'

export const mockElastic2 = async (page: Page, { health }: { health: string } = { health: 'green' }) => {
  await mockElasticHome(page, { health })
  await mockElasticNodes(page)

  const defaultMocks = {
    catIndices,
    catAliases,
    securityUsers: buildSecurityUsers(VERSION),
    opensearchInternalUsers,
    securityRoles: buildSecurityRoles(VERSION)
  }

  for (const method in defaultMocks) {
    const url = defaultMocks[method].url
    const json = defaultMocks[method].json

    await page.route(url, async (route) => await route.fulfill({ json }))
  }
}
