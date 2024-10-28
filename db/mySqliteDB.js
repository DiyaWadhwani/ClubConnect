import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function getUniversities(query, page, pageSize) {
  console.log("getUniversities", query);

  const db = await open({
    filename: "./db/ClubConnect.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT * FROM University
    WHERE name LIKE @query
    ORDER BY name
    LIMIT @pageSize
    OFFSET @offset;
  `);

  const params = {
    "@query": query + "%",
    "@pageSize": pageSize,
    "@offset": (page - 1) * pageSize,
  };

  try {
    return await stmt.all(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function getUniversityCount(query) {
  console.log("getUniversityCount", query);

  const db = await open({
    filename: "./db/ClubConnect.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT COUNT(*) AS count
    FROM University
    WHERE name LIKE @query;
  `);

  const params = {
    "@query": query + "%",
  };

  try {
    return (await stmt.get(params)).count;
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function getClubs(query, page, pageSize) {
  console.log("getClubs", query);

  const db = await open({
    filename: "./db/ClubConnect.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT Club.clubID, Club.name AS clubName, Club.startDate, Club.description,
           University.name AS universityName
    FROM Club
    INNER JOIN University ON Club.universityID = University.universityID
    WHERE Club.name LIKE @query
    ORDER BY Club.startDate DESC
    LIMIT @pageSize
    OFFSET @offset;
  `);

  const params = {
    "@query": query + "%",
    "@pageSize": pageSize,
    "@offset": (page - 1) * pageSize,
  };

  try {
    return await stmt.all(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function getClubCount(query) {
  console.log("getClubs", query);

  const db = await open({
    filename: "./db/ClubConnect.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT COUNT(*) AS count
    FROM Club
    WHERE name LIKE @query;
  `);

  const params = {
    "@query": query + "%",
  };

  try {
    return (await stmt.get(params)).count;
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function getUniversityByID(universityID) {
  console.log("getUniversityByID", universityID);

  const db = await open({
    filename: "./db/ClubConnect.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT * FROM University
    WHERE universityID = @universityID;
  `);

  const params = {
    "@universityID": universityID,
  };

  try {
    return await stmt.get(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function updateUniversityByID(universityID, university) {
  console.log("updateUniversityByID", universityID, university);

  const db = await open({
    filename: "./db/ClubConnect.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    UPDATE University
    SET
      emailDomain = @emailDomain,
      website = @website,
      address = @address,
      city = @city,
      state = @state,
      zipCode = @zipCode
    WHERE
      universityID = @universityID;
  `);

  const params = {
    "@universityID": universityID,
    "@emailDomain": university.emailDomain,
    "@website": university.website,
    "@address": university.address,
    "@city": university.city,
    "@state": university.state,
    "@zipCode": university.zipCode,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function deleteUniversityByID(universityID) {
  console.log("deleteUniversityByID", universityID);

  const db = await open({
    filename: "./db/ClubConnect.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    DELETE FROM University
    WHERE
       universityID = @universityID;
  `);

  const params = {
    "@universityID": universityID,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function createClub(club) {
  const db = await open({
    filename: "./db/ClubConnect.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    INSERT INTO Club (
      name, description, startDate, email, logo, clubCategory, universityID
    ) VALUES (
      @name, @description, @startDate, @email, @logo, @clubCategory, @universityID
    );
  `);

  try {
    return await stmt.run({
      "@name": club.name,
      "@description": club.description,
      "@startDate": club.startDate,
      "@email": club.email,
      "@logo": club.logo,
      "@clubCategory": club.clubCategory,
      "@universityID": parseInt(club.university),
    });
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function getClubsByUniversityID(universityID) {
  console.log("getClubsByUniversityID", universityID);

  const db = await open({
    filename: "./db/ClubConnect.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT * FROM Club
    WHERE universityID = @universityID;
  `);

  const params = {
    "@universityID": universityID,
  };

  try {
    return await stmt.all(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function addAuthorIDToReferenceID(reference_id, author_id) {
  console.log("addAuthorIDToReferenceID", reference_id, author_id);

  const db = await open({
    filename: "./db/ClubConnect.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    INSERT INTO
    Reference_Author(reference_id, author_id)
    VALUES (@reference_id, @author_id);
  `);

  const params = {
    "@reference_id": reference_id,
    "@author_id": author_id,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function getAuthors(query, page, pageSize) {
  console.log("getAuthors query", query);

  const db = await open({
    filename: "./db/ClubConnect.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT * FROM Author
    WHERE 
      first_name LIKE @query OR 
      last_name LIKE @query
    ORDER BY last_name DESC
    LIMIT @pageSize
    OFFSET @offset;
  `);

  const params = {
    "@query": query + "%",
    "@pageSize": pageSize,
    "@offset": (page - 1) * pageSize,
  };

  try {
    return await stmt.all(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function getAuthorsCount(query) {
  console.log("getAuthorsCount query", query);

  const db = await open({
    filename: "./db/ClubConnect.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT COUNT(*) AS count
    FROM Author
    WHERE 
      first_name LIKE @query OR 
      last_name LIKE @query;
  `);

  const params = {
    "@query": query + "%",
  };

  try {
    return (await stmt.get(params)).count;
  } finally {
    await stmt.finalize();
    db.close();
  }
}
