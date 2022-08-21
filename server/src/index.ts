import startServer from "./server";
import open from "open";
startServer();
open("http://localhost:3000/heartbeat");
