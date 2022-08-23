import express from "express";
import { getAllPackages } from "./utils/traverse";

export default () => {
  console.log("Starting server...");
  const app = express();

  app.get("/api/graph", (_, res) => {
    if (process.argv.length < 2) {
      res.status(403).send("bad input");
    }
    const path = process.argv[2];
    console.log();
    const allPackages = getAllPackages(path);
    res.json(allPackages);
  });

  app.get("/heartbeat", (req, res) => {
    res.send("I am alive");
  });

  app.listen(3000);
};
