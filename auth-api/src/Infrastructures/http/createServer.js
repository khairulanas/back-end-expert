const Hapi = require('@hapi/hapi');
const users = require('../../Interfaces/http/api/users');

const createServer = async (injections) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  await server.register([
    {
      plugin: users,
      options: { injections },
    },
  ]);

  return server;
};

module.exports = createServer;
