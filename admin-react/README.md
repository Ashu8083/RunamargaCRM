# Runamarga Loan CRM

React frontend for the Runamarga loan CRM.

## Scripts

```bash
npm install
npm start
npm run build
```

## Active Areas

- Login
- Dashboard
- Application filter
- Attendance
- Roles and teams
- Loan applications
- Bank and DSA management

## Backend Setup

Copy `.env.example` to `.env` and set your backend URL.

```bash
REACT_APP_BASE_URL=http://localhost:5000/api
REACT_APP_USE_MOCK_API=false
REACT_APP_AUTH_LOGIN_PATH=/auth/login
REACT_APP_AUTH_REFRESH_PATH=/auth/refresh
REACT_APP_AUTH_LOGOUT_PATH=/auth/logout
```

The login API should return this shape:

```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token",
  "user": {
    "id": "admin_001",
    "name": "Admin Name",
    "email": "admin@example.com",
    "gender": "male",
    "profileImage": "",
    "permissions": ["loans:view", "loans:create"]
  }
}
```

For page APIs, import `apiClient` from `src/app/apiClient.js`. It adds the access token automatically, refreshes once on `401`, retries the failed request, and logs out if refresh fails.

```js
import apiClient from '../../app/apiClient'

const response = await apiClient.get('/loans')
```

For permissions, use `PERMISSIONS` from `src/app/permissions.js`. Routes and sidebar items already read from the logged-in user's `permissions` array. For buttons and modal triggers, wrap the action with `PermissionGate`.

```jsx
import { PERMISSIONS } from './app/permissions'
import PermissionGate from './components/Auth/PermissionGate'

<PermissionGate permission={PERMISSIONS.LOANS_CREATE}>
  <button type="button" className="btn btn-primary">Create Application</button>
</PermissionGate>
```
