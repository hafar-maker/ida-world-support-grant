# IDA World Support Grant — visual MVP

First batch recreated from the supplied reference image using Next.js App Router + Tailwind CSS + lucide-react.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

Routes:
- `/` public homepage
- `/apply` first application form flow
- `/dashboard` applicant dashboard mock

## Next implementation steps
1. Add Supabase auth.
2. Persist applications in Postgres.
3. Add document upload/storage.
4. Add applicant/admin roles and RLS.
5. Replace mock dashboard data with server queries.
