import express from "express";
import * as myDb from "../db/mySqliteDB.js";

const router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 9;
  const msg = req.query.msg || null;
  try {
    let total = await myDb.getUniversityCount(query);
    console.log("total", total);
    let universities = await myDb.getUniversities(query, page, pageSize);

    res.render("./pages/index", {
      universities,
      clubs: [],
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total / pageSize),
    });
  } catch (err) {
    next(err);
  }
});

// http://localhost:3000/references?pageSize=24&page=3&q=John
router.get("/clubs", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    let total = await myDb.getClubCount(query);
    let clubs = await myDb.getClubs(query, page, pageSize);
    let universities = await myDb.getUniversities("", 1, 100);

    res.render("./pages/index_clubs", {
      clubs,
      universities,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total / pageSize),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:universityID/edit", async (req, res, next) => {
  const universityID = req.params.universityID;
  const msg = req.query.msg || null;
  try {
    let university = await myDb.getUniversityByID(universityID);
    let clubsByUni = await myDb.getClubsByUniversityID(universityID);

    console.log("edit university", {
      university,
      clubsByUni,
      msg,
    });

    res.render("./pages/editUniversity", {
      university,
      clubsByUni,
      msg,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:universityID/edit", async (req, res, next) => {
  const universityID = req.params.universityID;
  const university = req.body;

  try {
    let updatedUniversity = await myDb.updateUniversityByID(
      universityID,
      university
    );
    console.log("updatedUniversity", updatedUniversity);

    if (updatedUniversity && updatedUniversity.changes === 1) {
      res.redirect("/?msg=Updated University Details successfully");
    } else {
      res.redirect("/?msg=Error Updating");
    }
  } catch (err) {
    next(err);
  }
});

router.get("/:universityID/delete", async (req, res, next) => {
  const universityID = req.params.universityID;

  try {
    let deletedUniversity = await myDb.deleteUniversityByID(universityID);
    console.log("delete", deletedUniversity);

    if (deletedUniversity && deletedUniversity.changes === 1) {
      res.redirect("/?msg=Deleted University Successfully");
    } else {
      res.redirect("/?msg=Error Deleting");
    }
  } catch (err) {
    next(err);
  }
});

router.post("/createClub", async (req, res, next) => {
  const club = req.body;

  if (club.clubCategory === "Other") {
    club.clubCategory = club.other_category;
  }
  console.log("Create club", club);

  try {
    const createdClub = await myDb.createClub(club);

    console.log("Inserted", createdClub);
    res.redirect("/clubs?msg=Created Club " + club.name);
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

router.get("/clubs/:clubID/edit", async (req, res, next) => {
  const clubID = req.params.clubID;
  const msg = req.query.msg || null;
  try {
    let club = await myDb.getClubByID(clubID);

    console.log("edit club", {
      club,
      msg,
    });

    res.render("./pages/editClub", {
      club,
      msg,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/clubs/:clubID/edit", async (req, res, next) => {
  const clubID = req.params.clubID;
  const club = req.body;

  try {
    let updatedClub = await myDb.updateClubByID(clubID, club);
    console.log("updatedClub", updatedClub);

    if (updatedClub && updatedClub.changes === 1) {
      res.redirect("/clubs?msg=Updated Club Details successfully");
    } else {
      res.redirect("/clubs?msg=Error Updating");
    }
  } catch (err) {
    next(err);
  }
});

router.get("/clubs/:clubID/delete", async (req, res, next) => {
  const clubID = req.params.clubID;

  try {
    let deletedClub = await myDb.deleteClubByID(clubID);
    console.log("delete", deletedClub);

    if (deletedClub && deletedClub.changes === 1) {
      res.redirect("/clubs?msg=Deleted Club Successfully");
    } else {
      res.redirect("/clubs?msg=Error Deleting");
    }
  } catch (err) {
    next(err);
  }
});

router.get("/membership", async (req, res, next) => {
  res.render("./pages/index_membership");
});

export default router;
