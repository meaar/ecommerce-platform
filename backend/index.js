const { createApp } = require('./src/app');
const { env } = require('./src/config/env');

createApp()
  .then((app) => {
    app.listen(env.port, () => {
      console.log(`API running at http://localhost:${env.port}`);
    });
  })
  .catch((error) => {
    console.error('Unable to start API:', error);
    process.exitCode = 1;
  });