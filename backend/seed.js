import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    const existing = await User.findOne({ email: "put_yours_email_here" });

    if (existing) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const hashedPassword = await bcryptjs.hash("put_yours_password_here", 12);

    await User.create({
      name: "Admin",
      email: "put_yours_email_here",
      password: hashedPassword,
      type: "admin",
    });

    console.log("Admin user created successfully");
    console.log("Email: put_yours_email_here");
    console.log("Password: put_yours_password_here");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
