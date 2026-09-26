# Workout Buddy

A full-stack fitness companion application that combines workout tracking, AI-powered food photography nutrition analysis, trainer booking, a community social feed, and an admin panel — all in one platform.

## Tech Stack

| Layer      | Technology                                        |
| ---------- | ------------------------------------------------- |
| Backend    | Node.js, Express 5, Mongoose 9 (MongoDB ODM)      |
| Frontend   | React 19, Vite 8, React Router 7, Tailwind CSS 3  |
| UI / Motion| Framer Motion 13, Recharts 3 (charts)             |
| HTTP Client| Axios                                             |
| Auth       | JWT + bcryptjs (password hashing)                 |
| Uploads    | Multer (disk + in-memory storage)                 |
| AI         | OpenAI Responses API (food vision model)          |
| Database   | MongoDB Atlas (cloud)                             |
| Linting    | Oxlint                                            |

## Project Structure

```
workout-buddy/
├── backend/                    # Express REST API
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/            # Request handlers (auth, workouts, trainers, etc.)
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT `protect` + `admin` guards
│   │   └── upload.js           # Multer disk + memory upload config
│   ├── models/                 # Mongoose schemas (6 models)
│   ├── routes/                 # Express routers (7 route files)
│   ├── uploads/                # Uploaded post images (served statically)
│   ├── .env.example            # Environment variable template
│   ├── seed.js                 # Trainer seeding script
│   └── index.js                # Server entry point
└── frontend/                   # React SPA (Vite)
    ├── public/
    ├── src/
    │   ├── components/         # WorkoutTracker, BookingSystem, NutritionTracker,
    │   │                       # CommunityFeed, ProfileModal
    │   ├── constants/
    │   │   └── workoutPlans.js # Prebuilt workout program templates
    │   ├── context/
    │   │   └── AuthContext.jsx # Global auth state + JWT persistence
    │   ├── pages/              # LandingPage, Auth, Dashboard, AdminPanel
    │   ├── App.jsx             # Router setup
    │   └── main.jsx
    └── index.html
```

---

## Getting Started

### Prerequisites

- Node.js (modern LTS)
- MongoDB connection string (Atlas or local)
- OpenAI API key (for food photo analysis)

### 1. Backend Setup

```bash
cd backend
npm install

cp .env.example .env
#   then fill in MONGO_URI, JWT_SECRET, OPENAI_API_KEY, OPENAI_FOOD_VISION_MODEL

# Optional: seed sample trainers
node seed.js

# Start the server
npm run dev        # development (nodemon, auto-reloads)
# or
npm start          # production
```

The backend runs on `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` (Vite default). It makes API calls to `http://localhost:5000`, so the backend must be running for authenticated features.

| Command            | Purpose                          |
| ------------------ | -------------------------------- |
| `npm run dev`      | Start Vite dev server            |
| `npm run build`    | Build production bundle to `dist`|
| `npm run preview`  | Preview the production build     |
| `npm run lint`     | Run Oxlint                      |

### Environment Variables

| Variable                     | Description                          |
| ---------------------------- | ------------------------------------ |
| `PORT`                       | Server port (default `5000`)         |
| `MONGO_URI`                  | MongoDB connection string            |
| `JWT_SECRET`                 | Secret used to sign JWTs             |
| `OPENAI_API_KEY`             | OpenAI API key for food vision       |
| `OPENAI_FOOD_VISION_MODEL`   | OpenAI model id used for image analysis |

---

## API Reference

Base URL: `http://localhost:5000`

### Authentication — `/api/auth`

| Method | Path               | Description                          | Auth |
| ------ | ------------------ | ------------------------------------ | ---- |
| POST   | `/api/auth/register` | Register a user, returns JWT + user | Public |
| POST   | `/api/auth/login`    | Login, returns JWT + user           | Public |
| GET    | `/api/auth/me`       | Get current user's profile          | ✔ |

### Workouts — `/api/workouts`

| Method | Path                 | Description                              | Auth |
| ------ | -------------------- | ---------------------------------------- | ---- |
| POST   | `/api/workouts`      | Log a workout (exercise, sets, reps, weight) | ✔ |
| GET    | `/api/workouts`      | List user's workouts, newest first       | ✔ |
| DELETE | `/api/workouts/:id`  | Delete a workout (owner only)            | ✔ |

