const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const express = require("express");
const router = express.Router();

//Get All Movies
router.get("/", async (req, res) => {
  const movie = await Movie.find().sort("name");
  res.send(movie);
});

//Create A Movie
router.post("/", async (req, res) => {
  console.log("Received request body:", req.body);

  const { error } = validate(req.body);
  if (error) {
    console.log("Validation error:", error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    console.log("Genre not found for ID:", req.body.genreId);
    return res.status(400).send("invalid genreId");
  }

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  console.log("Movie object before save:", movie);

  try {
    movie = await movie.save();
    console.log("Saved movie:", movie);
    res.send(movie);
  } catch (saveError) {
    console.error("Error saving movie:", saveError);
    res.status(500).send("Error saving movie: " + saveError.message);
  }
});

//Update A Movie
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: Genre._id,
        name: Genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    {
      new: true,
    }
  );

  if (!movie)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(movie);
});

//Delete A Movie
router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send({ message: "Movie Successfully Deleted" });
});

//Get A Movie
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

module.exports = router;
