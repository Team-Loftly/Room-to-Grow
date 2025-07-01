import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import app, { sandbox } from "./testApp.js";
import User from "../src/models/Users.js";

const request = supertest(app);

describe("Auth API", function () {
  describe("POST /register", () => {
    afterEach(() => {
      sandbox.restore();
    });
    it("should register a new user and return a JWT token", async () => {
      // mock db interaction
      sandbox.stub(User, "findOne").resolves(null);
      sandbox.stub(User.prototype, "save").resolvesThis();

      const res = await request
        .post("/auth/register")
        .send({ email: "user@example.com", password: "password123" });

      expect(res.status).to.equal(201);
      expect(res.body.token).to.equal("fake-token");
    });

    it("should fail if email is invalid", async () => {
      const res = await request
        .post("/auth/register")
        .send({ email: "invalid-email", password: "password123" });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid Email");
    });

    it("should fail if user already exists", async () => {
      sandbox.stub(User, "findOne").resolves({ email: "user@example.com" });

      const res = await request
        .post("/auth/register")
        .send({ email: "user@example.com", password: "password123" });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("User already exists");
    });
  });

  describe("POST /login", () => {
    afterEach(() => {
      sandbox.restore();
    });
    it("should login and return a JWT token", async () => {
      const fakeUser = {
        _id: new mongoose.Types.ObjectId(),
        email: "user@example.com",
        hashedPassword: "hashed123",
      };

      sandbox.stub(User, "findOne").resolves(fakeUser);

      const res = await request
        .post("/auth/login")
        .send({ email: "user@example.com", password: "password123" });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("token", "fake-token");
    });

    it("should fail if credentials are invalid (bad email)", async () => {
      sandbox.stub(User, "findOne").resolves(null);

      const res = await request
        .post("/auth/login")
        .send({ email: "not@found.com", password: "password123" });

      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal("Invalid credentials");
    });

    it("should return 400 for invalid email or password format", async () => {
      const res = await request
        .post("/auth/login")
        .send({ email: "bademail", password: "" });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid email or password");
    });
  });
});
