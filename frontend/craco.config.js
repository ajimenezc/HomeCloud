// craco.config.js
module.exports = {
    devServer: (devServerConfig) => {
      devServerConfig.host = '0.0.0.0';
      devServerConfig.allowedHosts = 'all'; // Allow all hosts
      return devServerConfig;
    },
  };
  