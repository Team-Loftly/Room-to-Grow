// endpoints for user registration, login, logout(?)
import express from "express";
import StatusCodes from "http-status-codes";
import User from "../models/Users.js";

export default function createAuthRouter(authHelper) {
  const {
    // take in the auth helper fns as parameters so we can mock them for tests
    validateEmail,
    validatePassword,
    hashPassword,
    compareHashedPassword,
    getJWT,
  } = authHelper;

  const router = express.Router();

  router.post("/register", async (req, res) => {
    try {
      // server side input validation
      const { email, password } = req.body;
      if (!validateEmail(email)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid Email" });
      }
      if (!validatePassword(password)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid Password" });
      }
      // check if user already exists
      const user = await User.findOne({ email });
      if (user) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "User already exists" });
      }
      // hash password and register user
      const hashedPassword = await hashPassword(password);
      const newUser = new User({ email, hashedPassword });
      await newUser.save();
      // get a JWT token and return it
      const token = getJWT(newUser._id);
      res.status(StatusCodes.CREATED).json({ token });
    } catch (err) {
      console.log(err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      // validate email/password
      if (!validateEmail(email) || !validatePassword(password)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid email or password" });
      }
      // check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Invalid credentials" });
      }
      // check if user gave the right password
      const isMatch = await compareHashedPassword(
        password,
        user.hashedPassword
      );
      if (!isMatch) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Invalid credentials" });
      }
      // return a jwt token
      const token = getJWT(user._id);
      res.status(StatusCodes.OK).json({ token });
    } catch (err) {
      console.error(err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  });
  return router;
}
