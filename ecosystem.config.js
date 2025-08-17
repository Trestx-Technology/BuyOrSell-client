module.exports = {
  apps: [
    {
      name: "buy-or-sell-client",
      script: "yarn",
      args: "start",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 3001,
      },
    },
  ],
};
