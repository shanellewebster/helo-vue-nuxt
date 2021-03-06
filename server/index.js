const express = require("express");
const consola = require("consola");
const { Nuxt, Builder } = require("nuxt");
const app = express();

var bodyParser = require("body-parser");
const massive = require("massive");
require("dotenv").config();
const mc = require("./controller");

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;

app.set("port", port);

// Import and Set Nuxt.js options
let config = require("../nuxt.config.js");
config.dev = !(process.env.NODE_ENV === "production");

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  app.use(bodyParser.json());
  massive(process.env.CONNECTION_STRING).then(dbInstance =>
    app.set("db", dbInstance)
  );

  app.post("/api/post", mc.addPost);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}
start();
