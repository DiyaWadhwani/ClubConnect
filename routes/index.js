import express from "express";
import * as myRedis from "../db/myRedisCache.js";

const router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 9;
  const msg = req.query.msg || null;

  try {
    const { universities, total } = await myRedis.getUniversities(
      page,
      pageSize
    );
    res.render("./pages/index", {
      universities,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total / pageSize),
    });
  } catch (err) {
    console.error("Error rendering the index page:", err);
    next(err);
  }
});

router.get("/clubs", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 9;
  const msg = req.query.msg || null;
  try {
    const { clubs, total } = await myRedis.getClubs(page, pageSize);
    const { universities, uniTotal } = await myRedis.getUniversities(
      page,
      pageSize
    );

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
    const { universityDetails, clubDetails } = await myRedis.getUniversityByID(
      university_id
    );
    console.log("university", universityDetails);
    console.log("clubNames", clubDetails);
    res.render("./pages/editUniversity", {
      university: universityDetails,
      clubsByUni: clubDetails,
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

  if (club.category === "Other") {
    club.category = club.other_category;
  }

  club.university_id = parseInt(club.university);
  console.log("Create club", club);

  try {
    const createdClub = await myRedis.createClub(club);
    console.log("Inserted", createdClub);
    if (createdClub) {
      res.redirect("/clubs?msg=Created Club " + club.name);
    } else {
      res.redirect("/clubs?msg=Error Creating Club " + club.name);
    }
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

router.get("/clubs/:club_id/edit", async (req, res, next) => {
  const club_id = req.params.club_id;
  const msg = req.query.msg || null;
  try {
    const { clubDetails, university } = await myRedis.getClubByID(club_id);
    console.log("club", clubDetails);
    console.log("university", university);
    res.render("./pages/editClub", {
      university,
      club: clubDetails,
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
