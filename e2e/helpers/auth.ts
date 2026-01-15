import { Page } from '@playwright/test'

type UserType = 'default' | 'admin' | 'sales'

interface UserCredentials {
  email: string
  password: string
}

/**
 * Returns credentials for the requested test user type.
 */
function getCredentials(userType: UserType): UserCredentials {
  switch (userType) {
    case 'admin': {
      const email = process.env.CLERK_TEST_ADMIN_EMAIL
      const password = process.env.CLERK_TEST_ADMIN_PASSWORD
      if (!email || !password) {
        throw new Error(
          'CLERK_TEST_ADMIN_EMAIL and CLERK_TEST_ADMIN_PASSWORD environment variables are required'
        )
      }
      return { email, password }
    }
    case 'sales': {
      const email = process.env.CLERK_TEST_SALES_EMAIL
      const password = process.env.CLERK_TEST_SALES_PASSWORD
      if (!email || !password) {
        throw new Error(
          'CLERK_TEST_SALES_EMAIL and CLERK_TEST_SALES_PASSWORD environment variables are required'
        )
      }
      return { email, password }
    }
    case 'default':
    default: {
      const email = process.env.CLERK_TEST_USER_EMAIL
      const password = process.env.CLERK_TEST_USER_PASSWORD
      if (!email || !password) {
        throw new Error(
          'CLERK_TEST_USER_EMAIL and CLERK_TEST_USER_PASSWORD environment variables are required'
        )
      }
      return { email, password }
    }
  }
}

/**
 * Signs in a user via Clerk authentication flow.
 */
export const signIn = async (page: Page, userType: UserType = 'default') => {
  const { email, password } = getCredentials(userType)

  await page.goto('/auth/sign-in')

  const emailInput = page.getByRole('textbox', { name: /email/i })
  await emailInput.waitFor({ state: 'visible' })
  await emailInput.fill(email)
  await page.getByRole('textbox', { name: /password/i }).fill(password)
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.waitForURL(/\/dashboard/)
}

/**
 * Signs in using admin test credentials.
 */
export const signInAsAdmin = async (page: Page) => {
  await signIn(page, 'admin')
}

/**
 * Signs in using sales test credentials.
 */
export const signInAsSales = async (page: Page) => {
  await signIn(page, 'sales')
}

/**
 * Signs in using read-only test credentials.
 */
export const signInAsReadOnly = async (page: Page) => {
  await signIn(page, 'default')
}
