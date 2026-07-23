# Crooked Creek Ranch — NDA-Gated Landing Page

Working mockup of the full flow: public teaser → Request Access → NDA
signing (DocuSign) → gated content reveal, backed by Supabase for
access control.

## ✅ Tested and confirmed working (mock mode)

```
1. POST /api/docusign/create-envelope   → creates lead + mock envelope
2. GET  /api/access/check?email=X       → hasAccess: false (not signed yet)
3. POST /api/docusign/webhook           → simulates DocuSign completing
4. GET  /api/access/check?email=X       → hasAccess: true  (now signed)
5. GET  /api/access/check?email=stranger → hasAccess: false (never signed)
```

Run `npm install && npm run dev`, visit `http://localhost:3000`, click
"Request Access", fill the form, sign on the mock signing page, and
you'll land on `/access/verified` with the gate correctly checked.

## What's real vs. mocked right now

| Piece | Status |
|---|---|
| Landing page design/copy | Real — this is the actual page |
| "Request Access" form | Real — actually calls the API |
| DocuSign envelope creation | **Mocked** — see `lib/docusign.js`. Real mode needs Kim's Integration Key + Template ID + JWT auth (stubbed, throws until implemented) |
| Signing ceremony | **Mocked** — `/access/sign` stands in for DocuSign's real hosted signing page |
| Webhook → access grant | Real logic, mocked trigger — in production DocuSign Connect calls this automatically; here we call it manually after mock-signing |
| Data storage | **In-memory** until you add real Supabase keys — see `lib/dataStore.js`. Resets on server restart. Swap in a real Supabase project any time by filling in `.env.local` |
| Zapier → Follow Up Boss / Mailchimp | Not yet wired — see TODO comment in `pages/api/docusign/webhook.js` |

## To go from mockup to real

### 1. DocuSign (Kim's account)
- Admin → Apps and Keys → create an **Integration Key**, generate an RSA keypair
- Save the NDA as a **Template** with signer fields placed → note the Template ID
- Fill in `DOCUSIGN_INTEGRATION_KEY`, `DOCUSIGN_USER_ID`, `DOCUSIGN_ACCOUNT_ID`, `DOCUSIGN_TEMPLATE_ID`, `DOCUSIGN_PRIVATE_KEY` in `.env.local`
- Implement `getJwtAccessToken()` in `lib/docusign.js` (currently a stub that throws on purpose, so you can't accidentally go live half-configured)
- Set up a **DocuSign Connect** webhook pointing to `/api/docusign/webhook`, and implement real signature verification in `verifyWebhookSignature()`

### 2. Supabase (free tier)
- Create a project at supabase.com
- Run `supabase/schema.sql` in the SQL Editor to create the tables + Row Level Security policies
- Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- The code automatically switches from in-memory to real Supabase the moment a real URL is present — no other changes needed

### 3. Set `MOCK_MODE=false`
Only do this once steps 1–2 are actually complete — while `MOCK_MODE=true`
(or DocuSign keys are missing), the app is safe to demo without touching
anything real.

### 4. Deploy
- Push this folder to a GitHub repo
- Import it in Vercel (free tier) → paste in the real `.env.local` values as Environment Variables in Vercel's dashboard
- Connect your custom domain in Vercel's project settings

### 5. Photos
Replace the Unsplash placeholder URLs in `pages/index.js` with real
Crooked Creek Ranch photography once confirmed (see the Drive folder
mix-up flagged earlier — need the right folder before swapping these in).

### 6. Zapier
Add the fetch call noted in the `webhook.js` TODO to fan out to Follow
Up Boss + Mailchimp once you have a Zapier webhook URL for this.
