# Safvacut V3 - E2E Test Plan (Cypress)

## Overview
This document outlines the comprehensive end-to-end testing strategy for the Safvacut V3 cryptocurrency exchange application using Cypress.

## Test Environment Setup

### Prerequisites
```bash
npm install --save-dev cypress @testing-library/cypress
```

### Configuration
```javascript
// cypress.config.js
module.exports = {
  e2e: {
    baseUrl: 'http://localhost:5000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
  },
}
```

## Test Suites

### 1. Authentication Flow Tests

#### 1.1 User Signup
**Test:** `should successfully create a new user account`
- Navigate to `/signup`
- Fill in email and password
- Click signup button
- Verify redirect to dashboard
- Verify user profile creation in database
- **Expected:** User successfully created and logged in

#### 1.2 User Login
**Test:** `should login with valid credentials`
- Navigate to `/login`
- Enter valid email and password
- Click login button
- Verify redirect to dashboard
- **Expected:** Successful authentication

#### 1.3 Login Validation
**Test:** `should show error with invalid credentials`
- Navigate to `/login`
- Enter invalid credentials
- Click login button
- Verify error toast appears
- **Expected:** Error message displayed

#### 1.4 Session Persistence
**Test:** `should maintain session after refresh`
- Login successfully
- Refresh the page
- Verify user remains logged in
- **Expected:** Session persists across refresh

#### 1.5 Logout
**Test:** `should logout user successfully`
- Login as user
- Click logout button
- Verify redirect to login page
- Attempt to visit `/dashboard`
- **Expected:** Redirect to login page

---

### 2. Dashboard Tests

#### 2.1 Dashboard Loading
**Test:** `should display dashboard with user data`
- Login as user
- Navigate to dashboard
- Verify UID is displayed
- Verify portfolio value is shown
- Verify all supported tokens are listed
- **Expected:** Dashboard loads with correct data

#### 2.2 Portfolio Calculation
**Test:** `should calculate total portfolio value correctly`
- Login as user with known balances
- Navigate to dashboard
- Verify total USD value matches expected calculation
- **Expected:** Accurate portfolio value displayed

#### 2.3 Copy UID Feature
**Test:** `should copy UID to clipboard`
- Navigate to dashboard
- Click copy UID button
- Verify success toast appears
- Verify clipboard contains UID
- **Expected:** UID copied successfully

#### 2.4 QR Code Display
**Test:** `should show profile QR code modal`
- Navigate to dashboard
- Click QR code icon
- Verify modal appears
- Verify QR code is displayed
- Click outside modal to close
- **Expected:** QR modal opens and closes correctly

#### 2.5 Dark Mode Toggle
**Test:** `should toggle dark mode`
- Navigate to dashboard
- Click dark mode toggle
- Verify dark class applied to document
- Verify localStorage updated
- Refresh page
- **Expected:** Dark mode persists

---

### 3. Deposit Flow Tests

#### 3.1 Deposit Address Generation
**Test:** `should generate unique deposit address for each token`
- Login as user
- Navigate to `/deposit`
- Select BTC
- Verify deposit address is generated
- Switch to ETH
- Verify different address is generated
- **Expected:** Unique addresses per token

#### 3.2 QR Code Display
**Test:** `should display QR code for deposit address`
- Navigate to deposit page
- Select token
- Verify QR code is rendered
- Verify QR code contains deposit address
- **Expected:** QR code displays correctly

#### 3.3 Copy Deposit Address
**Test:** `should copy deposit address to clipboard`
- Navigate to deposit page
- Click copy address button
- Verify success toast
- Verify clipboard contains address
- **Expected:** Address copied successfully

#### 3.4 Token Switching
**Test:** `should update deposit address when switching tokens`
- Navigate to deposit page
- Note BTC address
- Switch to USDT
- Verify address changed
- Switch back to BTC
- **Expected:** Address matches original BTC address

---

### 4. Withdrawal Flow Tests

#### 4.1 Withdrawal Submission
**Test:** `should submit withdrawal request successfully`
- Login as user with balance
- Navigate to `/withdraw`
- Select token
- Enter valid address
- Enter amount less than balance
- Submit withdrawal
- **Expected:** Withdrawal request created

