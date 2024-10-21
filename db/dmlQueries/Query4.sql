-- This query retrieves students who are either in the 'Technology' club or have the role of 'President', and who graduated after 2023.

SELECT s.firstName, s.lastName
FROM Student s
INNER JOIN Membership m ON s.studentID = m.studentID
INNER JOIN Club c ON m.clubID = c.clubID
WHERE 
(c.clubCategory = 'Technology' 
OR m.roleID IN 
    (SELECT roleID FROM Role WHERE roleTitle = 'President'))
        AND s.graduationDate > '2023-01-01';
