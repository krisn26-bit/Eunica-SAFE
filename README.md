# Eunica Safe

A mobile-first postpartum safety education and care-navigation app. It explains
postpartum warning signs in plain language, helps someone decide whether to seek
care, and keeps the numbers they need where they can find them in a hard moment.

Everything a user saves stays in their own browser. There is no account, no
server storing health details, and no analytics.

> **This build is a pilot.** No clinical content in it has been reviewed by a
> qualified maternal-health clinician, and every page that carries clinical
> content says so.

## The rules this app is built around

These are product constraints, not style preferences. Changes that break them
should not be merged.

1. **Never say "you are fine."** Guidance never reassures, and the lowest action
   level says explicitly that not matching an emergency rule is not the same as
   being fine. Enforced by `tests/unit/safety-rules.test.ts`.
2. **Never rule out an emergency.** Escalation language is attached to every
   result at every level, and every level includes a way to reach 911.
3. **Emergency help is always one tap away.** A 911 action sits above the header
   on every page. Enforced by `tests/e2e/emergency-access.spec.ts`.
4. **No sensitive health data in a URL.** The questionnaire keeps answers in
   memory; the symptom hand-off from the library uses `sessionStorage`.
5. **No fabricated clinical or facility data.** Where a verified source does not
   exist, the app says so rather than inventing a listing.
6. **No diagnosis, no AI chat, no clinical interpretation.** Guidance is a
   versioned rule table that a clinician can read and audit.

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

### Scripts

| Script              | What it does                                      |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Development server                                |
| `npm run build`     | Production build                                  |
| `npm start`         | Serve the production build                        |
| `npm run lint`      | ESLint, including the React Compiler rules        |
| `npm run typecheck` | `tsc --noEmit`                                    |
| `npm test`          | Vitest unit and component tests                   |
| `npm run test:e2e`  | Playwright end-to-end tests (iPhone 13 + Desktop) |
| `npm run verify`    | Lint, typecheck, and unit tests together          |
| `npm run format`    | Prettier                                          |

Playwright needs browsers before its first run:

```bash
npx playwright install --with-deps chromium webkit
```

## How the app is organised

```
app/                      Routes (App Router, all statically rendered)
components/
  layout/                 Emergency bar, header, footer, page shell
  ui/                     Buttons, callouts, fields, disclosures, sections
  safety/                 911 action, crisis lines, saved contacts, disclaimers
  seek-care/              Questionnaire flow and guidance result
  warning-signs/          Searchable index, "I am experiencing this" hand-off
  safety-plan/ recovery/ care-locator/ resources/ privacy/ onboarding/
content/
  warning-signs.ts        19 warning signs, each with provenance metadata
  resources.ts            12 national US services, each with a review date
  meta.ts                 Content governance: version, status, owner, cadence
lib/
  safety-rules/           The deterministic guidance engine
  validation/schemas.ts   Zod schemas for everything persisted
  storage/                Namespaced local storage and the React binding
  recovery/prompts.ts     Threshold nudges for recovery entries
  location/               Map hand-off and the facility data contract
  privacy/notices.ts      One source of truth for privacy and scope copy
styles/tokens.css         Design tokens
tests/unit/ tests/e2e/    Vitest and Playwright suites
```

### The guidance engine

`lib/safety-rules` maps answers to one of four action levels, in ascending
severity: `monitor-and-contact`, `contact-team-promptly`, `emergency-now`,
`call-911`.

It is a rule table, not a model. For a given set of answers the result is always
identical, and each result records the rule set version and the ids of the rules
that matched so a reviewer can reproduce it.

Three things determine the level, and the highest one wins:

- **Universal red flags** — heavy bleeding, chest pain, trouble breathing, a
  seizure, fainting, stroke symptoms, thoughts of harm, and immediate danger.
  Any of these goes straight to `call-911` regardless of the symptom chosen, and
  the remaining questions are skipped.
- **Per-symptom rules** — follow-up answers that match a published warning sign.
- **A per-symptom baseline** — a floor the result can never drop below.

