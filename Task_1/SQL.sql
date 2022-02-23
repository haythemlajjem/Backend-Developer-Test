-- To execute these SQL queries I've used this website https://sqliteonline.com/


-- 1**

update MY_TABLE
SET website = CASE length(SUBSTRING(SUBSTRING(website,CHARINDEX('//', website) +2,length(website)),1,CHARINDEX('/', SUBSTRING(website,CHARINDEX('//', website) +2,length(website)))-1)) 
                      WHEN 0 THEN SUBSTRING(website,CHARINDEX('//', website) +2,length(website))
                      ELSE SUBSTRING(SUBSTRING(website,CHARINDEX('//', website) +2,length(website)),1,CHARINDEX('/', SUBSTRING(website,CHARINDEX('//', website) +2,length(website)))-1)
end;


-- 2**

select sum (spots)
from (SELECT website,count(*) as spots
from MY_TABLE
GROUP By website
HAVING spots != 1 and website is not NULL );

-- 3**

SELECT *,count(*) as domainCount
from MY_TABLE
GROUP By website
HAVING domainCount != 1 and website is not NULL;

