-- This query finds all clubs along with their member count

SELECT c.name, (SELECT COUNT(*) FROM Membership m 
    WHERE m.clubID = c.clubID) AS memberCount 
FROM Club c;