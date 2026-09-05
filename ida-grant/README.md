# IDA World Support Grant portal

This is an independent grant-portal application prototype with public pages, applicant authentication, an applicant dashboard, and protected agent/admin workspaces backed by Supabase.

> **Important:** This project is not affiliated with Grants.gov or the U.S. Government. Do not use it to imply government sponsorship. Publish only verified grant and award information.

## Portal URLs

- Main public/applicant site: your Vercel domain
- Agent portal: `https://agent.idawsg.com`
- Admin portal: `https://admin.idawsg.com`

The application includes host-based routing so the root of `agent.idawsg.com` opens the Agent workspace and the root of `admin.idawsg.com` opens the Admin workspace. Add both domains to the same Vercel project, then point their DNS records to Vercel.

## Supabase

1. Run `supabase-schema.sql` in the Supabase SQL Editor (or apply the equivalent migration).
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel.
3. Create applicant accounts through `/register`.
4. Promote verified staff accounts by updating `public.profiles.role` to `agent` or `admin` using a privileged database session.

## Main workflow

`Find a Grant → View & apply → Sign in/register → Submit application → Applicant dashboard → Agent review → Admin operations → Decision`

## Included routes

- `/`
- `/learn`
- `/grants`
- `/apply`
- `/login`
- `/register`
- `/dashboard`
- `/dashboard/application`
- `/dashboard/documents`
- `/dashboard/messages`
- `/dashboard/notifications`
- `/dashboard/profile`
- `/dashboard/help`
- `/agent`
- `/agent/applications/[id]`
- `/admin`
- `/admin/applications`
- `/admin/applications/[id]`
- `/admin/awards`
- `/admin/grants`

## Notes

The public grant search reads from Supabase rather than a hard-coded list. Add only verified opportunities through the Admin workspace. Public award notices also come from published database records.
