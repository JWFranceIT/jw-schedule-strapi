module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  //url: env('PUBLIC_URL', 'https://jw-schedule.heroku.app.com/admin'),
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "32bc5c0fdc19190df7a77579ed4bbbee"),
    },
  },
  cron: {
    enabled: true,
  },
});
