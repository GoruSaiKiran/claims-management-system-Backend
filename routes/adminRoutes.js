// adminRoutes.js
const express = require("express");
const Policy = require("../models/Policy");
const Claim = require("../models/Claim");
const User = require("../models/User");
const { authenticateToken, isAdmin } = require("../middleware/auth");
const router = express.Router();

// ✅ Admin Dashboard: View all policies and claims with user details
router.get("/dashboard", authenticateToken, isAdmin, async (req, res) => {
    try {
        const policies = await Policy.find().populate("userId", "username email");
        const claims = await Claim.find().populate("userId", "username email");
        res.json({ policies, claims });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Approve/Reject/Delete Policy
router.put("/policies/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const policy = await Policy.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(policy);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/policies/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        await Claim.deleteMany({ policyId: req.params.id }); // Delete associated claims
        await Policy.findByIdAndDelete(req.params.id);
        res.json({ message: "Policy and associated claims deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ✅ Approve/Reject/Delete Claim
router.put("/claims/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const claim = await Claim.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(claim);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/claims/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        await Claim.findByIdAndDelete(req.params.id);
        res.json({ message: "Claim deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
