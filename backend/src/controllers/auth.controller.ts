import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../models/User.model";

const SALT_ROUNDS = 10;

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { name, username, email, password } = req.body ?? {};

  // make sure every field was sent
  if (!name || !username || !email || !password) {
    res.status(400).json({ success: false, message: "Please provide name, username, email and password." });
    return;
  }

  // only accept plain strings (blocks tricks like sending { "$ne": null } into the db query below)
  if ([name, username, email, password].some((field) => typeof field !== "string")) {
    res.status(400).json({ success: false, message: "All fields must be text." });
    return;
  }

  // basic password rule (the model can't check this because it only ever sees the hash)
  if (password.length < 8) {
    res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    return;
  }

  try {
    // check if the email or username is already used. findOne stops at the first match
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }]
    });

    if (existingUser) {
      const field = existingUser.email === normalizedEmail ? "Email" : "Username";
      res.status(409).json({ success: false, message: `${field} is already taken.` });
      return;
    }

    // hash the password, we never store the plain text
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // save the user. The model handles lowercase/trim/format checks on the other fields
    const createdUser = await User.create({ name, username, email, password: hashedPassword });

    // send the user back w/o the password
    res.status(201).json({
      success: true,
      user: {
        _id: createdUser._id,
        name: createdUser.name,
        username: createdUser.username,
        email: createdUser.email
      }
    });
  } catch (err) {
    // Model rules failed (bad email format, username too short, ...)
    if (err instanceof mongoose.Error.ValidationError) {
      const firstError = Object.values(err.errors)[0];
      res.status(400).json({ success: false, message: firstError?.message ?? "Invalid user data." });
      return;
    }

    // backup for the check above: if two people sign up with the same email at the same moment,
    // both can pass findOne, but Mongo's unique index rejects the second one with error 11000
    if ((err as { code?: number }).code === 11000) {
      const field = Object.keys((err as { keyValue?: object }).keyValue ?? {})[0] ?? "Email or username";
      res.status(409).json({ success: false, message: `${field} is already taken.` });
      return;
    }

    // Anything else goes to the global error handler
    next(err);
  }
};
