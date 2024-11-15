import express from "express";
import * as myDb from "../db/myMongoDB.js";

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

router.get("/:university_id/edit", async (req, res, next) => {
  const university_id = parseInt(req.params.university_id);
  const msg = req.query.msg || null;
  try {
    let university = await myDb.getUniversityByID(university_id);
    university = university[0];
    let clubsByUni = await myDb.getClubsByUniversityID(university_id);

    res.render("./pages/editUniversity", {
      university,
      clubsByUni,
      msg,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:university_id/edit", async (req, res, next) => {
  const university_id = parseInt(req.params.university_id);
  const university = req.body;

  try {
    let updatedUniversity = await myDb.updateUniversityByID(
      university_id,
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

router.get("/:university_id/delete", async (req, res, next) => {
  const university_id = parseInt(req.params.university_id);

  try {
    let deletedUniversity = await myDb.deleteUniversityByID(university_id);
    console.log("delete", deletedUniversity);

    if (
      deletedUniversity &&
      deletedUniversity.acknowledged &&
      deletedUniversity.deletedCount === 1
    ) {
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

  club.university_id = parseInt(club.university);
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

router.get("/clubs/:club_id/edit", async (req, res, next) => {
  const club_id = parseInt(req.params.club_id);
  const msg = req.query.msg || null;
  try {
    let club = await myDb.getClubByID(club_id);
    club = club[0];
    let university = await myDb.getUniversityByClubID(club_id);
    university = university[0];
    res.render("./pages/editClub", {
      university,
      club,
      msg,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/clubs/:club_id/edit", async (req, res, next) => {
  const club_id = parseInt(req.params.club_id);
  const club = req.body;
  console.log("club", club);
  if (club.clubCategory === "Other") {
    club.clubCategory = club.other_category;
  }

  try {
    let updatedClub = await myDb.updateClubByID(club_id, club);
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

router.get("/clubs/:club_id/delete", async (req, res, next) => {
  const club_id = parseInt(req.params.club_id);

  try {
    let deletedClub = await myDb.deleteClubByID(club_id);
    console.log("delete", deletedClub);

    if (
      deletedClub &&
      deletedClub.acknowledged &&
      deletedClub.deletedCount === 1
    ) {
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
