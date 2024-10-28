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

    console.log("edit reference", {
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

router.post("/references/:reference_id/addAuthor", async (req, res, next) => {
  console.log("Add author", req.body);
  const reference_id = req.params.reference_id;
  const author_id = req.body.author_id;

  try {
    let updateResult = await myDb.addAuthorIDToReferenceID(
      reference_id,
      author_id
    );
    console.log("addAuthorIDToReferenceID", updateResult);

    if (updateResult && updateResult.changes === 1) {
      res.redirect(`/references/${reference_id}/edit?msg=Author added`);
    } else {
      res.redirect(`/references/${reference_id}/edit?msg=Error adding author`);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/references/:reference_id/delete", async (req, res, next) => {
  const reference_id = req.params.reference_id;

  try {
    let deleteResult = await myDb.deleteReferenceByID(reference_id);
    console.log("delete", deleteResult);

    if (deleteResult && deleteResult.changes === 1) {
      res.redirect("/references/?msg=Deleted");
    } else {
      res.redirect("/references/?msg=Error Deleting");
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
    res.redirect("/clubs/?msg=Created Club " + club.name);
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

// http://localhost:3000/references?pageSize=24&page=3&q=John
router.get("/authors", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    let total = await myDb.getAuthorsCount(query);
    let authors = await myDb.getAuthors(query, page, pageSize);

    res.render("./pages/index_authors", {
      authors,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total / pageSize),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
