-- This query shows the number of active members in each club and includes clubs with any active members

SELECT c.name, COUNT(m.studentID) AS activeMemberCount
FROM Club c
LEFT JOIN Membership m ON c.clubID = m.clubID AND m.isActive = 'yes'
GROUP BY c.name
HAVING COUNT(m.studentID) > 0; 