module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "mongoose",
      settings: {
        uri: env("DATABASE_URI"),
      },
      options: {
        ssl: true,
      },
    },
  },
});

// env("MY_SQL_DB")
// ? {
//     defaultConnection: "default",
//     connections: {
//       default: {
//         connector: "bookshelf",
//         settings: {
//           client: "mysql",
//           host: "localhost",
//           port: "3306",
//           database: "scheduler_dock_reception",
//           username: "gmarques",
//           password: "Forever586",
//           filename: env("DATABASE_FILENAME", ".tmp/data.db"),
//         },
//         options: {
//           useNullAsDefault: true,
//         },
//       },
//     },
//   }
// :