### Trainers & Bookings — `/api/trainers`

| Method | Path                              | Description                                      | Auth |
| ------ | --------------------------------- | ------------------------------------------------ | ---- |
| GET    | `/api/trainers/trainers`          | List all trainers                                | Public |
| GET    | `/api/trainers/slots`             | Get available slots (`?trainerId=X&date=YYYY-MM-DD`) | ✔ |
| POST   | `/api/trainers/book`             | Book a session (trainerId, date, slot)           | ✔ |
| GET    | `/api/trainers/my-bookings`       | List the user's bookings                         | ✔ |
| DELETE | `/api/trainers/bookings/:id`      | Cancel a booking (owner only)                    | ✔ |

### Nutrition — `/api/nutrition`

| Method | Path                         | Description                                        | Auth |
| ------ | ---------------------------- | -------------------------------------------------- | ---- |
| POST   | `/api/nutrition`             | Add a single meal (foodName, calories, macros)     | ✔ |
| GET    | `/api/nutrition`             | Get today's meals for the user                     | ✔ |
| POST   | `/api/nutrition/analyze-image` | Upload a food photo, get AI-estimated nutrition  | ✔ |
| POST   | `/api/nutrition/batch`       | Add 1–8 meals at once (used to save AI results)    | ✔ |

### Community — `/api/community`

| Method | Path                           | Description                            | Auth |
| ------ | ------------------------------ | -------------------------------------- | ---- |
| GET    | `/api/community/posts`         | Get all posts, newest first            | Public |
| POST   | `/api/community/posts`         | Create a post (optional image upload)  | ✔ |
| PUT    | `/api/community/posts/:id/like` | Toggle like/unlike on a post          | ✔ |
| DELETE | `/api/community/posts/:id`     | Delete a post (owner only)             | ✔ |

### Admin — `/api/admin`

| Method | Path                   | Description                | Auth                        |
| ------ | ---------------------- | -------------------------- | --------------------------- |
| GET    | `/api/admin/stats`     | User, trainer, booking counts | ✔ + `admin` role         |
| GET    | `/api/admin/users`     | List all users             | ✔ + `admin` role            |
| GET    | `/api/admin/trainers`  | List all trainers          | ✔ + `admin` role            |

### Users — `/api/users`

| Method | Path                  | Description                                     | Auth |
| ------ | --------------------- | ----------------------------------------------- | ---- |
| PUT    | `/api/users/profile`  | Update profile (name, goal, weight, height, phone, gender, injuries, emergencyContact) | ✔ |

### Static / Misc

| Method | Path          | Description                                      |
| ------ | ------------- | ------------------------------------------------ |
| GET    | `/`           | Status message: "Workout Buddy API is running..." |
| GET    | `/uploads/*`  | Serves uploaded images from `backend/uploads/`    |

---

## Data Models

### User
| Field           | Type            | Constraints                        |
| --------------- | --------------- | ---------------------------------- |
| `name`          | String          | required                           |
| `email`         | String          | required, unique                   |
| `password`      | String          | required (bcrypt-hashed)           |
| `role`          | String          | default `user`; enum `user`/`trainer`/`admin` |
| `weight`        | Number          | optional                           |
| `height`        | Number          | optional                           |
| `goal`          | String          | optional                           |
| `phone`         | String          | optional                           |
| `gender`        | String          | enum `Male`/`Female`/`Other`       |
| `injuries`      | String          | optional                           |
| `emergencyContact` | String      | optional                           |

### Workout
| Field      | Type     | Constraints             |
| ---------- | -------- | ----------------------- |
| `user`     | ObjectId → User | required          |
| `exercise` | String   | required                |
| `sets`     | Number   | required                |
| `reps`     | Number   | required                |
| `weight`   | Number   | required                |
| `date`     | Date     | default: now            |

### Trainer
| Field          | Type                              | Constraints              |
| -------------- | --------------------------------- | ------------------------ |
| `name`         | String                            | required                 |
| `specialty`    | String                            | required                 |
| `bio`          | String                            | optional                 |
| `experience`   | Number (years)                    | optional                 |
| `profileImage` | String                            | default placeholder      |
| `availability` | Array of `{ day, slots[] }`       | day enum Monday–Sunday; slots are string times e.g. `"09:00"` |

