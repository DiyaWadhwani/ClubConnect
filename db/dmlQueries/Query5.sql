-- This query categorizes students based on their graduation year.

SELECT s.firstName, s.lastName, 
    CASE 
        WHEN s.graduationDate < '2023-01-01' THEN 'Graduated'
        WHEN s.graduationDate BETWEEN '2023-01-01' AND '2024-12-31' THEN 'Current Student'
        ELSE 'Future Student'
    END AS studentStatus
FROM 
    Student s;
