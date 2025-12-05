const router = require('express').Router();
const getClient = require('../services/oidc');

router.get("/login", async (req, res) => {
  const client = await getClient();
  const url = client.authorizationUrl({
    scope: "openid profile email"
  });
  res.redirect(url); // redirige vers Keycloak
});

router.get("/callback", async (req, res) => {
  const client = await getClient();
  const tokenSet = await client.callback(
    "http://localhost:4000/api/auth/oidc/callback",
    req.query
  );
  // Stocker tokenSet.id_token en session ou cookie
  req.session.id_token = tokenSet.id_token;
  res.redirect("http://localhost:3000/documents"); // renvoie vers ton frontend
});

module.exports = router;
