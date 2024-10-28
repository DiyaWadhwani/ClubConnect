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
  console.log("createClub", club);
  if (club.logo === "") {
    club.logo = null;
  }

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

export async function getClubByID(clubID) {
  console.log("getClubByID", clubID);

  const db = await open({
    filename: "./db/ClubConnect.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT Club.clubID, Club.name AS clubName, Club.description, Club.startDate, Club.email, Club.logo, University.name as universityName FROM Club
    INNER JOIN University ON Club.universityID = University.universityID
    WHERE clubID = @clubID;
  `);

  const params = {
    "@clubID": clubID,
  };

  try {
    return await stmt.get(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function updateClubByID(clubID, club) {
  console.log("updateClubByID", clubID, club);

  const db = await open({
    filename: "./db/ClubConnect.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    UPDATE Club
    SET
      description = @description,
      email = @email,
      logo = @logo,
      clubCategory = @clubCategory
    WHERE
      clubID = @clubID;
  `);

  const params = {
    "@clubID": clubID,
    "@name": club.name,
    "@description": club.description,
    "@startDate": club.startDate,
    "@email": club.email,
    "@logo": club.logo,
    "@clubCategory": club.clubCategory,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function deleteClubByID(clubID) {
  console.log("deleteClubByID", clubID);

  const db = await open({
    filename: "./db/ClubConnect.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    DELETE FROM Club
    WHERE
       clubID = @clubID;
  `);

  const params = {
    "@clubID": clubID,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}
