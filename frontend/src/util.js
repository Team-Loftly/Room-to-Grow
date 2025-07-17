// front end utility functions can go here
import { jwtDecode } from "jwt-decode";

// check if the given JWT token is expired
export function isTokenExpired(token) {
  try {
    const { exp } = jwtDecode(token);
    // date.now gives milliseconds but the exp date is in seconds
    return Date.now() >= exp * 1000;
  } catch (err) {
    console.log(err);
    return true; // Treat as expired if invalid
  }
}
