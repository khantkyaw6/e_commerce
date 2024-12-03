require('dotenv').config();
const os = require('os');

const chalk = require('chalk');
const terminalLink = require('terminal-link');

const app = require('./app');
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`Server is running on PORT ${PORT} ...`);
});

//If database is connected,Server is run.
app.listen(PORT, () => {
  const localIpAddress = getLocalIpAddress();
  const serverLink = terminalLink(
    chalk.bold(`Server running on PORT ${PORT} ...`),
    `http://${localIpAddress}:${PORT}`,
  );

  console.log(serverLink);
});

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  let localIpAddress = '';
  Object.keys(interfaces).forEach((iface) => {
    interfaces[iface].forEach((details) => {
      if (details.family === 'IPv4' && !details.internal) {
        localIpAddress = details.address;
      }
    });
  });
  return localIpAddress;
}
