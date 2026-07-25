# GIPO — Backend (FastAPI)

Real auth (JWT), real conversation/message storage (SQLite by default),
file uploads, and one clearly-marked mock orchestration function
(`app/orchestration.py`) that stands in for the real Claude/OpenAI/
Perplexity routing until you're ready to wire that in.

## Run it locally

```bash
cd gipo-backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env             # then edit SECRET_KEY at minimum

uvicorn app.main:app --reload
```

Open **http://localhost:8000/docs** — that's FastAPI's built-in Swagger
UI. You can sign up, log in, click "Authorize" with the token you get
back, and try every endpoint by hand, with no frontend needed at all.
This is the fastest way to test the backend on its own.

## Endpoints

| Method | Path                              | What it does                                  |
|--------|-----------------------------------|------------------------------------------------|
| POST   | `/auth/signup`                    | Create an account, returns a JWT               |
| POST   | `/auth/login`                     | Log in, returns a JWT                          |
| GET    | `/auth/me`                        | Current user (requires `Authorization: Bearer`)|
| GET    | `/conversations`                  | List your conversations                        |
| POST   | `/conversations`                  | Create a new conversation                      |
| PATCH  | `/conversations/{id}`             | Rename a conversation                          |
| DELETE | `/conversations/{id}`             | Delete a conversation                          |
| GET    | `/conversations/{id}/messages`    | List messages in a conversation                |
| POST   | `/conversations/{id}/messages`    | Send a message (multipart: `content`, `files`, `profound_search`) — runs the mock orchestrator and returns both the user message and the assistant reply |

All routes except `/auth/signup` and `/auth/login` require an
`Authorization: Bearer <token>` header.

## Wiring in real orchestration later

Everything funnels through one function: `orchestrate()` in
`app/orchestration.py`. Replace its body with real calls to Claude,
OpenAI, Perplexity, etc. — it just needs to keep returning an
`OrchestrationResult(optimized_prompt, recommended_tool, reply)`. Nothing
in the router or database layer needs to change.

## Deploying to Railway

1. **Push this folder to a GitHub repo** (Railway deploys from a repo,
   or you can use the CLI to deploy straight from your machine — see
   step 3 for the CLI route).

2. **Create the project**
   - Go to [railway.app](https://railway.app) → New Project →
     "Deploy from GitHub repo" → pick this repo.
   - Railway detects Python automatically via `requirements.txt` and
     uses the `Procfile` / `railway.json` here to start it.

   **Or, via CLI**, from inside `gipo-backend/`:
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

3. **Set environment variables** — in the Railway dashboard, open your
   service → Variables, and add:
   - `SECRET_KEY` — generate one with
     `python -c "import secrets; print(secrets.token_hex(32))"`
   - `ACCESS_TOKEN_EXPIRE_MINUTES` — `1440`
   - `ALLOWED_ORIGINS` — your frontend's URL(s), comma-separated
     (include `http://localhost:5173` too while you're testing locally)
   - `DATABASE_URL` — leave unset to use SQLite, **or** add Railway's
     Postgres plugin (New → Database → PostgreSQL) and paste the
     connection string it gives you here instead (see note below)

4. **Deploy** — Railway builds and starts it automatically on push (or
   right after `railway up`). It'll give you a public URL like
   `https://gipo-backend-production.up.railway.app`.

5. **Test the live deployment** the same way as local: visit
   `https://<your-railway-url>/docs` and try the endpoints from there.

### Important: SQLite is not persistent on Railway

By default this uses a SQLite file (`gipo.db`) and saves uploaded files
to a local `uploads/` folder. Railway's filesystem is **ephemeral** —
both get wiped on every redeploy. That's totally fine for testing the
API itself, but before you rely on this for real users:

- Add Railway's **PostgreSQL** plugin and set `DATABASE_URL` to its
  connection string (no code changes needed — SQLAlchemy handles both).
- Swap the local file-upload storage in `app/routers/messages.py` for
  an object store (S3, Cloudflare R2, Railway volumes, etc.).

## Connecting the React frontend

The frontend you already have runs entirely on local mock data
(`AuthContext`, `ChatContext`). To point it at this backend instead:

- Replace the `fetch`/`setTimeout` stubs in `AuthContext.login()` /
  `.signup()` with real calls to `POST /auth/login` and
  `POST /auth/signup`, storing the returned `access_token`.
- Replace `ChatContext`'s local array of conversations with calls to
  `GET /conversations`, `POST /conversations`, etc., and send messages
  via `POST /conversations/{id}/messages` (as `FormData`, since it's
  multipart) instead of `fakeOrchestrate()`.
- Add `ALLOWED_ORIGINS` for wherever the frontend ends up hosted (e.g.
  its own Railway URL) so CORS doesn't block it.

Happy to do that wiring for you next — just say the word.
