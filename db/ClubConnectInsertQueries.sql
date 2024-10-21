INSERT INTO University (name, emailDomain, address, zipCode, city, state, website)
VALUES 
('Northeastern University', 'northeastern.edu', '360 Huntington Ave', '02115', 'Boston', 'MA', 'http://www.northeastern.edu'),
('University of California, Berkeley', 'berkeley.edu', '200 California Hall', '94720', 'Berkeley', 'CA', 'http://www.berkeley.edu'),
('Stanford University', 'stanford.edu', '450 Serra Mall', '94305', 'Stanford', 'CA', 'http://www.stanford.edu'),
('MIT', 'mit.edu', '77 Massachusetts Ave', '02139', 'Cambridge', 'MA', 'http://www.mit.edu'),
('University of Washington', 'washington.edu', '1410 NE Campus Pkwy', '98195', 'Seattle', 'WA', 'http://www.washington.edu');

INSERT INTO Club (name, description, startDate, email, logo, universityID, clubCategory)
VALUES 
('Tech Club', 'A club for tech enthusiasts to learn and share knowledge about new technologies.', '2021-09-15', 'techclub@northeastern.edu', NULL, 1, 'Technology'),
('Dance Club', 'A platform for students to practice and perform various dance styles.', '2020-10-01', 'danceclub@berkeley.edu', NULL, 2, 'Arts'),
('Entrepreneurship Club', 'Helping students explore and start their entrepreneurial ventures.', '2019-01-20', 'entrepreneurship@northeastern.edu', NULL, 1, 'Business'),
('Robotics Club', 'A club dedicated to building and programming robots.', '2018-05-10', 'robotics@stanford.edu', NULL, 3, 'Engineering'),
('Photography Club', 'For students interested in capturing and editing photographs.', '2021-03-15', 'photoclub@mit.edu', NULL, 4, 'Arts'),
('Coding Club', 'Bringing together coders to work on projects and improve their skills.', '2020-08-01', 'codingclub@washington.edu', NULL, 5, 'Technology');

INSERT INTO Student (firstName, lastName, emailAddress, program, graduationDate, enrollmentYear, dateOfBirth, profilePicture, universityID)
VALUES 
('Alice', 'Johnson', 'alice.j@northeastern.edu', 'Computer Science', '2024-05-01', 2021, '2002-03-10', NULL, 1),
('Bob', 'Smith', 'bob.s@berkeley.edu', 'Mechanical Engineering', '2023-05-01', 2019, '2001-11-21', NULL, 2),
('Catherine', 'Lee', 'catherine.l@northeastern.edu', 'Business Administration', '2025-05-01', 2022, '2003-05-14', NULL, 1),
('Daniel', 'White', 'daniel.w@stanford.edu', 'Electrical Engineering', '2025-06-01', 2021, '2002-04-05', NULL, 3),
('Emily', 'Brown', 'emily.b@mit.edu', 'Media Arts & Sciences', '2024-06-01', 2020, '2001-08-16', NULL, 4),
('Fiona', 'Green', 'fiona.g@washington.edu', 'Computer Science', '2023-12-01', 2019, '2001-10-30', NULL, 5),
('Grace', 'Kim', 'grace.k@northeastern.edu', 'Data Science', '2025-05-01', 2021, '2003-02-20', NULL, 1),
('Haris', 'Joy', 'joy.h@northeastern.edu', 'Psychology', '2022-12-01', 2019, '2001-10-23', NULL,  3);

INSERT INTO Role (roleTitle, roleDescription)
VALUES 
('President', 'Leads the club and manages its overall direction.'),
('Vice President', 'Assists the President and takes charge in their absence.'),
('Treasurer', 'Manages the finances and budget of the club.'),
('Secretary', 'Handles administrative tasks and meeting notes.'),
('Event Coordinator', 'Plans and organizes club events.'),
('Public Relations', "Manages the club's social media and outreach.");

INSERT INTO Membership (clubID, roleID, studentID, description, joinDate, isActive, memberType)
VALUES 
(1, 1, 1, 'President of the Tech Club', '2021-09-20', 'yes', 'Leader'),
(2, 3, 2, 'Vice President of the Dance Club', '2020-11-05', 'yes', 'Leader'),
(3, 2, 3, 'Treasurer of the Entrepreneurship Club', '2022-01-15', 'yes', 'Leader'),
(1, 6, 4, 'Event Coordinator of the Tech Club', '2022-09-01', 'yes', 'Core'),
(4, 5, 5, 'Public Relations Officer of the Robotics Club', '2021-11-01', 'yes', 'Core'),
(5, 4, 6, 'President of the Photography Club', '2021-03-20', 'yes', 'Core'),
(6, 2, 7, 'Event Coordinator of the Coding Club', '2022-08-15', 'yes', 'Core'),
(3, 3, 8, 'Member', '2022-05-10', 'yes', 'Regular');

INSERT INTO Status (status)
VALUES 
('Scheduled'),
('Completed'),
('Canceled'),
('Pending');

INSERT INTO Event (date, time, title, location, description, contact, statusID, clubID, eventType)
VALUES 
('2023-10-20', '14:00', 'Tech Talks: AI in 2023', 'Room 101, Tech Building', 'A discussion on the latest developments in AI.', 'alice.j@northeastern.edu', 1, 1, 'Seminar'),
('2023-11-15', '18:00', 'Dance Performance: Winter Showcase', 'Main Auditorium', 'Showcasing student performances in various dance styles.', 'bob.s@berkeley.edu', 1, 2, 'Performance'),
('2024-01-10', '10:00', 'Startup Pitch Competition', 'Room 205, Business Building', 'Students present their startup ideas to a panel.', 'catherine.l@northeastern.edu', 2, 3, 'Competition'),
('2023-12-10', '15:00', 'Robot Building Workshop', 'Room 305, Engineering Hall', 'Workshop on building and programming autonomous robots.', 'daniel.w@stanford.edu', 1, 4, 'Workshop'),
('2024-01-15', '17:00', 'Photo Walk: Winter Edition', 'Boston Commons', 'A photo walk around the city to capture winter scenes.', 'emily.b@mit.edu', 1, 5, 'Outdoor Event'),
('2024-02-20', '14:00', 'Hackathon 2024', 'Room 402, Tech Center', '48-hour coding marathon with prizes for top projects.', 'fiona.g@washington.edu', 2, 6, 'Competition'),
('2024-03-10', '18:30', 'AI and Ethics Panel Discussion', 'Main Auditorium', 'Panel discussion on ethical considerations in AI development.', 'grace.k@northeastern.edu', 3, 1, 'Seminar'),
('2023-11-01', '13:00', 'Fundraising Strategy Meeting', 'Club Room', "Planning strategies for the club's next fundraiser.", 'alice.j@northeastern.edu', 4, 3, 'Meeting');


INSERT INTO Interview (date, time, platform, clubID, studentID, roleID, statusID)
VALUES 
('2023-10-25', '16:00', 'Zoom', 1, 2, 2, 1),
('2023-12-01', '09:00', 'Google Meet', 3, 1, 3, 1),
('2023-10-30', '11:00', 'Microsoft Teams', 2, 3, 1, 2),
('2023-10-27', '10:00', 'Zoom', 4, 4, 2, 4),
('2023-12-05', '09:30', 'Google Meet', 6, 7, 2, 1),
('2024-01-15', '15:30', 'Microsoft Teams', 5, 6, 3, 1),
('2024-02-10', '14:00', 'Zoom', 1, 8, 3, 2),
('2024-01-30', '16:00', 'Google Meet', 3, 5, 1, 4);
