import express from "express";
import * as myDb from "../db/mySqliteDB.js";

const router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.redirect("/references");
});

// http://localhost:3000/references?pageSize=24&page=3&q=John
router.get("/references", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    let total = await myDb.getReferencesCount(query);
    let references = await myDb.getReferences(query, page, pageSize);


    res.render("./pages/index", {
      references,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total / pageSize),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/references/:reference_id/edit", async (req, res, next) => {
  const reference_id = req.params.reference_id;
  const msg = req.query.msg || null;
  try {
    let ref = await myDb.getReferenceByID(reference_id);
    let authors = await myDb.getAuthorsByReferenceID(reference_id);

    console.log("edit reference", {
      ref,
      authors,
      msg,
    });

    res.render("./pages/editReference", {
      ref,
      authors,
      msg,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/references/:reference_id/edit", async (req, res, next) => {
  const reference_id = req.params.reference_id;
  const ref = req.body;

  try {
    let updateResult = await myDb.updateReferenceByID(reference_id, ref);
    console.log("update", updateResult);

    if (updateResult && updateResult.changes === 1) {
      res.redirect("/references/?msg=Updated");
    } else {
      res.redirect("/references/?msg=Error Updating");
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
    let updateResult = await myDb.addAuthorIDToReferenceID(reference_id, author_id);
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

router.post("/createReference", async (req, res, next) => {
  const ref = req.body;

  try {
    const insertRes = await myDb.insertReference(ref);

    console.log("Inserted", insertRes);
    res.redirect("/references/?msg=Inserted");
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
