require("dotenv").config();
const app = require("./server/app");
const { sleep } = require("./server/lib/utils");

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort("6700");
app.set("port", port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

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
 * Event listener for HTTP server 'error' event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

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
 * Event listener for HTTP server 'listening' event.
 */

function onListening() {
  const addr = server.address();
  const bind =
    typeof addr === "string" ? "pipe " + addr : "http://localhost:" + addr.port;
  console.info("Listening on " + bind);
}

const server = app.listen(port);

// process.on("SIGINT", () => {
//   console.info("SIGINT signal received.");
//   server.close(async function (err) {
//     process.exit(0);
//   });
// });
//
// process.on("exit", function () {
//   console.info("Closing connections...");
//   app.closeDb();
//   console.info("Closed.");
// });

/**
 * Listen on provided port, on all network interfaces.
 */

server.on("error", onError);
server.on("listening", onListening);
