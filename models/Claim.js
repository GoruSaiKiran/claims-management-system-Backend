const mongoose = require("mongoose");
const claimSchema = new mongoose.Schema({
    policyId: { type: mongoose.Schema.Types.ObjectId, ref: "Policy", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Added user reference
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
});
module.exports = mongoose.model("Claim", claimSchema);