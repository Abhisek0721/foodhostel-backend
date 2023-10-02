var unirest = require("unirest");

var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

req.headers({
  "authorization": "xacDgEbOnrYAvTC9IyB5Q3J2tVH1kuMemqZ7RXK4p0NUif8lGh6qXYzkoKjFv8DRO5rtZfmSC91nspTl"
});

req.form({
  "message": "This is a test message",
  "language": "english",
  "route": "q",
  "numbers": "6901168653",
});

req.end(function (res) {
  if (res.error) throw new Error(res.error);

  console.log(res.body);
});