// userRoutes.js
const express = require("express");
const Policy = require("../models/Policy");
const Claim = require("../models/Claim");
const User = require("../models/User");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

// ✅ User applies for a policy (Pending by default)
router.post("/apply-policy", authenticateToken, async (req, res) => {
    try {
        const { type, amount } = req.body;
        const policy = new Policy({ type, amount, userId: req.user.userId, status: "Pending" });
        await policy.save();
        res.status(201).json({ message: "Policy application submitted!", policy });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ User applies for a claim (Pending by default)

router.post("/apply-claim", authenticateToken, async (req, res) => {
    try {
        const { policyId, amount, description } = req.body;
        const policy = await Policy.findById(policyId);
        
        if (!policy) {
            return res.status(400).json({ error: "Invalid policy ID. Please select a valid policy." });
        }
        
        if (amount > policy.amount) {
            return res.status(400).json({ error: `Claim amount cannot exceed policy limit ($${policy.amount}).` });
        }

        const claim = new Claim({ policyId, userId: req.user.userId, amount, description, status: "Pending" });
        await claim.save();

        res.status(201).json({ message: "Claim application submitted!", claim });
    } catch (error) {
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});


// ✅ Get User Dashboard (Policies and Claims with Policy Name and Status)
router.get("/dashboard", authenticateToken, async (req, res) => {
    try {
        const policies = await Policy.find({ userId: req.user.userId }).select("type status");
        const claims = await Claim.find({ userId: req.user.userId }).populate("policyId", "type status");
        res.json({ policies, claims });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;