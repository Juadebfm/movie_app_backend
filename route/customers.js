const { Customer, validate } = require("../models/customer");
const express = require("express");
const router = express.Router();

// Get All Customers
router.get("/", async (req, res) => {
  const customer = await Customer.find().sort("name");
  res.send(customer);
});

// Create A Customer
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  console.log("POST request received");
  console.log("Request body:", req.body);

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  customer = await customer.save();
  res.send(customer);
});

// Update A Customer
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
    {
      new: true,
    }
  );

  if (!customer)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(customer);
});

// Delete A Customer
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer)
    return res.status(404).send("The genre with the given ID was not found.");

  res.json({ message: "Customer Deleted" });
});

// Get A Customer
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(customer);
});

module.exports = router;
