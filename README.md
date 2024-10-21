# ClubConnect

### Overview

**ClubConnect** is a web-based system designed to streamline the operations and activities of student-run clubs on a university campus. It allows students to register new clubs, manage their memberships efficiently, and coordinate events. The platform supports the management of roles, responsibilities, permissions, and scheduling interviews for onboarding new members into clubs.

With **ClubConnect**, club leaders can:

- Schedule and manage events.
- Assign and manage roles within a club (Leader, Core, or Regular).
- Track member participation in events.
- Schedule interviews for onboarding new members.

### Features

- **Club Registration**: Students can register new clubs and manage them.
- **Role Management**: Assign and manage roles within a club (Leader, Core, or Regular).
- **Event Management**: Schedule events, record participation, and manage event details.
- **Interview Scheduling**: Schedule interviews for onboarding new members, and track results.

### Database Design

The database design is based on an **ERD schema** and is normalized to BCNF. The schema includes the following entities:

- **University**: Stores university details.
- **Club**: Manages the details of student-run clubs.
- **Student**: Stores student information.
- **Membership**: Tracks the roles and membership of students in clubs.
- **Role**: Defines various roles within the clubs.
- **Event**: Records club events.
- **Status**: Tracks the status of events or interviews (e.g., Scheduled, Completed).
- **Interview**: Handles the scheduling and status of member onboarding interviews.

For more details on the database schema and normalization, refer to the [Database Design Documentation](./ClubConnect_DatabaseDesign.pdf).

### Functional Rules and Constraints

1. Each club must have at least **2 leaders** (e.g., President or Vice President).
2. Students can join multiple clubs but can only hold **leader roles in a maximum of two clubs**.
3. Clubs must have events scheduled with details like date, time, and location.
4. Interviews can be scheduled for onboarding members, with the status tracked.

---

### SQL Queries

Below is a breakdown of the SQL queries provided, their purpose, and examples of their outputs.

#### Query 1: Retrieve all club names and the number of members

This query fetches the names of students, their club names, and the roles they hold in their respective clubs.

**Example Output:**

| firstName | lastName | clubName              | roleTitle         |
| --------- | -------- | --------------------- | ----------------- |
| Alice     | Johnson  | Tech Club             | President         |
| Daniel    | White    | Tech Club             | Public Relations  |
| Bob       | Smith    | Dance Club            | Treasurer         |
| Catherine | Lee      | Entrepreneurship Club | Vice President    |
| Haris     | Joy      | Entrepreneurship Club | Treasurer         |
| Emily     | Brown    | Robotics Club         | Event Coordinator |
| Fiona     | Green    | Photography Club      | Secretary         |
| Grace     | Kim      | Coding Club           | Vice President    |

#### Query 2: Retrieve all clubs along with their member count

This query finds all clubs and the number of members in each club. It returns the club name and the total count of members for that club.

**Example Output:**

| clubName              | memberCount |
| --------------------- | ----------- |
| Tech Club             | 2           |
| Dance Club            | 1           |
| Entrepreneurship Club | 2           |
| Robotics Club         | 1           |
| Photography Club      | 1           |
| Coding Club           | 1           |

#### Query 3: Retrieve the number of active members in each club

This query shows the number of active members in each club and includes only those clubs with at least one active member. It returns the club name along with the count of active members.

**Example Output:**

| clubName              | activeMemberCount |
| --------------------- | ----------------- |
| Coding Club           | 1                 |
| Dance Club            | 1                 |
| Entrepreneurship Club | 2                 |
| Photography Club      | 1                 |
| Robotics Club         | 1                 |
| Tech Club             | 2                 |

#### Query 4: Retrieve students who are either in a technology-related club or hold a leadership role

This query retrieves the names of students who are either in the **Technology** club category or have the role of **President**, and who graduated after January 1, 2023. It returns the first and last names of these students.

**Example Output:**

| firstName | lastName |
| --------- | -------- |
| Alice     | Johnson  |
| Daniel    | White    |
| Grace     | Kim      |

#### Query 5: Categorize students based on graduation year

This query categorizes students as **Alum**, **Current Student**, or **Prospective Student** based on their graduation year. It returns the student's first and last names, along with their status category.

**Example Output:**

| firstName | lastName | studentStatus       |
| --------- | -------- | ------------------- |
| Alice     | Johnson  | Current Student     |
| Bob       | Smith    | Current Student     |
| Catherine | Lee      | Prospective Student |
| Daniel    | White    | Prospective Student |
| Emily     | Brown    | Current Student     |
| Fiona     | Green    | Current Student     |
| Grace     | Kim      | Prospective Student |
| Haris     | Joy      | Alum                |

### Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/DiyaWadhwani/ClubConnect.git
   cd ClubConnect
   ```

2. **Set up the database**:

   - Use the provided SQL schema to set up the **SQLite3** database.

3. **Execute the queries**:
   - Run the queries located in the `dmlQueries` folder using your preferred **SQLite** client or through the command line.

---

### Documentation

- **[Database Design Documentation](./docs/ClubConnect_DatabaseDesign.pdf)**
- **[Requirements Specification](./docs/ClubConnect_Requirements.pdf)**
- **[Class UML Diagram](./diagrams/ClubConnect_UML.png)**
- **[ERD Diagram](./diagrams/ClubConnect_ERD.png)**