### Booking
| Field     | Type            | Constraints               |
| --------- | --------------- | ------------------------- |
| `user`    | ObjectId → User | required                  |
| `trainer` | ObjectId → Trainer | required              |
| `date`    | String          | required (ISO `YYYY-MM-DD`) |
| `slot`    | String          | required (e.g. `"10:00"`) |

### Meal
| Field      | Type            | Constraints       |
| ---------- | --------------- | ----------------- |
| `user`     | ObjectId → User | required          |
| `foodName` | String          | required          |
| `calories` | Number          | required          |
| `protein`  | Number          | default 0         |
| `carbs`    | Number          | default 0         |
| `fats`     | Number          | default 0         |
| `date`     | Date            | default: now      |

### Post
| Field      | Type                    | Constraints                     |
| ---------- | ----------------------- | ------------------------------- |
| `user`     | ObjectId → User         | required                        |
| `content`  | String                  | required                        |
| `image`    | String                  | optional (e.g. `/uploads/x.jpg`)|
| `likes`    | Array of ObjectId → User| users who liked                 |
| `comments` | Array of `{ user, text, createdAt }` | nested subdocuments      |

---

## Frontend Features

### Pages
- **`/` — LandingPage** — Animated marketing landing with hero, feature cards, trainers preview, community preview, and call-to-action sections (Framer Motion).
- **`/auth` — Auth** — Dual-mode login/register form (email + password, or name/email/password/goal). Stores token + user in localStorage.
- **`/dashboard` — Dashboard** — The authenticated hub. Header with avatar, Admin button (for admin role), and logout. Tabbed interface for the four main features, plus a profile edit modal.
- **`/admin` — AdminPanel** — Stat cards (members / trainers / bookings), a member directory, and a trainer roster. Requires the `admin` role.

### Dashboard Tabs / Components
1. **WorkoutTracker** — Log workouts, view them with delete, pick a quick-start workout plan (from 4 built-in programs), and view a strength progress chart (Recharts).
2. **BookingSystem** — Browse trainers, pick a date, see available time slots, book, and cancel sessions.
3. **NutritionTracker** — **Photo Estimate (Beta)**: upload a food photo (≤5MB JPEG/PNG/WebP) → OpenAI analyzes it and returns estimated macros, which you can edit before confirming. Also supports manual meal logging and shows daily calorie/macro totals.
4. **CommunityFeed** — Create posts with optional images, browse the feed, like/unlike, and delete your own posts.
5. **ProfileModal** — Edit profile fields (name, phone, goal, gender, weight, height, injuries, emergency contact).

---

## Key Integrations

### OpenAI Food Vision
- `POST /api/nutrition/analyze-image` sends a base64 food photo + optional portion hint to the OpenAI Responses API using the configured vision model.
- Uses a strict JSON schema to enforce structured output: 1–8 food items each with `foodName`, `estimatedPortion`, `calories`, `protein`, `carbs`, `fats`, and `confidence` (`low`/`medium`/`high`), plus top-level `notes`.
- A safety prompt ignores instructions embedded in images, avoids identifying people or medical claims, and instructs conservative macro estimates.
- Returns 503 if env vars are missing, 502 on AI/validation failures, 429 on rate limiting.

### File Uploads (Multer)
- **Community post images** → saved to disk in `backend/uploads/` with timestamped filenames, served statically via `/uploads/*`.
- **Food photos** → kept in memory only (never persisted), passed as base64 directly to OpenAI.

### JWT Authentication
- Login/register return a 30-day JWT (`workoutBuddyToken`).
- Protected routes require `Authorization: Bearer <token>`.
- Admin routes additionally check `role === 'admin'`.
- Frontend persists the token + user in `localStorage`.

---

## Scripts

```bash
# Backend
cd backend
node seed.js      # Seed 3 sample trainers
npm run dev       # Start dev server (nodemon)
npm start         # Start in production mode

# Frontend
cd frontend
npm run dev       # Vite dev server
npm run build     # Production build
npm run preview   # Preview build
npm run lint      # Run Oxlint
```