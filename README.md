# Workout Friend 💪

Workout tracking + AI food photo analysis + trainer booking + a little community feed + an admin panel. Basically I wanted one app that covers most of the "fitness app" checklist instead of juggling five different ones.

## Stack

Backend is Node/Express (v5) with Mongoose (v9) talking to a MongoDB Atlas cluster. Frontend is React 19 on Vite 8, React Router 7, styled with Tailwind 3, animated with Framer Motion, charts via Recharts. Axios for HTTP. Auth is just JWT + bcryptjs, nothing fancy. Uploads go through Multer (disk for post images, in-memory for food photos since those never get saved). The food-photo analysis calls OpenAI's Responses API. Linting is Oxlint because it's fast.

## Folder layout

```
workout-buddy/
├── backend/
│   ├── config/db.js          <- mongo connection
│   ├── controllers/          <- auth, workouts, trainers, etc
│   ├── middleware/
│   │   ├── authMiddleware.js  (protect + admin guards)
│   │   └── upload.js          (multer config, disk + memory)
│   ├── models/                (6 mongoose schemas)
│   ├── routes/                (7 route files)
│   ├── uploads/                <- post images live here, served statically
│   ├── .env.example
│   ├── seed.js                <- drops in 3 sample trainers
│   └── index.js
└── frontend/
    ├── public/
    └── src/
        ├── components/   WorkoutTracker, BookingSystem, NutritionTracker, CommunityFeed, ProfileModal
        ├── constants/workoutPlans.js   <- the 4 built-in programs
        ├── context/AuthContext.jsx     <- global auth state, persists JWT
        ├── pages/    LandingPage, Auth, Dashboard, AdminPanel
        ├── App.jsx
        └── main.jsx
```

## Setting it up

You'll need a recent Node LTS, a Mongo connection string (Atlas is fine, local works too), and an OpenAI key for the food-photo stuff.

**Backend first:**

```bash
cd backend
npm install
cp .env.example .env
# fill in MONGO_URI, JWT_SECRET, OPENAI_API_KEY, OPENAI_FOOD_VISION_MODEL

node seed.js       # optional — seeds 3 sample trainers
npm run dev        # nodemon, auto-reload
# npm start for prod
```

Runs on `localhost:5000`.

**Then the frontend:**

```bash
cd frontend
npm install
npm run dev
```

Vite's default port, `localhost:5173`. It calls the backend at `localhost:5000` so keep that running too, or auth stuff won't work.

Other frontend commands you might want: `npm run build` (prod bundle → `dist`), `npm run preview` (preview that build), `npm run lint` (Oxlint).

### Env vars

- `PORT` – server port, defaults to 5000
- `MONGO_URI` – your mongo connection string
- `JWT_SECRET` – whatever secret you want signing tokens
- `OPENAI_API_KEY` – needed for the food vision endpoint
- `OPENAI_FOOD_VISION_MODEL` – which OpenAI model to hit for image analysis

---

## API

Everything's under `http://localhost:5000`. ✔ means it needs a Bearer token.

**Auth** — `/api/auth`
- `POST /register` — sign up, get back a JWT + user
- `POST /login` — same deal but for existing users
- `GET /me` ✔ — current user's profile

**Workouts** — `/api/workouts`
- `POST /` ✔ — log one (exercise, sets, reps, weight)
- `GET /` ✔ — list yours, newest first
- `DELETE /:id` ✔ — delete, owner only

**Trainers & bookings** — `/api/trainers`
- `GET /trainers` — list all trainers (public)
- `GET /slots?trainerId=X&date=YYYY-MM-DD` ✔ — open slots for a trainer/day
- `POST /book` ✔ — book a session
- `GET /my-bookings` ✔ — your bookings
- `DELETE /bookings/:id` ✔ — cancel, owner only

**Nutrition** — `/api/nutrition`
- `POST /` ✔ — log one meal manually
- `GET /` ✔ — today's meals
- `POST /analyze-image` ✔ — upload a food pic, get AI macro estimates back
- `POST /batch` ✔ — save 1-8 meals at once (this is what the AI-result confirm step uses)

