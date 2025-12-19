# GP Admin - Web Application

Next.js web application with Clerk authentication and Shadcn UI.

## Features

### Authentication

- Clerk authentication (single-tenant, no organizations)
- Sign-in and sign-up pages
- Protected routes with middleware

### Dashboard Layout

- Responsive sidebar navigation
- Collapsible sidebar (icon mode)
- Mobile-friendly drawer navigation
- User profile dropdown
- Clean header with navigation

### User Management

- User invitation system
- Role-based access control (RBAC):
  - **Admin**: Full access to all features and settings
  - **Sales**: Access to sales features and customer management
  - **Read Only**: View-only access to data and reports
- User list with status indicators
- Invitation form with validation

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp env.example.txt .env.local
   ```

   Add your Clerk API keys to `.env.local`:

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
   CLERK_SECRET_KEY=your_secret_key_here
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3500](http://localhost:3500)

## Project Structure

```
src/
├── app/
│   ├── auth/              # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── dashboard/         # Dashboard pages
│   │   ├── users/         # User management
│   │   └── layout.tsx     # Dashboard layout
│   └── page.tsx           # Home page (redirects to auth/dashboard)
├── components/
│   ├── layout/            # Layout components
│   │   ├── app-sidebar.tsx
│   │   ├── header.tsx
│   │   └── user-nav.tsx
│   ├── users/             # User management components
│   │   └── invite-user-form.tsx
│   └── ui/                # Shadcn UI components
├── config/
│   └── nav.ts             # Navigation configuration
├── lib/
│   └── utils.ts           # Utility functions
├── types/
│   └── roles.ts           # Role types and permissions
└── proxy.ts               # Clerk middleware

```

## Roles & Permissions

### Admin Role

- Users: view, create, edit, delete, invite
- Settings: view, edit
- Data: view, edit, delete

### Sales Role

- Users: view
- Data: view, edit

### Read-Only Role

- Users: view
- Data: view

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Clerk
- **UI Library**: Shadcn UI
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form + Zod
- **Icons**: Lucide React

## Next Steps

To integrate with the API:

1. Create API endpoints for user invitation
2. Connect invitation form to backend API
3. Implement actual user role synchronization
4. Add user role checks in middleware/components
5. Implement role-based UI filtering

## Development Notes

- Authentication is configured for single-tenant (no Clerk organizations)
- User roles are defined in `src/types/roles.ts`
- The invitation system currently shows a mock implementation
- Navigation items can be configured in `src/config/nav.ts`
