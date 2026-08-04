# GIPO — Backend (FastAPI)

Auth backend for GIPO: signup, email verification, login, and forgot/reset
password — using **Gmail SMTP** to send emails and **PostgreSQL** to store
accounts.

## Setup

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Then edit `.env`:

1. **`GMAIL_USER`** — the Gmail address you'll send from.
2. **`GMAIL_APP_PASSWORD`** — NOT your normal Gmail password. Gmail blocks
   plain-password SMTP logins. You need an **app password**:
   - Turn on 2-Step Verification: https://myaccount.google.com/security
   - Create an app password: https://myaccount.google.com/apppasswords
   - Paste the 16-character code Google gives you.
3. **`SECRET_KEY`** — any long random string, e.g.:
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```
4. **`DATABASE_URL`** — your Postgres connection string. Locally, install
   Postgres (or run one via Docker: `docker run -d -p 5432:5432 -e
   POSTGRES_PASSWORD=postgres postgres`) and point this at it, e.g.
   `postgresql://postgres:postgres@localhost:5432/gipo`. In production,
   Railway's Postgres addon gives you this string directly.
5. Leave `FRONTEND_URL` as-is for local dev.

Run it:

```bash
uvicorn app.main:app --reload --port 8000
```

Interactive API docs: `http://localhost:8000/docs`.

## Endpoints

| Method | Path                    | What it does                                              |
|--------|--------------------------|-------------------------------------------------------------|
| POST   | `/auth/signup`           | Creates the account (password hashed with bcrypt), emails a verification link |
| GET    | `/auth/verify-email?token=...` | Marks the account as verified                        |
| POST   | `/auth/login`            | Rejects unverified accounts; returns a JWT on success       |
| POST   | `/auth/forgot-password`  | Always returns the same message (doesn't leak which emails exist); emails a reset link if the account exists |
| POST   | `/auth/reset-password`   | Takes the token from that email + a new password            |

Both the verification and reset links point at your **frontend**
(`FRONTEND_URL` in `.env`), e.g. `http://localhost:5173/verify-email?token=...`
and `http://localhost:5173/reset-password?token=...`. You'll need to add
those two routes/pages in the React app — they just read `token` from the
URL and POST/GET it to the matching backend endpoint above.

## Security notes

- Passwords are hashed with **bcrypt** (via `passlib`) — never stored or
  logged in plain text.
- Verification and reset links are signed **JWTs** with a short expiry
  (30 min by default) and a `purpose` claim, so a verification token can't
  be reused to reset a password and vice versa.
- `/auth/forgot-password` responds identically whether or not the email is
  registered, so it can't be used to check who has an account.
- `.env` is git-ignored — never commit your real Gmail app password or
  `SECRET_KEY`.

## Wiring up the existing React frontend

In `AuthContext.jsx`, replace the two `setTimeout`-based fakes:

```js
async function signup({ name, email, password }) {
  const res = await fetch('http://localhost:8000/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  if (!res.ok) throw new Error((await res.json()).detail)
  return res.json() // { message: "..." } — tell the user to check their inbox
}

async function login({ email, password }) {
  const res = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error((await res.json()).detail)
  const data = await res.json() // { access_token, user }
  localStorage.setItem('gipo-token', data.access_token)
  localStorage.setItem('gipo-user', JSON.stringify(data.user))
  setUser(data.user)
  return data.user
}
```

Since signup no longer logs the user in immediately (they must verify
first), update `SignupPage.jsx` to show a "check your email" message
instead of navigating straight to `/chat`.