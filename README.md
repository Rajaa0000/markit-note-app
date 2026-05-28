# markIT - Full-Stack Notes and Task Manager


markIT is a full-stack productivity application for creating notes, organizing task lists, and managing a focused personal workspace. The project combines a Django REST API with JWT authentication and a polished Next.js frontend.

The application supports account creation, login, persistent sessions, note management, pinned notes, pastel note colors, task lists, task completion, list dates, search, password management, and account deletion.

## Project Highlights

- Full-stack architecture with a separate frontend and backend
- JWT authentication with short-lived access tokens and HttpOnly refresh cookies
- Notes CRUD with pinning, colors, search, soft delete, and ownership protection
- The usage of cursor pagination for sending the notes and the tasks lists
- Task-list CRUD with nested tasks, task completion, editable list titles, and list dates
- Password reset, password change, logout, and account deletion flows
- Clean dashboard UI with protected routes, loading states, and error boundaries
- Production-oriented backend settings with environment-based configuration

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide React icons

### Backend

- Django 6
- Django REST Framework
- Simple JWT
- SQLite for local development
- PostgreSQL-compatible production configuration through `DATABASE_URL`
- CORS support with credentials
- Gunicorn and WhiteNoise for deployment

## Repository Structure

```text
notesApp/
├── my-next-app/                 # Next.js frontend
│   ├── app/                     # App Router pages and layouts
│   ├── components/              # Shared and feature UI components
│   ├── lib/                     # Auth provider and frontend context
│   ├── services/                # API client and workspace API helpers
│   └── public/                  # Static assets
├── djagno-app/
│   └── notesAppV1/              # Django backend
│       ├── notes/               # Notes API
│       ├── todolists/           # Todo list and task API
│       ├── users/               # Authentication and account API
│       └── notesAppV1/          # Django project settings
├── API_DOCUMENTATION.md
└── README.md
```

## Core Features

### Authentication

- Register with username, email, and password
- Login with username and password
- Access token stored in memory on the frontend
- Refresh token stored as an HttpOnly cookie by the backend
- Automatic access-token refresh on protected requests
- Logout clears the refresh cookie and frontend session
- Password reset and password change endpoints

### Notes

- Create notes with title, text, color, and pinned status
- View pinned and unpinned notes
- Edit notes
- Delete notes through backend soft delete
- Search notes by title
- Color-coded note cards

### Task Lists

- Create task lists with optional date selection in the UI
- View task-list completion counts
- Edit list titles
- Edit list dates
- Delete lists
- Add tasks to a list
- Mark tasks complete or incomplete
- Delete tasks
- Search lists and tasks on the frontend

##  Visual Walkthrough

### Authentication
Here is a look at the clean user onboarding experience:

<img src="./app_images/sign_in_page.png" alt="markIT Sign In Page" width="700" />

---

###  Dashboard Overview
The main hub of the application, displaying a responsive split-view system:

<img src="./app_images/app_main_section.png" alt="markIT Main Section" width="700" />

---

#### Settings Workspace
<img src="./app_images/settings_dashboard_section.png" alt="Settings Panel" width="700" />

###  Core Features

#### Notes Management
Features include layout pinning, custom color background tagging, and seamless categorization.
<img src="./app_images/notes_dashboard_section.png" alt="Notes Workspace" width="700" />

#### Task & Deadlines Tracker
Built-in nested task architecture to track milestones, check list progression, and manage dates.
<img src="./app_images/task_dashboard_section.png" alt="Task Workspace" width="700" />

#### Features Section Breakdown
<img src="./app_images/app_features_section.png" alt="App Features Panel" width="700" />
---



## Frontend Setup

From the frontend folder:

```bash
cd my-next-app
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:3000
```

### Frontend Environment Variables

Create `my-next-app/.env.local` if you want to override the deployed backend URL:

```env
NEXT_PUBLIC_API_BASE_URL=https://notes-app-1-88gd.onrender.com
```

If this variable is missing, the frontend falls back to the deployed backend URL already configured in the API client.

### Frontend Scripts

```bash
npm run dev      # Start local development server
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Backend Setup

From the backend folder:

```bash
cd djagno-app/notesAppV1
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The backend runs locally at:

```text
http://localhost:8000
```

### Backend Environment Variables

Recommended backend variables:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
DATABASE_URL=postgresql://user:password@host:port/dbname
FRONTEND_URL=http://localhost:3000
```

For local development, the backend falls back to SQLite when `DATABASE_URL` is not provided.

## Authentication Flow

1. The user logs in or registers.
2. The backend returns an access token and sets a refresh token as an HttpOnly cookie.
3. The frontend stores the access token in memory.
4. Authenticated API requests include `Authorization: Bearer <access_token>`.
5. If an access token expires, the frontend calls the refresh endpoint.
6. If the refresh cookie is still valid, the backend returns a new access token.
7. If refresh fails, protected pages redirect to login.

This means users can leave the app and come back without logging in again until the refresh cookie expires or they explicitly sign out.

## API Documentation

Detailed endpoint documentation is available in:

[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Deployment Notes

### Frontend

The Next.js app can be deployed on platforms such as Vercel, Netlify, or any Node-compatible hosting provider. Set `NEXT_PUBLIC_API_BASE_URL` to the deployed backend URL.

### Backend

The Django backend is deployment-ready for platforms such as Render, Railway, or similar services. In production, set:

- `SECRET_KEY`
- `DEBUG=False`
- `ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`
- `DATABASE_URL`
- `FRONTEND_URL`

## Quality Checks

Frontend checks used during development:

```bash
npm run lint
npm run build
```

Backend checks:

```bash
python manage.py check
python manage.py test
```

## Author

Built by Chahinez Habouchi as a full-stack portfolio project.
