const app = require('../app');

// Export a standard Node handler so Vercel can invoke the Express app.
module.exports = (req, res) => {
  return app(req, res);
};
