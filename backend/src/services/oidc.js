const { Issuer } = require('openid-client');

module.exports = async function getClient() {
  // Découverte automatique de Keycloak
  const issuer = await Issuer.discover("http://keycloak:8080/realms/master");
  const client = new issuer.Client({
    client_id: "demo-client",
    client_secret: "secret",
    redirect_uris: ["http://localhost:4000/api/auth/oidc/callback"],
    response_types: ["code"]
  });
  return client;
}
