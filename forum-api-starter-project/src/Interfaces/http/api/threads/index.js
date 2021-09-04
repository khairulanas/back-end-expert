const ThreadHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  register: async (server, { injections }) => {
    const threadHandler = new ThreadHandler(injections);
    server.route(routes(threadHandler));
  },
};
