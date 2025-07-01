import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "Team_Loftly!"; // secret key

// must be proper email format
const validateEmail = function (email) {
  // from: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/email#validation
  // this regex covers the same validation done by the <input> tag when the input type is email
  const emailRegex =
    /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i;

  if (!email) {
    return false;
  }
  return emailRegex.test(email);
};

// length cannot be 0
// TODO: Add more password validation?
const validatePassword = function (password) {
  return password?.length > 0;
};

// hashes password and returns it
const hashPassword = async function (password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// compares hashed password with un-hashed version
const compareHashedPassword = async function (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
};

// returns a JWT lasting for 1 hour
const getJWT = function (id) {
  return jwt.sign(
    { id },
    JWT_SECRET,
    /*{expiresIn: '30s'}*/ { expiresIn: "1h" }
  );
};

// checks if the request has a valid auth token
const requireAuth = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET); // {id, exp, iat} // iat = issued at timestamp
    // set the user id from the token
    req.userId = payload.id;
    // proceed with call
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export {
  validateEmail,
  validatePassword,
  hashPassword,
  compareHashedPassword,
  getJWT,
  requireAuth,
};
