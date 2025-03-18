const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/brandfluence", {
  }).then(() => {
    console.log("Connected to MongoDB successfully!");
  }).catch(err => {
    console.error("MongoDB connection error:", err);
  });
  

const profileSchema = new mongoose.Schema({
  name: String,
  designation: String,
  bio: String,
  platforms: String,
  email: String,
  location: String
});

const Profile = mongoose.model("Profile", profileSchema);

// Fetch profile data
app.get("/profile", async (req, res) => {
  const profile = await Profile.findOne();
  res.json(profile);
});

//update profile data
app.post("/profile/update", async (req, res) => {
    console.log("Received update request:", req.body);
  
    if (!req.body.name || !req.body.email) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      const { name, designation, bio, platforms, email, location } = req.body;
      const updatedProfile = await Profile.findOneAndUpdate(
        {},
        { name, designation, bio, platforms, email, location },
        { upsert: true, new: true }
      );
  
      console.log("Updated profile:", updatedProfile);
      res.json({ message: "Profile updated successfully", profile: updatedProfile });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  

app.listen(3000, () => console.log("Server running on port 3000"));