**Community** — `/api/community`
- `GET /posts` — everything, newest first (public)
- `POST /posts` ✔ — new post, image optional
- `PUT /posts/:id/like` ✔ — toggle like
- `DELETE /posts/:id` ✔ — owner only

**Admin** — `/api/admin` (all need admin role on top of a token)
- `GET /stats` — counts: users, trainers, bookings
- `GET /users` — every user
- `GET /trainers` — every trainer

**Users** — `/api/users`
- `PUT /profile` ✔ — update name/goal/weight/height/phone/gender/injuries/emergencyContact

**Misc**
- `GET /` — just returns "Workout Buddy API is running..."
- `GET /uploads/*` — serves whatever's in `backend/uploads/`

---

## Data models

**User** — name, email (unique), password (hashed), role (`user`/`trainer`/`admin`, defaults to `user`), plus optional weight, height, goal, phone, gender (`Male`/`Female`/`Other`), injuries, emergencyContact.

**Workout** — belongs to a user; exercise, sets, reps, weight all required; date defaults to now.

**Trainer** — name, specialty required; bio and experience(years) optional; profileImage has a placeholder default; availability is an array of `{ day, slots[] }` where day is Mon–Sun and slots are strings like `"09:00"`.

**Booking** — user + trainer refs, date as an ISO string (`YYYY-MM-DD`), slot as a string (`"10:00"`).

**Meal** — belongs to a user; foodName + calories required; protein/carbs/fats default to 0; date defaults to now.

**Post** — belongs to a user; content required; image optional (path like `/uploads/x.jpg`); likes is an array of user refs; comments is an array of `{ user, text, createdAt }` subdocs.

---

## What's actually on the frontend

**Pages:**
- `/` — landing page, the usual hero/features/trainers-preview/community-preview/CTA sections, animated with Framer Motion
- `/auth` — one form that switches between login and register
- `/dashboard` — the main app once you're logged in — header, avatar, admin button if you're an admin, logout, tabs for the four features below, plus a profile modal
- `/admin` — stat cards, member list, trainer list — admin role required

**The four dashboard tabs:**

1. *WorkoutTracker* — log stuff, see your history (with delete), quick-start from one of 4 built-in plans, and a strength progress chart.
2. *BookingSystem* — pick a trainer, pick a date, see open slots, book, cancel.
3. *NutritionTracker* — the fun one. "Photo Estimate (Beta)" lets you upload a food pic (5MB max, jpeg/png/webp) and OpenAI guesses the macros, which you can then tweak before saving. Also does plain manual logging and shows daily totals.
4. *CommunityFeed* — post (with or without an image), scroll the feed, like/unlike, delete your own posts.

Plus *ProfileModal* for editing your profile fields.

---

## The interesting bits

**Food photo → macros:** `POST /api/nutrition/analyze-image` base64-encodes the photo (plus an optional portion hint) and sends it to OpenAI's Responses API with a strict JSON schema — 1 to 8 food items, each with foodName/estimatedPortion/calories/protein/carbs/fats/confidence (low/med/high), plus a notes field. There's a safety prompt baked in that tells it to ignore any instructions hidden in the image itself, not to identify people, skip medical claims, and lean conservative on estimates. Missing env vars → 503, AI/validation trouble → 502, rate limited → 429.

**Uploads:** post images get written to disk under `backend/uploads/` with a timestamp in the filename and served statically. Food photos never touch disk — they stay in memory just long enough to get base64'd and shipped to OpenAI.

**Auth:** login/register hand back a 30-day JWT (`workoutBuddyToken`). Protected routes want `Authorization: Bearer <token>`. Admin routes also check `role === 'admin'`. Frontend just shoves the token + user into localStorage.

---

## Scripts, all in one place

```bash
# backend
node seed.js      # 3 sample trainers
npm run dev       # nodemon
npm start         # prod

# frontend
npm run dev
npm run build
npm run preview
npm run lint
```
