import express, { Request, Response, NextFunction, Application } from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as debug from 'debug';
import * as http from 'http';
import setupRoutes from './routes/api';
import 'colors';

interface AppError extends Error {
  status?: number;
}

const app: Application = express();
const server = http.createServer(app);
const port = normalizePort(process.env.PORT || '3000');

console.log('Server started on port', port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cookieParser());

setupRoutes(app);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  const err: AppError = new Error(`Not Found: ${req.url}`);
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err: AppError, req: Request, res: Response, next: NextFunction) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {},
    id: 'error handler'
  });
});

app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string): number | string | false {
  const portNum = parseInt(val, 10);

  if (isNaN(portNum)) {
    // named pipe
    return val;
  }

  if (portNum >= 0) {
    // port number
    return portNum;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + (addr?.port || 'unknown');

  const debugLog = debug('server:server');
  debugLog('Listening on ' + bind);
}

export default app;