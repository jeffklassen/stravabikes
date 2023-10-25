const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const debug = require("debug")("server:server");
const http = require("http");
const routes = require("./routes/api");
require("colors");

let app = express();

let server = http.createServer(app);
let port = normalizePort(process.env.PORT || "3000");

console.log("Server started on port", port);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(cookieParser());

routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error("Not Found", req.url);
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {},
    id: "second block in app.js",
  });
});

app.set("port", port);

/**
 *
 * Run the server
 */

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

module.exports = app;
