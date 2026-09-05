alter table public.profiles add column if not exists country text;
alter table public.profiles add column if not exists country_code text;
alter table public.profiles add column if not exists phone text;

alter table public.profiles drop constraint if exists profiles_country_allowed;
alter table public.profiles add constraint profiles_country_allowed check (country is null or country in ('United States','Australia','Canada','Albania','Andorra','Austria','Belarus','Belgium','Bosnia and Herzegovina','Bulgaria','Croatia','Czechia','Denmark','Estonia','Finland','France','Germany','Greece','Hungary','Iceland','Ireland','Italy','Latvia','Liechtenstein','Lithuania','Luxembourg','Malta','Moldova','Monaco','Montenegro','Netherlands','North Macedonia','Norway','Poland','Portugal','Romania','Russia','San Marino','Serbia','Slovakia','Slovenia','Spain','Sweden','Switzerland','Ukraine','United Kingdom','Vatican City'));

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id,email,full_name,country,country_code,phone)
  values (new.id,new.email,coalesce(new.raw_user_meta_data->>'full_name',''),new.raw_user_meta_data->>'country',new.raw_user_meta_data->>'country_code',new.raw_user_meta_data->>'phone')
  on conflict (id) do update set email=excluded.email, full_name=coalesce(excluded.full_name,public.profiles.full_name), country=coalesce(excluded.country,public.profiles.country), country_code=coalesce(excluded.country_code,public.profiles.country_code), phone=coalesce(excluded.phone,public.profiles.phone);
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.awards alter column currency set default 'USD';
alter table public.awards drop constraint if exists awards_currency_allowed;
alter table public.awards add constraint awards_currency_allowed check (currency is null or currency in ('USD','EUR'));

update public.awards set currency='USD', display_amount='$150,000.00' where recipient_display_name='ANTHONY LUCK' and currency is null;
update public.awards set currency='EUR', display_amount='€200,000.00' where recipient_display_name in ('CARNELIA STEPHENS','CHARMAINE FRANCIS R.') and currency='GBP';
update public.awards set currency='EUR', display_amount='€80,000.00' where recipient_display_name='JOSEPHINE TOWNS' and currency='GBP';
