const mongoose = require("mongoose");
const dotenv = require("dotenv");
const genres = require("./route/genres");
const customers = require("./route/customers");
const movies = require("./route/movies");
const rentals = require("./route/rentals");
const express = require("express");
const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to Mongodb..."))
  .catch((error) => console.error("Could not connect to Mongodb...", error));

app.use(express.json());
app.use("/api/genre", genres);
app.use("/api/customer", customers);
app.use("/api/movie", movies);
app.use("/api/rental", rentals);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));
