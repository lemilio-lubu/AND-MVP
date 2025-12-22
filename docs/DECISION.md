# MVP Decisions

## Scope
- This is an MVP for validating local billing usage.
- No automation of payments.
- No real integrations with ad platforms.

## Users
- AND Client: system user.
- Influencer: lead only, no login.

## Security
- Password hashing.
- HttpOnly cookies.
- No OAuth.
- No RBAC.

## Technical
- Monolith.
- Next.js App Router.
- Vertical slice architecture.
