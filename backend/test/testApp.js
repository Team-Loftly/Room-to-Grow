import Server from "../src/api/Server.js";
import sinon from "sinon";

const sandbox = sinon.createSandbox();

// mock test helper fns
const authHelperStub = {
  validateEmail: (email) => email.includes("@"),
  validatePassword: (pw) => pw.length > 0,
  hashPassword: sandbox.stub().resolves("hashed123"),
  compareHashedPassword: sandbox.stub().resolves(true),
  getJWT: sandbox.stub().returns("fake-token"),
};

const server = new Server(0, { authHelper: authHelperStub });
const app = server.getApp();

export { app as default, authHelperStub, sandbox };
