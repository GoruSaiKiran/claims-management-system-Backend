const mongoose = require("mongoose");
const policySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Changed from policyholderId
    type: { type: String, enum: ["health", "travel", "property", "life", "vehicle"], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
});
module.exports = mongoose.model("Policy", policySchema);