Bump `SAFETY_RULES_VERSION` and add a `RULES_REVIEW.changeLog` entry for any
change to the rules or their wording.

### Content governance

Every piece of clinical content carries a `ContentProvenance` record: version,
review status, owner, reviewer, and review cadence. While the status is `draft`,
the UI labels it as draft wherever it appears. Before a release that claims
clinical review:

1. A qualified maternal-health clinician reviews `content/warning-signs.ts` and
   `lib/safety-rules/rules.ts`.
2. Set `status` to `clinician-reviewed` and fill in `reviewer` and `reviewedOn`.
3. Re-verify every phone number and website in `content/resources.ts` and update
   each `lastReviewed`.

### Privacy and data handling

| What                  | Where it lives                            |
| --------------------- | ----------------------------------------- |
| Preferences           | `eunica-safe.v1.preferences`              |
| Safety plan           | `eunica-safe.v1.safety-plan`              |
| Recovery notes        | `eunica-safe.v1.recovery`                 |
| Saved location        | `eunica-safe.v1.location`                 |
| Questionnaire answers | Component state only, discarded on unload |

All of it is `localStorage` on the user's device, validated with Zod on read so
corrupted or tampered data falls back to empty rather than crashing. Users can
export everything as JSON or delete all of it from `/privacy`.

The app does not use a database, an authentication provider, a map provider, an
analytics platform, or any other third-party service. Adding one requires
documenting the need and the privacy implications first — for sensitive
postpartum health data, not collecting it is the strongest protection available.

`/privacy` also states the limits of device storage plainly: anyone who can
unlock the device can read what is saved, which matters for users who are not
safe at home.

### Why there are no hospital listings

`lib/location/facility-source.ts` defines the contract a facility data source
must satisfy, and `FACILITY_DATA_POLICY` records the rules any listing must meet
— a named source with a documented update cadence, re-fetching anything older
than 90 days, and service claims that come from the source rather than from a
facility's name. No such source is connected in this build, so searches are
handed to the user's own map application instead of showing listings that cannot
be verified. A wrong address or a closed maternity unit costs time in an
emergency.

### Design

The visual language is editorial and printed rather than the default SaaS look:
a warm parchment palette, Fraunces for headings and Inter for text, hairline
rules and ruled index lists instead of card grids, and a faint paper grain.

True red is reserved for 911 and emergency-care actions so it keeps its meaning.
Urgency is never carried by color alone — every urgency treatment pairs color
with a text label, an icon, and a border weight, so it survives color blindness,
grayscale printing, and high-contrast modes.

### Accessibility

Disclosures use native `details`/`summary` so they work without JavaScript.
Interactive targets are at least 44px tall. Results announce themselves with
`role="alert"`, progress uses `role="progressbar"`, and a skip link is the first
element in the DOM. Focus is always visible, and animation respects
`prefers-reduced-motion`.

## Deployment

The app is a static Next.js build with no server-side data dependencies, so it
deploys to Vercel without configuration.

```bash
npm run build
```

**There are no environment variables and no secrets in this build.** If a future
change needs a key, keep it in Vercel environment variables or an approved secret
manager — never in the repository, and never in a `NEXT_PUBLIC_` variable unless
it is genuinely public.

### Release checklist

1. `npm run verify` and `npm run test:e2e` pass.
2. `npm run build` succeeds and every route still renders statically.
3. Emergency access still works on the deploy preview, on a real phone, with
   JavaScript throttled.
4. Content provenance labels still match the actual review status.
5. If the rules changed, `SAFETY_RULES_VERSION` was bumped and the change log
   updated.

### Rollback

Promote the previous production deployment in the Vercel dashboard, or
`vercel rollback <deployment-url>`. Because all state is on users' devices and
schemas are versioned, rolling back the app does not lose or corrupt user data.
Never ship a storage-key change without a migration path.

## Out of scope

Deliberately not built: AI chat, diagnosis or automated clinical interpretation,
baby tracking, wearable integrations, EMR integrations, telehealth, and provider
messaging. The app is narrow on purpose, so what it does say can be checked.
