-- Approved beneficiary records supplied by the site administrator.
-- Run after supabase-schema.sql. These rows are published by design.
insert into public.awards (recipient_display_name,support_type,amount,currency,published,display_amount,delivery_status) values
('DANNY FEIGHT','Approved beneficiary',200000,'USD',true,'$200,000.00','DELIVERED'),
('KENNETH BRUBAKER','Approved beneficiary',100000,'USD',true,'$100,000.00','NOT DELIVERED'),
('MOHAMMED AMAR','Approved beneficiary',150000,'USD',true,'$150,000.00','NOT DELIVERED'),
('CARNELIA STEPHENS','Approved beneficiary',200000,'GBP',true,'£200,000.00','DELIVERED'),
('HELEN GOSSAGE','Approved beneficiary',100000,'USD',true,'$100,000.00','NOT DELIVERED'),
('RUSSEL SCOTT HANN','Approved beneficiary',150000,'USD',true,'$150,000.00','DELIVERED'),
('JOYCE MARIE BELL','Approved beneficiary',150000,'USD',true,'$150,000.00','NOT DELIVERED'),
('FRAN MURRAY','Approved beneficiary',90000,'USD',true,'$90,000.00','NOT DELIVERED'),
('ALICE DAUGHERTY','Approved beneficiary',700000,'USD',true,'$700,000.00','NOT DELIVERED'),
('SHERRY STRUNK','Approved beneficiary',500000,'USD',true,'$500,000.00','DELIVERED'),
('CHARMAINE FRANCIS R.','Approved beneficiary',200000,'GBP',true,'£200,000.00','NOT DELIVERED'),
('DOYLE AKINS','Approved beneficiary',150000,'USD',true,'$150,000.00','DELIVERED'),
('LIBBY MAGEE AARON','Approved beneficiary',70000,'USD',true,'$70,000.00','NOT DELIVERED'),
('ANTHONY LUCK','Approved beneficiary',150000,null,true,'150,000.00','NOT DELIVERED'),
('LUKE TANDARICH','Approved beneficiary',100000,'USD',true,'$100,000.00','DELIVERED'),
('REID MARY','Approved beneficiary',90000,'USD',true,'$90,000.00','DELIVERED'),
('MARCO ANTONIO R.','Approved beneficiary',1000000,'USD',true,'$1,000,000.00','DELIVERED'),
('TAMMY CARVER','Approved beneficiary',900000,'USD',true,'$900,000.00','NOT DELIVERED'),
('JOSEPHINE TOWNS','Approved beneficiary',80000,'GBP',true,'£80,000.00','NOT DELIVERED');
