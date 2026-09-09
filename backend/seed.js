import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    const existing = await User.findOne({ email: "burrnboy18@gmail.com" });

    if (existing) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const hashedPassword = await bcryptjs.hash("Allah786*0", 12);

    await User.create({
      name: "Admin",
      email: "burrnboy18@gmail.com",
      password: hashedPassword,
      type: "admin",
    });

    console.log("Admin user created successfully");
    console.log("Email: burrnboy18@gmail.com");
    console.log("Password: Allah786*0");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
