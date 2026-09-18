import { test, expect } from '@playwright/test'
import { setupClusterConnection } from '../../helpers'
import { withElastic } from '../../mocks'

test.describe.configure({ mode: 'parallel' })

withElastic(({ mockElastic, elastic }) => {
  test.describe(`elasticsearch ${elastic.version}`, () => {
    test.describe('Users', () => {
      test('shows a list of users', async ({ page }) => {
        await mockElastic(page)
        await setupClusterConnection(page)
        await page.locator('#users').click()

        const table = page.getByTestId('users-table')

        await expect(table).toContainText('app_user')
        await expect(table).toContainText('read_only')
      })

      test('can filter users', async ({ page }) => {
        await mockElastic(page)
        await setupClusterConnection(page)
        await page.locator('#users').click()

        const table = page.getByTestId('users-table')

        await page.locator('input[name="filter"]').fill('app_user')
        await expect(table).toContainText('app_user')

        await page.locator('input[name="filter"]').fill('LOREM_IPSUM_INVALID_USER_NAME')
        await expect(table).not.toContainText('app_user')
      })
    })
  })
})
