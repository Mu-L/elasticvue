import { Page } from '@playwright/test'
import { mockElasticHome } from './home'
import { mockElasticNodes } from './nodes'
import { catAliases } from '../default/indices'
import { catIndices } from './indices'
import { buildSecurityUsers, buildSecurityRoles, opensearchInternalUsers } from '../default/users'

const VERSION = '8.15.0'

export const mockElastic8 = async (page: Page, { health }: { health: string } = { health: 'green' }) => {
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
