# ClubConnect - Student Club Management System  

**ClubConnect** is a web-based system designed to streamline the operations and activities of student-run clubs on a university campus. It enables students to register new clubs, manage memberships efficiently, and coordinate events. Club leaders can manage roles, permissions, and even schedule interviews for onboarding new members.  

---

## Project Structure  

- `Query1.js` - Counts the number of clubs for each category and sorts the results.  
- `Query2.js` - Finds Computer Science students from 2021 with scheduled or pending interviews.  
- `Query3.js` - Retrieves the number of clubs at Northeastern University.  
- `Query4.js` - Updates the status of an event to "Completed."  
- `Query5.js` - Retrieves all students enrolled in the Computer Science program.  
- `db/initialization/` - Contains JSON files for initializing the MongoDB database.  
- `docs/` - Includes database design documentation, requirements, and diagrams.  
- `app.js` - Entry point for the Node.js application.  

---

## Prerequisites  

1. **Node.js**: Install Node.js from [https://nodejs.org/](https://nodejs.org/).  
2. **MongoDB**: Install MongoDB locally and start the MongoDB server. Refer to [MongoDB installation guide](https://www.mongodb.com/docs/manual/installation/).  

---

## Setting Up the Project  

1. **Clone the Repository**: Clone the repository to your local machine.  
   ```bash  
   git clone https://github.com/DiyaWadhwani/ClubConnect.git  
   cd ClubConnect  
   git checkout p2-mongo  
   ```  

2. **Install Dependencies**: Install all required Node.js modules.  
   ```bash  
   npm install  
   ```  

3. **Start the Application**:  
   Run the application with the following command:  
   ```bash  
   npm start  
   ```  
   The server will start on `http://localhost:3000`.  

---

## Executing MongoDB Queries  

1. **Import Data**: Import the JSON files into the MongoDB database.  
   ```bash  
   mongoimport --uri "mongodb://localhost:27017" --db clubConnect --collection club --file db/initialization/clubConnect.club.json --jsonArray  
   mongoimport --uri "mongodb://localhost:27017" --db clubConnect --collection university --file db/initialization/clubConnect.university.json --jsonArray  
   mongoimport --uri "mongodb://localhost:27017" --db clubConnect --collection student --file db/initialization/clubConnect.student.json --jsonArray  
   ```  

2. **Run Query1.js (Clubs Count by Category)**:  
   Counts clubs by category and sorts them in descending order.  
   ```bash  
   node Query1.js  
   ```  

3. **Run Query2.js (CS Students with Scheduled or Pending Interviews)**:  
   Finds Computer Science students from 2021 with interviews having a "Scheduled" or "Pending" status.  
   ```bash  
   node Query2.js  
   ```  

4. **Run Query3.js (Number of Clubs at Northeastern University)**:  
   Retrieves the number of clubs associated with Northeastern University.  
   ```bash  
   node Query3.js  
   ```  

5. **Run Query4.js (Update Event Status)**:  
   Updates the status of an event to "Completed" based on its `event_id`.  
   ```bash  
   node Query4.js  
   ```  

6. **Run Query5.js (Students Enrolled in Computer Science)**:  
   Retrieves all students enrolled in the Computer Science program, projecting key details.  
   ```bash  
   node Query5.js  
   ```  

---

## Video Demo
**[Club Connect Video Demo](https://youtu.be/fazz_tVTDrU)**

---

## Documentation  

- **[Database Design Documentation](./docs/ClubConnect_DatabaseDesign-Mongo.pdf)**  
- **[Requirements Specification](./docs/ClubConnect_Requirements.pdf)**  
- **[Class UML Diagram](./diagrams/ClubConnect_UML.png)**  
- **[ERD Diagram](./diagrams/ClubConnect_ERD.png)**  

---

## Troubleshooting  

- **MongoDB Connection Issues**: Ensure MongoDB is running locally. If configured differently, update the `uri` in the application and query files.  
- **Empty Query Results**: Verify query criteria and ensure the dataset contains the required records.  
- **Application Errors**: Confirm all dependencies are installed and the database is correctly populated.  

---

## License  

This project is licensed under the MIT License.  
