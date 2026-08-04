# GIPO — Frontend (multi-page)

React + Vite + React Router. Four real pages — Landing, Login, Signup, Chat
— each its own file, with smooth page transitions and a design system
lifted straight from the logo.

## Run it

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Visit `/`, `/login`, `/signup`, `/chat`
(chat redirects to `/login` until you sign in — it's a protected route).

## Your logo

Drop your file in at **`src/assets/LogoGIPO.jpg`** — every screen imports
it through the single `Logo` component (`src/components/common/Logo.jsx`),
so it never needs touching again. A placeholder image (the one you shared)
sits there now so the project runs out of the box; swap the file and every
page updates.

## Colour system — what changed and why

- **Chrome grey** (`--gipo-chrome-*`) is sampled to match the logo's own
  "GIPO" letterforms — same highlight-to-shadow contrast. It's used **only**
  for the wordmark (`.brand-word` class) and metal-look chrome like the
  theme-toggle thumb. Use `.brand-word` any time you write "GIPO" in the UI
  and it'll always match the mark.
- **Gold / orange** (`--gipo-gold-*`, `--gipo-amber-600`) — lifted from the
  bubble's gold dot — is now the **primary interactive colour**: every
  main button (`.btn-primary`), the active sidebar item, focus rings,
  the composer's focus glow, and the Profound Search toggle when it's on.
- **Ribbon** (emerald → teal → indigo → magenta, from the funnel) stays
  reserved for the *transformation* moments only — the optimized-prompt
  highlight in each reply and the orchestration panel's pipeline dots —
  so it keeps meaning "garbage → prompt" instead of becoming generic decoration.
- **Dot colours** (gold / azure / amethyst, from the speech bubble) are
  reserved for the "GIPO is orchestrating" thinking indicator only.

## Folder structure

```
gipo-app/
├── index.html                       Cinzel / Manrope / JetBrains Mono
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                     BrowserRouter + App
    ├── App.jsx                      Routes + animated page transitions
    ├── assets/
    │   └── LogoGIPO.jpg              ← replace with your file
    ├── styles/
    │   ├── tokens.css                Colour / type / spacing tokens, light+dark
    │   └── global.css                Reset, .brand-word, .btn-primary, app shell
    ├── context/
    │   ├── ThemeContext.jsx          Light/dark, persisted
    │   ├── AuthContext.jsx           login / signup / logout — plug in your API
    │   └── ChatContext.jsx           Conversations, rename, delete, Profound Search
    ├── pages/
    │   ├── LandingPage.jsx / .css    Hero + transformation demo
    │   ├── LoginPage.jsx             Own route, own file
    │   ├── SignupPage.jsx            Own route, own file
    │   └── ChatPage.jsx              Composes the chat screen below
    └── components/
        ├── common/
        │   ├── Logo.jsx              The one place LogoGIPO.jpg is imported
        │   ├── AuthLayout.jsx / .css Shared shell for Login + Signup
        │   ├── AuthForm.css          Shared field styling for both auth pages
        │   ├── ProtectedRoute.jsx    Redirects to /login if signed out
        │   ├── PageTransition.jsx    Framer Motion fade/slide wrapper per route
        │   ├── ThemeToggle.jsx / .css
        │   └── IridescentLoader.jsx  Gold/azure/amethyst thinking dots
        ├── layout/
        │   ├── Sidebar.jsx / .css    New chat, search, rename (pencil), delete (trash)
        │   └── TopBar.jsx / .css     Title + orchestration toggle
        ├── chat/
        │   ├── ChatWindow.jsx / .css Animated message list + empty state
        │   ├── MessageBubble.jsx / .css
        │   └── Composer.jsx / .css   Attach file + Profound Search toggle + send
        └── orchestration/
            └── OrchestrationPanel.jsx / .css
```

## Conversation management (sidebar)

- **New conversation** — the `+` button at the top.
- **Rename** — hover a conversation, click the pencil icon, type, press
  Enter (or click away) to save, Escape to cancel.
- **Delete** — hover, click the trash icon. No confirmation dialog is
  wired up; add one in `Sidebar.jsx` if you want a safety net before
  deleting for real.

## Profound Search

The pill button in the composer (magnifying glass) is a toggle your
orchestration backend can read to switch into a deep/cited web-research
mode — right now it just changes which mock tool gets "recommended" in
`ChatContext.fakeOrchestrate()`. Wire it to a real flag in your API request.

## Wiring up the real thing

Everything runs on local mock data so the whole flow — landing → sign up →
chat — works immediately:

- `AuthContext.login()` / `.signup()` fake a network call with `setTimeout`.
  Replace with real requests to your auth endpoint, or a provider like
  Auth0 / Clerk / Supabase.
- `ChatContext.fakeOrchestrate()` stands in for your orchestration API.
  Replace it with a call that returns `{ optimizedPrompt, recommendedTool }`,
  and swap the `setTimeout` in `sendMessage` for a real streaming response.
- `Composer.jsx` holds attached files as in-memory `File` objects — wire
  `handleFilePick` / `handleSubmit` to your upload endpoint.

## Notes

- Every page transition, sidebar item, message bubble, and button uses
  Framer Motion with `cubic-bezier(0.16, 1, 0.3, 1)` easing for a
  consistent, unhurried feel — nothing snaps.
- Keyboard focus is visible everywhere; `prefers-reduced-motion` disables
  all animation durations.
- Below 900px the sidebar and orchestration panel hide by default — wire
  a hamburger toggle in `TopBar.jsx` if you want them reachable on mobile.
