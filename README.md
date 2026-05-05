# Team Manager Assignment

A full-stack web app for managing tasks across teams. Built as part of a full-stack development assignment.

Think of it as a lightweight Trello — users can create projects, invite teammates, assign tasks, and track progress through a simple dashboard.

---

## What it does

- Signup and login with JWT authentication
- Create projects — you automatically become the Admin
- Admins can add or remove members from a project
- Create tasks with title, description, due date, and priority
- Assign tasks to specific team members
- Members can only see and update tasks assigned to them
- Admins have full control over all tasks and members
- Dashboard shows total tasks, status breakdown, tasks per user, and overdue count

---

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Shadcn UI
- Recharts
- Axios

**Backend**
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT + bcryptjs

**Deployment**
- Railway (backend + frontend + database)

---

## Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL running locally

### 1. Clone the repo

```bash
git clone https://github.com/vincentdkafka/team-manager-assignment.git
cd team-task-manager
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/taskmanager"
JWT_SECRET="your_secret_key_here"
PORT=5000
```

Run database migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the backend:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Deployment (Railway)

### 1. Push to GitHub
Make sure your code is pushed to a GitHub repository.

### 2. Create a Railway project
- Go to [railway.app](https://railway.app)
- New Project → Deploy from GitHub repo

### 3. Add PostgreSQL
- Inside Railway project → Add Plugin → PostgreSQL
- Railway auto sets the `DATABASE_URL` environment variable

### 4. Deploy Backend
- Add a new service → select your GitHub repo
- Set root directory to `backend`
- Add environment variables:
  - `JWT_SECRET` → your secret key
  - `NODE_ENV` → production
  - `PORT` → 5000
- Railway will run `npm start` automatically

### 5. Deploy Frontend
- Add another service → same GitHub repo
- Set root directory to `frontend`
- Add environment variable:
  - `VITE_API_URL` → your Railway backend URL + `/api`
- Railway will build with `npm run build` and serve the dist


## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and get token |
| GET | `/api/projects` | Yes | Get my projects |
| POST | `/api/projects` | Yes | Create a project |
| POST | `/api/projects/:id/members` | Admin | Add a member |
| DELETE | `/api/projects/:id/members/:uid` | Admin | Remove a member |
| GET | `/api/projects/:id/tasks` | Yes | Get project tasks |
| POST | `/api/projects/:id/tasks` | Yes | Create a task |
| PUT | `/api/projects/:id/tasks/:tid` | Yes | Update a task |
| DELETE | `/api/projects/:id/tasks/:tid` | Admin | Delete a task |
| GET | `/api/dashboard` | Yes | Get dashboard stats |

---

## Notes

- Make sure PostgreSQL is running before starting the backend locally
- The `.env` files are not committed to git — you need to create them manually
- Prisma migrations need to be run once before the backend works
