import { test, expect, type Page } from '@playwright/test'
import { signInAsAdmin, signInAsSales, signInAsReadOnly } from './helpers/auth'

async function openActionsMenuWithEnabledItem(
  page: Page,
  menuItemName: RegExp | string
) {
  const actionsButtons = page.getByRole('button', { name: 'Open actions menu' })
  const count = await actionsButtons.count()

  for (let index = 0; index < count; index += 1) {
    await actionsButtons.nth(index).click()
    const menuItem = page.getByRole('menuitem', { name: menuItemName })

    if (await menuItem.isVisible()) {
      const isDisabled = await menuItem.getAttribute('aria-disabled')
      if (isDisabled !== 'true') {
        return menuItem
      }
    }

    await page.keyboard.press('Escape')
  }

  return null
}

test.describe('Team Management', () => {
  test.describe('Sidebar Navigation', () => {
    test('Admin can see Team in sidebar', async ({ page }) => {
      await signInAsAdmin(page)
      await expect(page.getByRole('complementary')).toBeVisible()

      const teamLink = page.getByRole('link', { name: 'Team' })
      await expect(teamLink).toBeVisible()
    })

    test('Sales user cannot see Team in sidebar', async ({ page }) => {
      await signInAsSales(page)
      await expect(page.getByRole('complementary')).toBeVisible()

      const teamLink = page.getByRole('link', { name: 'Team' })
      await expect(teamLink).not.toBeVisible()
    })

    test('Read-only user cannot see Team in sidebar', async ({ page }) => {
      await signInAsReadOnly(page)
      await expect(page.getByRole('complementary')).toBeVisible()

      const teamLink = page.getByRole('link', { name: 'Team' })
      await expect(teamLink).not.toBeVisible()
    })
  })

  test.describe('Team Page Access', () => {
    test('Admin can access Team page', async ({ page }) => {
      await signInAsAdmin(page)
      await page.goto('/dashboard/team')

      await expect(
        page.getByRole('heading', { name: 'Team Management' })
      ).toBeVisible()
      await expect(
        page.getByRole('button', { name: /Invite User/i })
      ).toBeVisible()
    })

    test('Non-admin user is redirected when accessing Team page directly', async ({
      page,
    }) => {
      await signInAsSales(page)
      await page.goto('/dashboard/team')

      await expect(page).toHaveURL(/\/dashboard/)
      await expect(
        page.getByRole('heading', { name: 'Team Management' })
      ).not.toBeVisible()
    })
  })

  test.describe('Invite Dialog', () => {
    test.beforeEach(async ({ page }) => {
      await signInAsAdmin(page)
      await page.goto('/dashboard/team')
    })

    test('Admin can open invite dialog', async ({ page }) => {
      await page.getByRole('button', { name: /Invite User/i }).click()

      await expect(
        page.getByRole('heading', { name: 'Invite Team Member' })
      ).toBeVisible()
      const dialog = page.getByRole('dialog')
      await expect(dialog.getByLabel('Email Address')).toBeVisible()
      await expect(dialog.getByLabel('Role', { exact: true })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible()
      await expect(
        page.getByRole('button', { name: 'Send Invitation' })
      ).toBeVisible()
    })

    test('Invalid email domain shows error', async ({ page }) => {
      await page.getByRole('button', { name: /Invite User/i }).click()
      await expect(
        page.getByRole('heading', { name: 'Invite Team Member' })
      ).toBeVisible()

      const emailInput = page.getByLabel('Email Address')
      await emailInput.fill('test@gmail.com')
      await emailInput.blur()

      await expect(
        page.getByText(/Only @goodparty\.org email addresses are allowed/i)
      ).toBeVisible()
    })

    test('Empty email shows error on submit', async ({ page }) => {
      await page.getByRole('button', { name: /Invite User/i }).click()
      await expect(
        page.getByRole('heading', { name: 'Invite Team Member' })
      ).toBeVisible()

      await page.getByRole('button', { name: 'Send Invitation' }).click()

      await expect(page.getByText(/Email is required/i)).toBeVisible()
    })

    test('Can close invite dialog with Cancel button', async ({ page }) => {
      await page.getByRole('button', { name: /Invite User/i }).click()
      await expect(
        page.getByRole('heading', { name: 'Invite Team Member' })
      ).toBeVisible()

      await page.getByRole('button', { name: 'Cancel' }).click()

      await expect(
        page.getByRole('heading', { name: 'Invite Team Member' })
      ).not.toBeVisible()
    })

    test('Valid invitation shows correct role options', async ({ page }) => {
      await page.getByRole('button', { name: /Invite User/i }).click()
      await expect(
        page.getByRole('heading', { name: 'Invite Team Member' })
      ).toBeVisible()

      const dialog = page.getByRole('dialog')
      const roleSelect = dialog.getByLabel('Role', { exact: true })
      await expect(roleSelect).toBeVisible()
      await expect(
        roleSelect.locator('option', { hasText: 'Admin' })
      ).toBeAttached()
      await expect(
        roleSelect.locator('option', { hasText: 'Sales' })
      ).toBeAttached()
      await expect(
        roleSelect.locator('option', { hasText: 'Read Only' })
      ).toBeAttached()
    })
  })

  test.describe('Team Table', () => {
    test.beforeEach(async ({ page }) => {
      await signInAsAdmin(page)
      await page.goto('/dashboard/team')
    })

    test('Team table displays users', async ({ page }) => {
      await expect(page.getByRole('table')).toBeVisible()
      await expect(
        page.getByRole('columnheader', { name: 'Name' })
      ).toBeVisible()
      await expect(
        page.getByRole('columnheader', { name: 'Role' })
      ).toBeVisible()
      await expect(
        page.getByRole('columnheader', { name: 'Status' })
      ).toBeVisible()
    })

    test('Can filter by status', async ({ page }) => {
      const statusFilter = page.getByRole('combobox', {
        name: 'Status filter',
      })
      await expect(statusFilter).toBeVisible()
      await statusFilter.click()

      await expect(
        page.getByRole('option', { name: 'All Status' })
      ).toBeVisible()
      await expect(page.getByRole('option', { name: 'Active' })).toBeVisible()
      await expect(page.getByRole('option', { name: 'Pending' })).toBeVisible()
    })

    test('Can filter by role', async ({ page }) => {
      const roleFilter = page.getByRole('combobox', { name: 'Role filter' })
      await expect(roleFilter).toBeVisible()
      await roleFilter.click()

      await expect(
        page.getByRole('option', { name: 'All Roles' })
      ).toBeVisible()
      await expect(page.getByRole('option', { name: 'Admin' })).toBeVisible()
      await expect(page.getByRole('option', { name: 'Sales' })).toBeVisible()
      await expect(
        page.getByRole('option', { name: 'Read Only' })
      ).toBeVisible()
    })
  })

  test.describe('User Actions', () => {
    test.beforeEach(async ({ page }) => {
      await signInAsAdmin(page)
      await page.goto('/dashboard/team')
    })

    test('Role change confirmation dialog appears', async ({ page }) => {
      await expect(page.getByRole('table')).toBeVisible()
      const salesOption = await openActionsMenuWithEnabledItem(page, /Sales/i)

      if (!salesOption) {
        test.skip(true, 'No eligible user available to change role')
      }

      await expect(page.getByText('Change Role')).toBeVisible()
      await salesOption.click()

      await expect(
        page.getByRole('heading', { name: 'Change Role' })
      ).toBeVisible()
      await expect(
        page.getByText(/Are you sure you want to change/i)
      ).toBeVisible()
      await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible()
      await expect(
        page.getByRole('button', { name: 'Change Role' })
      ).toBeVisible()
    })

    test('Remove user confirmation dialog appears', async ({ page }) => {
      await expect(page.getByRole('table')).toBeVisible()
      const removeOption = await openActionsMenuWithEnabledItem(
        page,
        'Remove User'
      )

      if (!removeOption) {
        test.skip(true, 'No removable user available for this run')
      }

      await removeOption.click()

      await expect(
        page.getByRole('heading', { name: 'Remove User' })
      ).toBeVisible()
      await expect(
        page.getByText(/Are you sure you want to remove/i)
      ).toBeVisible()
      await expect(
        page.getByText(/This action cannot be undone/i)
      ).toBeVisible()
      await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible()
      await expect(
        page.getByRole('button', { name: 'Remove User' })
      ).toBeVisible()
    })
  })

  test.describe('Pending Invitation Actions', () => {
    test('Pending invitation shows Resend and Revoke options', async ({
      page,
    }) => {
      await signInAsAdmin(page)
      await page.goto('/dashboard/team')
      await expect(page.getByRole('table')).toBeVisible()

      const statusFilter = page.getByRole('combobox', {
        name: 'Status filter',
      })
      await statusFilter.click()
      await page.getByRole('option', { name: 'Pending' }).click()

      const actionsButton = page
        .getByRole('button', { name: 'Open actions menu' })
        .first()
      const emptyState = page.getByText('No results.')

      await expect(actionsButton.or(emptyState)).toBeVisible()
      if (await emptyState.isVisible()) {
        test.skip(true, 'No pending invitations available for this run')
      }

      await actionsButton.click()

      await expect(
        page.getByRole('menuitem', { name: 'Resend Invitation' })
      ).toBeVisible()
      await expect(
        page.getByRole('menuitem', { name: 'Revoke Invitation' })
      ).toBeVisible()
    })
  })
})
