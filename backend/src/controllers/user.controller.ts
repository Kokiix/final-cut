import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../models/User.model";
import Movie from "../models/Movie.model";

// GET /api/users/:username
// public profile: what other people see when they open someone's page (no email, no password)
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;

  if (typeof username !== "string" || !username.trim()) {
    res.status(400).json({ success: false, message: "Please provide a username." });
    return;
  }

  try {
    // usernames are saved lowercase, so lowercase the search too
    // populate swaps the watchlist ids for the actual movie documents
    const foundUser = await User.findOne({ username: username.trim().toLowerCase() })
      .select("name username watchlist createdAt")
      .populate("watchlist");

    if (!foundUser) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        _id: foundUser._id,
        name: foundUser.name,
        username: foundUser.username,
        watchlist: foundUser.watchlist,
        createdAt: foundUser.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/users/watchlist/:movieId
// toggles a movie in the logged in user's watchlist: adds it if it's missing, removes it if it's there
export const toggleWatchlist = async (req: Request, res: Response, next: NextFunction) => {
  const { movieId } = req.params;

  // same check as getMovie, so a bad id gets a clean 400 instead of a cast error
  if (typeof movieId !== "string" || !mongoose.isValidObjectId(movieId)) {
    res.status(400).json({ success: false, message: "Invalid movie id." });
    return;
  }

  try {
    const foundUser = await User.findById(req.payload?._id).select("watchlist");

    // token is valid but the user was deleted in the meantime
    if (!foundUser) {
      res.status(401).json({ success: false, message: "User no longer exists." });
      return;
    }

    const inWatchlist = foundUser.watchlist.some((id) => id.equals(movieId));

    // only check the movie exists when adding, so a movie deleted from the db can still be removed
    if (!inWatchlist && !(await Movie.exists({ _id: movieId }))) {
      res.status(404).json({ success: false, message: "Movie not found." });
      return;
    }

    // $pull removes the id, $addToSet adds it only if it isn't there yet (safe on double clicks)
    const updatedUser = await User.findByIdAndUpdate(
      foundUser._id,
      inWatchlist ? { $pull: { watchlist: movieId } } : { $addToSet: { watchlist: movieId } },
      { new: true }
    );

    res.status(200).json({ success: true, added: !inWatchlist, watchlist: updatedUser?.watchlist ?? [] });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/watchlist
// the logged in user's watchlist, with the full movies instead of just ids
export const getWatchlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const foundUser = await User.findById(req.payload?._id).select("watchlist").populate("watchlist");

    // token is valid but the user was deleted in the meantime
    if (!foundUser) {
      res.status(401).json({ success: false, message: "User no longer exists." });
      return;
    }

    res.status(200).json({ success: true, watchlist: foundUser.watchlist });
  } catch (err) {
    next(err);
  }
};

// the profile fields a user can change about themselves. Password has its own flow, so it's not here
const EDITABLE_FIELDS = ["name", "username", "email"] as const;

// PUT /api/users/me
// updates the logged in user's name, username and/or email. Only the fields that are sent change
export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body ?? {};
  const updates: Record<string, string> = {};

  for (const field of EDITABLE_FIELDS) {
    if (body[field] === undefined) continue;

    // only accept plain strings (same trick as in signup)
    if (typeof body[field] !== "string" || !body[field].trim()) {
      res.status(400).json({ success: false, message: `${field[0].toUpperCase()}${field.slice(1)} cannot be empty.` });
      return;
    }

    updates[field] = body[field].trim();
  }

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ success: false, message: "Nothing to update." });
    return;
  }

  try {
    // runValidators so the model's format/length rules run on updates too
    const updatedUser = await User.findByIdAndUpdate(req.payload?._id, { $set: updates }, {
      new: true,
      runValidators: true
    });

    // token is valid but the user was deleted in the meantime
    if (!updatedUser) {
      res.status(401).json({ success: false, message: "User no longer exists." });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email
      }
    });
  } catch (err) {
    // model rules failed (bad email format, username too short, ...)
    if (err instanceof mongoose.Error.ValidationError) {
      const firstError = Object.values(err.errors)[0];
      res.status(400).json({ success: false, message: firstError?.message ?? "Invalid user data." });
      return;
    }

    // the unique index caught a username or email someone else already has
    if ((err as { code?: number }).code === 11000) {
      const key = Object.keys((err as { keyValue?: object }).keyValue ?? {})[0];
      const field = key === "email" ? "Email" : key === "username" ? "Username" : "Email or username";
      res.status(409).json({ success: false, message: `${field} is already taken.` });
      return;
    }

    next(err);
  }
};
