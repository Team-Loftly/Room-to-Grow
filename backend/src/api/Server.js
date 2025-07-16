import express from "express";
import cors from "cors";
import Log from "../util/Log.js";
import path from "path";

import metricsRouter from "../routes/metrics.js";
import createAuthRouter from "../routes/auth.js";
import decorRouter from "../routes/decorations.js";
import questsRouter from "../routes/quests.js";
import createRoomRouter from "../routes/rooms.js";
import createDailyQuestSetRouter from "../routes/rooms.js";

import * as AuthHelper from "../util/AuthHelper.js";
import createHabitsRouter from "../routes/Habits.js";

export default class Server {
  // can pass in a stubbed authhelper, requireAuth for testing - otherwise it will use the import above
  constructor(port, { authHelper = AuthHelper } = {}) {
    Log.info(`Server::<init>( ${port} )`);
    this.port = port;
    this.express = express();
    this.authHelper = authHelper;
    this.requireAuth = this.authHelper.requireAuth;
    this.express.use(express.json());
    this.registerMiddleware();
    this.registerRoutes();
    this.registerStaticFiles();
  }

  async start() {
    return new Promise((resolve, reject) => {
      Log.info("Server::start() - start");
      this.server = this.express
        .listen(this.port, () => {
          Log.info(`Server::start() - server listening on port: ${this.port}`);
          resolve();
        })
        .on("error", (err) => {
          // catches errors in server start
          Log.error(`Server::start() - server ERROR: ${err.message}`);
          reject(err);
        });
    });
  }

  registerMiddleware() {
    // enable cors in request headers to allow cross-origin HTTP requests
    this.express.use(cors());
  }

  registerRoutes() {
    this.express.use("/metrics", metricsRouter);
    this.express.use("/auth", createAuthRouter(this.authHelper));
    this.express.use("/decor", decorRouter);
    this.express.use("/quests", questsRouter);
    this.express.use("/habits", createHabitsRouter(this.requireAuth));
    this.express.use("/rooms", createRoomRouter(this.requireAuth));
    this.express.use(
      "/daily-quests",
      createDailyQuestSetRouter(this.requireAuth)
    );
  }

  registerStaticFiles() {
    const publicPath = path.resolve(process.cwd(), "public");
    this.express.use(express.static(publicPath));
    Log.info("Server::registerStaticFiles() - public path set");
  }

  getApp() {
    return this.express;
  }
}
