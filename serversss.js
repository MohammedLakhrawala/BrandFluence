const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const PORT = 3019;
const SECRET_KEY = "your_secret_key";
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/brandfluence", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", (err) => console.error("❌ MongoDB Connection Error:", err));
db.once("open", () => console.log("✅ MongoDB Connected Successfully!"));

// Profile Schema
const ProfileSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Influencer", "Agency"], required: true },
  fullName: String,
  mobile: String,
  gender: String,
  socialMedia: String,
  socialID: String,
  followers: Number,
  companyName: String
});

const CampaignSchema = new mongoose.Schema({
  campaignName: { type: String, required: true },
  campaignDescription: { type: String, required: true },
  platform: { type: String, required: true },
  gender: { type: String, required: true },
  lastApplyDate: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true }, // Stores real agency ID
  createdByName: String // Stores real agency name
});

const ApplicationSchema = new mongoose.Schema({
  influencerId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  influencerName: String, // Stores real influencer name
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
  status: { type: String, enum: ["Pending", "Selected", "Rejected"], default: "Pending" }
});

const Profile = mongoose.model("Profile", ProfileSchema);
const Campaign = mongoose.model("Campaign", CampaignSchema);
const Application = mongoose.model("Application", ApplicationSchema);

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role, companyName, fullName } = req.body;
    const existingUser = await Profile.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username or Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Profile({
      username,
      email,
      password: hashedPassword,
      role,
      companyName: role === "Agency" ? companyName : undefined,
      fullName: role === "Influencer" ? fullName : undefined
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Profile.findOne({ username });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.companyName || user.fullName }, SECRET_KEY, {
      expiresIn: "1h"
    });

    res.json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Create Campaign (Stores real agency name)
app.post("/api/create-campaign", async (req, res) => {
  try {
    const { campaignName, campaignDescription, platform, gender, lastApplyDate, createdBy } = req.body;

    const agency = await Profile.findById(createdBy);
    if (!agency || agency.role !== "Agency") {
      return res.status(400).json({ success: false, message: "Invalid agency ID" });
    }

    const newCampaign = new Campaign({
      campaignName,
      campaignDescription,
      platform,
      gender,
      lastApplyDate,
      createdBy: agency._id,
      createdByName: agency.companyName
    });

    await newCampaign.save();
    res.status(201).json({ success: true, message: "Campaign created successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating campaign" });
  }
});

// Fetch campaigns for a specific agency
app.get("/api/my-campaigns/:agencyId", async (req, res) => {
  try {
    const campaigns = await Campaign.find({ createdBy: req.params.agencyId });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: "Error fetching campaigns" });
  }
});

// Fetch campaign details with applicant count
app.get("/api/campaign/:campaignId", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.campaignId);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    const applicantCount = await Application.countDocuments({ campaignId: campaign._id });
    res.json({ campaign, applicantCount });
  } catch (error) {
    res.status(500).json({ error: "Error fetching campaign details" });
  }
});

// Apply for Campaign (Stores influencer name & ID)
app.post("/api/apply-campaign", async (req, res) => {
  try {
    const { influencerId, campaignId } = req.body;

    const influencer = await Profile.findById(influencerId);
    if (!influencer || influencer.role !== "Influencer") {
      return res.status(400).json({ success: false, message: "Invalid influencer ID" });
    }

    const existingApplication = await Application.findOne({ influencerId, campaignId });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: "Already applied to this campaign." });
    }

    const newApplication = new Application({
      influencerId: influencer._id,
      influencerName: influencer.fullName,
      campaignId
    });

    await newApplication.save();
    res.status(201).json({ success: true, message: "Application submitted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error applying for campaign" });
  }
});

// Select an applicant for a campaign
app.put("/api/select-applicant", async (req, res) => {
  try {
    const { applicationId } = req.body;
    await Application.findByIdAndUpdate(applicationId, { status: "Selected" });
    res.json({ success: true, message: "Influencer selected successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error selecting influencer" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
