module.exports = {
  apps: [
    {
      name: "client-dev",
      script: "yarn",
      args: "start",
      cwd: "/home/ubuntu/client-panel-dev",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
        PORT: 3001,
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
