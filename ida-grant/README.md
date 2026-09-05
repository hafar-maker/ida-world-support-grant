# IDA World Support Grant — governmental UI/UX prototype

This version keeps the original reference layout while adopting a simpler public-service information architecture inspired by the current Grants.gov navigation model: Home, Learn, Search/Find Grants, Applicants, Help/Support, account access and prominent search.

## Routes

- `/` — public homepage
- `/grants` — searchable grant opportunities
- `/learn` — learning center
- `/apply` — application form based on the supplied reference form fields
- `/dashboard` — applicant status dashboard

## Important prototype note

This is an independent prototype and is **not affiliated with Grants.gov or the U.S. Government**. The recent award/beneficiary widget uses clearly illustrative records. Replace those records only with verified, approved-for-publication data before launch.

## Run locally

```bash
npm install
npm run dev
```

## Next production steps

1. Add Supabase authentication and Row Level Security.
2. Store applications and status history in Postgres.
3. Add secure document upload and virus/type validation.
4. Add an admin review workspace.
5. Replace illustrative award records with a verified public-awards dataset or remove the widget.
6. Add accessibility testing and legal/privacy content before collecting real applicant information.
