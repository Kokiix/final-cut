import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/User.model";

// the app connects to Mongo on import and there is no db in tests
vi.mock("../db", () => ({}));

// keep the request log out of the test output
vi.mock("morgan", () => ({
  default: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

vi.mock("../models/User.model", () => ({ default: { findOne: vi.fn(), findByIdAndUpdate: vi.fn() } }));

const findOne = User.findOne as unknown as Mock;
const findByIdAndUpdate = User.findByIdAndUpdate as unknown as Mock;

const secret = "test-secret";
const originalSecret = process.env.TOKEN_SECRET;
const userId = new mongoose.Types.ObjectId();
const authCookie = () => `authToken=${jwt.sign({ _id: userId.toString() }, secret)}`;

const profile = {
  _id: "user123",
  name: "Ada Lovelace",
  username: "ada",
  watchlist: [
    { _id: "507f1f77bcf86cd799439011", title: "The Dark Knight" },
  ],
  createdAt: "2026-10-01T12:00:00.000Z",
};

// User.findOne(...).select(...).populate(...)
function mockFindOneReturning(user: unknown) {
  const populate = vi.fn().mockResolvedValue(user);
  const select = vi.fn().mockReturnValue({ populate });
  findOne.mockReturnValue({ select });
  return { select, populate };
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.TOKEN_SECRET = secret;
});

afterAll(() => {
  process.env.TOKEN_SECRET = originalSecret;
});

describe("GET /api/users/:username", () => {
  it("returns the public profile with the watchlist populated", async () => {
    const { select, populate } = mockFindOneReturning(profile);

    const res = await request(app).get("/api/users/ada");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, user: profile });
    expect(res.body.user.email).toBeUndefined();
    expect(res.body.user.password).toBeUndefined();
    expect(findOne).toHaveBeenCalledWith({ username: "ada" });
    expect(select).toHaveBeenCalledWith("name username watchlist createdAt");
    expect(populate).toHaveBeenCalledWith("watchlist");
  });

  it("looks usernames up in lowercase", async () => {
    mockFindOneReturning(profile);

    await request(app).get("/api/users/ADA");

    expect(findOne).toHaveBeenCalledWith({ username: "ada" });
  });

  it("returns 404 when no user has that username", async () => {
    mockFindOneReturning(null);

    const res = await request(app).get("/api/users/nobody");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: "User not found." });
  });

  it("passes database errors to the global error handler", async () => {
    findOne.mockReturnValue({
      select: vi.fn().mockReturnValue({
        populate: vi.fn().mockRejectedValue(new Error("db is down")),
      }),
    });
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await request(app).get("/api/users/ada");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      message: "Internal server error. Check the server console",
    });

    consoleError.mockRestore();
  });
});

describe("PUT /api/users/me", () => {
  const updated = { _id: userId.toString(), name: "Ada L", username: "ada_l", email: "ada@example.com" };

  it("updates the sent fields and returns the user without the password", async () => {
    findByIdAndUpdate.mockResolvedValue({ ...updated, password: "hash" });

    const res = await request(app)
      .put("/api/users/me")
      .set("Cookie", authCookie())
      .send({ name: " Ada L ", username: "ada_l", password: "ignored" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, user: updated });
    expect(findByIdAndUpdate).toHaveBeenCalledWith(
      userId.toString(),
      { $set: { name: "Ada L", username: "ada_l" } },
      { new: true, runValidators: true }
    );
  });

  it("returns 401 when not logged in", async () => {
    const res = await request(app).put("/api/users/me").send({ name: "Ada" });

    expect(res.status).toBe(401);
    expect(findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 400 for an empty field", async () => {
    const res = await request(app).put("/api/users/me").set("Cookie", authCookie()).send({ name: "  " });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ success: false, message: "Name cannot be empty." });
    expect(findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 400 when nothing editable is sent", async () => {
    const res = await request(app).put("/api/users/me").set("Cookie", authCookie()).send({ password: "x" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ success: false, message: "Nothing to update." });
  });

  it("returns 409 when the username is taken", async () => {
    findByIdAndUpdate.mockRejectedValue({ code: 11000, keyValue: { username: "bob" } });

    const res = await request(app).put("/api/users/me").set("Cookie", authCookie()).send({ username: "bob" });

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ success: false, message: "Username is already taken." });
  });

  it("returns 400 when the model rejects the value", async () => {
    const err = new mongoose.Error.ValidationError();
    err.addError("email", new mongoose.Error.ValidatorError({ message: "Please provide a valid email address.", path: "email" }));
    findByIdAndUpdate.mockRejectedValue(err);

    const res = await request(app).put("/api/users/me").set("Cookie", authCookie()).send({ email: "nope" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ success: false, message: "Please provide a valid email address." });
  });
});
