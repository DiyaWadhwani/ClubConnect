-- This query fetches the names of students, their club names, and the roles they hold in their respective clubs.

SELECT s.firstName, s.lastName, c.name AS clubName, r.roleTitle
FROM Student s
INNER JOIN Membership m ON s.studentID = m.studentID
INNER JOIN Club c ON m.clubID = c.clubID
INNER JOIN Role r ON m.roleID = r.roleID;
