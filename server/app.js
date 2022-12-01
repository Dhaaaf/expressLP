const express = require('express');
const app = express();

require('express-async-errors');
app.use(express.json());
app.use('/static', express.static('assets'))
require('dotenv').config();

const dogRouter = require('./routes/dogs')
app.use('/dogs', dogRouter)



app.use("/", (req, res, next) => {
  console.log(req.method)
  console.log(req.url)
  res.on('finish', () => {
    // read and log the status code of the response
    console.log(res.statusCode)
  });
  next()
})

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});


// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

app.use((req, res, next) => {
  let err = new Error("Sorry, the requested resource couldn't be found")
  err.statusCode = 404
  next(err)
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong"
  const stack = err.stack
  res.status(statusCode)
  if (process.env.NODE_ENV === "production") {
    res.json({
      message,
      statusCode,
      stack,
    })
  } else {
    res.json({
      message,
      statusCode,
    })
  }
})

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
