import { expect } from "chai";
import sinon from "sinon";
import * as authHelper from "../src/util/AuthHelper.js";
import jwt from "jsonwebtoken";
import { mockReq, mockRes } from "sinon-express-mock";

describe("AuthHelper Tests", function () {
  describe("validateEmail()", function () {
    it("should return true for valid email", function () {
      expect(authHelper.validateEmail("user@example.com")).to.be.true;
    });

    it("should return false for invalid email", function () {
      expect(authHelper.validateEmail("invalid-email")).to.be.false;
    });

    it("should return false for an empty email", function () {
      expect(authHelper.validateEmail("")).to.be.false;
    });

    it("should return false for an undefined email", function () {
      expect(authHelper.validateEmail(null)).to.be.false;
    });
  });

  describe("validatePassword()", function () {
    it("should return true for non-empty password", function () {
      expect(authHelper.validatePassword("password123")).to.be.true;
    });

    it("should return false for empty password", function () {
      expect(authHelper.validatePassword("")).to.be.false;
    });

    it("should return false for undefined", function () {
      expect(authHelper.validatePassword(undefined)).to.be.false;
    });
  });

  describe("hashPassword() and compareHashedPassword()", function () {
    it("should hash and match the password", async function () {
      const password = "password123";
      const hashed = await authHelper.hashPassword(password);
      const isMatch = await authHelper.compareHashedPassword(password, hashed);
      expect(isMatch).to.be.true;
    });

    it("should return false for wrong password", async function () {
      const hashed = await authHelper.hashPassword("password123");
      const isMatch = await authHelper.compareHashedPassword(
        "password321",
        hashed
      );
      expect(isMatch).to.be.false;
    });
  });

  describe("getJWT()", function () {
    it("should return a valid JWT with the correct payload", function () {
      const token = authHelper.getJWT("123");
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "Team_Loftly!"
      );
      expect(decoded).to.have.property("id", "123");
    });
  });

  describe("requireAuth()", function () {
    let req, res, next;

    beforeEach(() => {
      req = mockReq({ headers: {} });
      res = mockRes();
      next = sinon.stub();
    });

    it("should call next() if token is valid", function () {
      const token = authHelper.getJWT("abc123");
      req.headers.authorization = `Bearer ${token}`;

      authHelper.requireAuth(req, res, next);

      expect(req.userId).to.equal("abc123");
      expect(next.calledOnce).to.be.true;
    });

    it("should return 401 if no token is provided", function () {
      authHelper.requireAuth(req, res, next);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it("should return 401 for invalid token", function () {
      req.headers.authorization = "Bearer invalidtoken";

      authHelper.requireAuth(req, res, next);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });
});
