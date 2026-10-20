import { Request, Response, NextFunction } from "express";
import User from "../models/User.model";

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