#### 4.2 Insufficient Balance
**Test:** `should prevent withdrawal exceeding balance`
- Navigate to withdraw page
- Select token
- Enter amount greater than balance
- Submit form
- **Expected:** Error message displayed

#### 4.3 MAX Button
**Test:** `should populate max available balance`
- Navigate to withdraw page
- Click MAX button
- Verify amount field contains full balance
- **Expected:** Amount equals current balance

#### 4.4 Rate Limiting
**Test:** `should enforce 30-second rate limit`
- Submit first withdrawal
- Immediately attempt second withdrawal
- Verify button is disabled
- Verify countdown timer appears
- Wait 30 seconds
- **Expected:** Second withdrawal blocked, then allowed after 30s

#### 4.5 Address Validation
**Test:** `should require withdrawal address`
- Navigate to withdraw page
- Leave address empty
- Enter amount
- Submit form
- **Expected:** Validation error shown

---

### 5. Transaction History Tests

#### 5.1 History Page Loading
**Test:** `should display transaction history`
- Login as user with transactions
- Navigate to `/history`
- Verify transactions are listed
- Verify sorted by date (newest first)
- **Expected:** Transactions displayed correctly

#### 5.2 Empty State
**Test:** `should show empty state with no transactions`
- Login as new user
- Navigate to `/history`
- Verify empty state message
- Verify "Make deposit" button
- **Expected:** Empty state displayed

#### 5.3 Real-time Updates
**Test:** `should update history when new transaction occurs`
- Login as user
- Open history page
- Trigger deposit (via admin or API)
- Verify new transaction appears without refresh
- **Expected:** Real-time updates working

#### 5.4 Transaction Details
**Test:** `should display complete transaction information`
- Navigate to history with transactions
- Verify each transaction shows:
  - Type (deposit/withdraw)
  - Status (pending/completed/failed)
  - Amount and token
  - Timestamp
  - Transaction hash (if available)
- **Expected:** All details visible

---

### 6. Admin Panel Tests

#### 6.1 Admin Access Control
**Test:** `should restrict admin panel to admins only`
- Login as regular user
- Navigate to `/admin`
- Verify redirect to dashboard
- **Expected:** Access denied for non-admin

#### 6.2 Admin Dashboard Access
**Test:** `should allow admin user to access admin panel`
- Login as admin user
- Navigate to `/admin`
- Verify admin panel loads
- **Expected:** Admin panel accessible

#### 6.3 Withdrawal Approval
**Test:** `should approve pending withdrawal`
- Login as admin
- Navigate to admin panel
- Find pending withdrawal
- Enter transaction hash
- Click approve
- Verify withdrawal status updated
- Verify user balance decreased
- **Expected:** Withdrawal approved and processed

#### 6.4 Deposit Crediting
**Test:** `should credit user deposit`
- Login as admin
- Navigate to admin panel
- Enter user ID, token, amount, tx hash
- Submit deposit credit
- Verify user balance increased
- Verify transaction record created
- **Expected:** Deposit credited successfully

#### 6.5 User List
**Test:** `should display all users and balances`
- Login as admin
- Navigate to `/admin/users`
- Verify user list displays
- Verify balances shown for each user
- Use search to filter users
- **Expected:** User management working

---

### 7. Error Boundary Tests

#### 7.1 Error Catching
**Test:** `should catch and display component errors`
- Trigger error in component (via dev tools or API failure)
- Verify error boundary displays
- Verify error message shown
- Click "Try Again" button
- **Expected:** Graceful error handling

#### 7.2 Error Recovery
**Test:** `should allow recovery from errors`
- Trigger error
- Click "Go Home" button
- Verify redirect to dashboard
- **Expected:** User can navigate away from error

---

### 8. Responsive Design Tests

#### 8.1 Mobile Layout
**Test:** `should display correctly on mobile devices`
- Set viewport to mobile (375x667)
- Navigate through all pages
- Verify layout adapts
- Verify all buttons clickable
- **Expected:** Mobile-friendly UI

