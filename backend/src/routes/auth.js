const router = require('express').Router();
const authService = require('../services/authService');

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // temporaire : Fake user
  if (email === "admin@test.com" && password === "admin") {
    const token = authService.generateToken({ id: 1, roles: ["admin"] });
    return res.json({ token });
  }

  res.status(401).json({ error: "bad credentials" });
});

module.exports = router;
