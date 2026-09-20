import { test, expect } from '@playwright/test'
import { setupClusterConnection } from '../../helpers'
import { withElastic } from '../../mocks'

test.describe.configure({ mode: 'parallel' })

withElastic(({ mockElastic, elastic }) => {
  if (elastic.node.startsWith('os-')) return

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

      test('can create a user', async ({ page }) => {
        await mockElastic(page)
        await page.route('http://localhost:9200/_security/user/new_user', async (route) => {
          if (route.request().method() === 'PUT') {
            await route.fulfill({ json: { created: true } })
            return
          }
          await route.fallback()
        })
        await setupClusterConnection(page)
        await page.locator('#users').click()

        await page.locator('#new_user').click()
        await page.locator('.q-dialog input[name="username"]').fill('new_user')
        await page.locator('.q-dialog input[name="password"]').fill('secret-password')

        await page.getByTestId('user-form-roles').click()
        await page.getByRole('option', { name: 'read_only' }).click()
        await page.keyboard.press('Escape')

        await page.locator('#create_user').click()
        await expect(page.locator('.q-dialog')).toHaveCount(0)
      })

      test('can edit a user', async ({ page }) => {
        await mockElastic(page)
        await page.route('http://localhost:9200/_security/user/app_user', async (route) => {
          if (route.request().method() === 'PUT') {
            await route.fulfill({ json: { created: false } })
            return
          }
          await route.fallback()
        })
        await setupClusterConnection(page)
        await page.locator('#users').click()

        const table = page.getByTestId('users-table')
        await table.locator('tr', { hasText: 'app_user' }).getByTestId('edit-user').click()

        await expect(page.locator('.q-dialog input[name="username"]')).toHaveValue('app_user')
        await expect(page.locator('.q-dialog input[name="username"]')).toHaveAttribute('readonly', '')

        await page.getByTestId('user-form-roles').click()
        await page.getByRole('option', { name: 'viewer' }).click()
        await page.keyboard.press('Escape')

        await page.locator('#update_user').click()
        await expect(page.locator('.q-dialog')).toHaveCount(0)
      })

      test('can delete a user', async ({ page }) => {
        await mockElastic(page)
        await page.route('http://localhost:9200/_security/user/app_user', async (route) => {
          if (route.request().method() === 'DELETE') {
            await route.fulfill({ json: { found: true } })
            return
          }
          await route.fallback()
        })
        await setupClusterConnection(page)
        await page.locator('#users').click()

        page.once('dialog', (dialog) => dialog.accept())

        const table = page.getByTestId('users-table')
        await table.locator('tr', { hasText: 'app_user' }).getByTestId('delete-user').click()

        await expect(page.getByText("The user 'app_user' was successfully deleted.")).toBeVisible()
      })
      test('can edit a reserved user password', async ({ page }) => {
        await mockElastic(page)
        await page.route('http://localhost:9200/_security/user/elastic/_password', async (route) => {
          if (route.request().method() === 'PUT') {
            await route.fulfill({ json: {} })
            return
          }
          await route.fallback()
        })
        await setupClusterConnection(page)
        await page.locator('#users').click()

        const table = page.getByTestId('users-table')
        await table.locator('tr', { hasText: 'elastic' }).getByTestId('edit-user').click()

        await expect(page.locator('.q-dialog input[name="username"]')).toBeDisabled()
        await expect(page.getByTestId('user-form-roles')).toBeDisabled()
        await page.locator('.q-dialog input[name="password"]').fill('new-secret')

        await page.locator('#update_user').click()
        await expect(page.locator('.q-dialog')).toHaveCount(0)
      })
    })
  })
})
