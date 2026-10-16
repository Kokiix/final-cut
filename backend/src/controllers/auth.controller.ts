import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.model";

const SALT_ROUNDS = 10;

const TOKEN_EXPIRES_IN = "7d";
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

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

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body ?? {};

  // make sure both fields were sent, and that they are plain strings (same trick as in signup)
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    res.status(400).json({ success: false, message: "Please provide email and password." });
    return;
  }

  // the secret used to sign tokens lives in .env, without it we can't log anyone in
  const tokenSecret = process.env.TOKEN_SECRET;
  if (!tokenSecret) {
    next(new Error("TOKEN_SECRET is missing from .env"));
    return;
  }

  try {
    // find the user by email. Password has `select: false` in the model, so we ask for it here
    const foundUser = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

    // compare the typed password with the stored hash. bcrypt hashes it again and checks they match
    const passwordCorrect = foundUser ? await bcrypt.compare(password, foundUser.password) : false;

    // same message for "no user" and "wrong password" so nobody can guess which emails are registered
    if (!foundUser || !passwordCorrect) {
      res.status(401).json({ success: false, message: "Invalid email or password." });
      return;
    }

    // the token only holds the user id. It's signed, so if anyone edits it the signature breaks
    const authToken = jwt.sign({ _id: foundUser._id.toString() }, tokenSecret, { expiresIn: TOKEN_EXPIRES_IN });

    // put the token in a cookie so the browser sends it automatically on every request
    res.cookie("authToken", authToken, {
      httpOnly: true, // JavaScript in the browser can't read it (protects against XSS stealing it)
      secure: process.env.NODE_ENV === "production", // only sent over https in production
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE_MS
    });

    res.status(200).json({
      success: true,
      user: {
        _id: foundUser._id,
        name: foundUser.name,
        username: foundUser.username,
        email: foundUser.email
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/verify 
// checks if user is logged in 
export const verify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // the token only has the id, so get the latest user info from the db
    const foundUser = await User.findById(req.payload?._id);

    // token is valid but the user was deleted in the meantime
    if (!foundUser) {
      res.status(401).json({ success: false, message: "User no longer exists." });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        _id: foundUser._id,
        name: foundUser.name,
        username: foundUser.username,
        email: foundUser.email
      }
    });
  } catch (err) {
    next(err);
  }
};
