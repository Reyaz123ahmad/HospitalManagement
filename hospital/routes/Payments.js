// routes/Payment.js
const express = require("express");
const router = express.Router();
const { capturePayment, verifySignature } = require("../controllers/Payment");
const { auth, isCustomer } = require("../middlewares/auth");

router.post("/capturePayment", auth, isCustomer, capturePayment);
router.post("/verifySignature",auth, isCustomer, verifySignature);

module.exports = router;