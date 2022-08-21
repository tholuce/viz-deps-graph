import express from "express";

export default () => {
  console.log("Starting server...");
  const app = express();

  app.get("/heartbeat", (req, res) => {
    res.send("I am alive");
  });

  app.listen(3000);
};
