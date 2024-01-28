import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'https://localhost:8080',
  realm: 'Test',
  clientId: 'test',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;