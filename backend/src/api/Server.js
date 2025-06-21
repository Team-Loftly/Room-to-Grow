import express from "express";
import cors from "cors";
import Log from "../util/Log.js";
import path from "path";
import StatusCodes from "http-status-codes";

export default class Server {
  constructor(port) {
    Log.info(`Server::<init>( ${port} )`);
    this.port = port;
    this.express = express();

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
    this.express.get("/metrics", (req, res) => {
      res.status(StatusCodes.OK).json({ result: {
        hoursSpent: {
          "This Week": 10,
          "Last Week": 5,
          Total: 20,
        },
        tasksCompleted: {
          "This Week": 20,
          "Last Week": 10,
          Total: 50,
        },
      
        categoryHours: {
          Coded: 4,
          Read: 6,
          Exercised: 2,
          "Played Piano": 10,
        },
      } });
    });
  }

  registerStaticFiles() {
    const publicPath = path.resolve(process.cwd(), "public");
    this.express.use(express.static(publicPath));
    Log.info("Server::registerStaticFiles() - public path set");
  }
}
