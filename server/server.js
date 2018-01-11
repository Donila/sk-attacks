if (process.env.NODE_ENV === "production")
    require("newrelic");

const PORT = process.env.PORT || 3333;

import os from "os";
import express from "express";
import http from "http";
import RoutesConfig from "./config/routes.conf";
import DBConfig from "./config/db.conf";
import Routes from "./routes/index";
import DiscordBot from "./bot/discordBot";

const app = express();

RoutesConfig.init(app);
DBConfig.init();
Routes.init(app, express.Router());
DiscordBot.init();

http.createServer(app)
    .listen(PORT, () => {
      console.log(`up and running @: ${os.hostname()} on port: ${PORT}`);
      console.log(`enviroment: ${process.env.NODE_ENV}`);
    });
