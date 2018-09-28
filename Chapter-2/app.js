const express = require('express');

const app = express();
// express.static generates a middleware function which responds to
// a request by trying to match the request URL with a file under a
// directory specified by the parameter to the generator function.
// If a file exists, it returns the contents of the file as the response; 
// if not, it chains to the next middleware function. 
// The middleware is mounted on the application using the application’s use() method.
app.use(express.static('static'));

app.listen(3000, function() {
  console.log('App started on port 3000');
});
