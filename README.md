## Wen Lambo Blog

## Import Routes

- `/login`
- `/[username]`
- `/[username]/[id]`
- `/admin`
- `/admin/[id]`

## Permissions/Views

Must use google SSO

1. User - Not logged in:

- View `Mint Feed` without logging in
- View `users` who made the post flagged public(live) posts

2. User - Logged in:

- Create a post
- Edit the post created by user
- View draft contents that isn't public(live) yet

## Testing

Cypress

1. `npm run cypress`
2. Click `E2E Testing`
3. Click `Start E2E Testing in _` (browser of your choice)
4. Click `specy.cy.js` file
