const express = require("express");
const app = express();
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const dotenv = require("dotenv").config();
const URL = process.env.MONGO_URL;
app.use(express.json());

let student = [];

app.get("/", (req, res) => {
  res.status(200).json("Welcome to Mentor and Student  database");
});

app.post("/create_mentor", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("day41");
    const mentor = await db.collection("mentors").insertOne(req.body);
    await connection.close();
    res.json("Mentor created successful");
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});

app.post("/create_student", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("day41");
    const student = await db.collection("students").insertOne(req.body);
    await connection.close();
    res.json("Student created successful");
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});

/** get all mentors */
app.get("/mentors", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("day41");
    const mentor = await db.collection("mentors").find({}).toArray();
    await connection.close();
    res.json(mentor);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});

/** get student */

app.get("/students", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("day41");
    const student = await db.collection("students").find({}).toArray();
    await connection.close();
    res.json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});

/** assign student to a mentor */
app.put("/assign_mentor/:id", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("day41");
    const mentordata = await db
      .collection("mentors")
      .findOne({ _id: new mongodb.ObjectId(req.params.id) });
    if (mentordata) {
      delete req.body._id;
      const mentor = await db
        .collection("mentors")
        .updateOne(
          { _id: new mongodb.ObjectId(req.params.id) },
          { $set: req.body }
        );
      await connection.close();

      res.json(mentor);
    } else {
      res.status(404).json("mentor not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});

/** show all students of particular mentor */

app.get("/mentor_student/:id", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("day41");
    const mentor = await db
      .collection("mentors")
      .findOne({ _id: new mongodb.ObjectId(req.params.id) });
    await connection.close();
    if (mentor) {
      res.json(`students name : ${mentor.student} assigned to ${mentor.name}`);
    } else {
      res.status(404).json("Mentor not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});
/** assign or change mentor for student */
app.put("/assign_change_student/:id", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("day41");
    const studentdata = await db
      .collection("students")
      .findOne({ _id: new mongodb.ObjectId(req.params.id) });
    if (studentdata) {
      delete req.body._id;
      const student = await db
        .collection("students")
        .updateOne(
          { _id: new mongodb.ObjectId(req.params.id) },
          { $set: req.body }
        );
      await connection.close();

      res.json(student);
    } else {
      res.status(404).json("Student not found");
    }
    await connection.close();
    res.json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});

//delete to mentors
app.delete("/mentor_delete/:id", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("day41");
    const mentor = await db
      .collection("mentors")
      .deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
    await connection.close();
    if (mentor) {
      res.status(404).json("Mentor delete successful");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});
// detete to student
app.delete("/student_delete/:id", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("day41");
    const student = await db
      .collection("students")
      .deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
    await connection.close();
    if (student) {
      res.status(404).json("students delete successful");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});
app.listen(process.env.PORT || 3500);
