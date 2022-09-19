const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/",verify, (req, res) => {
  //You need to be logged in to access this route
  res.send(req.user)
});

module.exports = router;