#### 8.2 Tablet Layout
**Test:** `should display correctly on tablets`
- Set viewport to tablet (768x1024)
- Navigate through all pages
- Verify grid layouts adjust
- **Expected:** Tablet-optimized UI

---

### 9. Performance Tests

#### 9.1 Page Load Time
**Test:** `should load pages within acceptable time`
- Measure load time for each page
- Verify < 3 seconds on good connection
- **Expected:** Fast page loads

#### 9.2 Real-time Updates Performance
**Test:** `should handle real-time updates without lag`
- Open dashboard
- Trigger multiple balance updates
- Verify UI updates smoothly
- **Expected:** Smooth real-time updates

---

### 10. Security Tests

#### 10.1 Protected Routes
**Test:** `should redirect unauthenticated users`
- Clear session
- Navigate to `/dashboard`
- Verify redirect to `/login`
- **Expected:** Protected routes secured

#### 10.2 XSS Prevention
**Test:** `should sanitize user inputs`
- Attempt to inject script tags in forms
- Verify scripts not executed
- **Expected:** XSS attacks prevented

#### 10.3 SQL Injection Prevention
**Test:** `should prevent SQL injection in queries`
- Attempt SQL injection in address fields
- Verify queries sanitized
- **Expected:** SQL injection blocked

---

## Test Data Setup

### Seed Data
```javascript
// cypress/fixtures/users.json
{
  "regularUser": {
    "email": "user@test.com",
    "password": "Test1234!",
    "uid": "SFV-12345678-abcdef01"
  },
  "adminUser": {
    "email": "admin@test.com",
    "password": "Admin1234!",
    "uid": "SFV-admin123-456789ab"
  }
}

// cypress/fixtures/balances.json
{
  "testBalances": {
    "BTC": "0.05000000",
    "ETH": "1.25000000",
    "USDT": "1000.00000000",
    "USDC": "500.00000000"
  }
}
```

## Custom Cypress Commands

```javascript
// cypress/support/commands.js

// Login command
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/dashboard')
})

// Logout command
Cypress.Commands.add('logout', () => {
  cy.contains('Sign Out').click()
  cy.url().should('include', '/login')
})

// Create test user
Cypress.Commands.add('createUser', (email, password) => {
  cy.visit('/signup')
  cy.get('input[type="email"]').type(email)
  cy.get('input[name="password"]').first().type(password)
  cy.get('input[name="confirmPassword"]').type(password)
  cy.get('button[type="submit"]').click()
})

// Set user balance (via API)
Cypress.Commands.add('setBalance', (userId, token, amount) => {
  cy.request({
    method: 'POST',
    url: '/api/admin/set-balance',
    body: { userId, token, amount }
  })
})
```

## Running Tests

### Run All Tests
```bash
npx cypress run
```

### Run Specific Suite
```bash
npx cypress run --spec "cypress/e2e/auth.cy.js"
```

### Open Cypress UI
```bash
npx cypress open
```

### Run in CI/CD
```bash
npx cypress run --record --key <record-key>
```

## Test Metrics & Success Criteria

### Coverage Goals
- **Authentication:** 100% coverage
- **Core Features:** 95% coverage
- **Admin Features:** 90% coverage
- **Error Handling:** 85% coverage

### Performance Benchmarks
- Page load: < 3 seconds
- API response: < 500ms
- Real-time updates: < 100ms latency

### Pass Rate Target
- **Minimum:** 95% pass rate
- **Goal:** 98% pass rate

## Continuous Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  cypress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: cypress-io/github-action@v4
        with:
          start: npm run dev
          wait-on: 'http://localhost:5000'
          record: true
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
```

## Maintenance & Updates

### Regular Review
- Review tests monthly
- Update after major features
- Refactor flaky tests
- Add tests for bug fixes

### Test Stability
- Implement retry logic for flaky tests
- Use proper waits (cy.wait() vs hard timeouts)
- Clean test data between runs
- Use consistent test selectors

---

## Notes

- All tests should be independent and idempotent
- Use data-testid attributes for stable selectors
- Mock external API calls where appropriate
- Keep test data separate from production
- Document known flaky tests and their causes
