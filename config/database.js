//module.exports = ({ env }) => ({
 // defaultConnection: "default",
//  connections: {
  //  default: {
//      connector: "bookshelf",
//      settings: {
//        client: "mysql",
//        host: env("DATABASE_HOST"),
//        port: env("DATABASE_PORT"),
//        database: "scheduler_dock_reception",
 //       username: env("DATABASE_USERNAME"),
  //      password: env("DATABASE_PASSWORD"),
//        filename: env("DATABASE_FILENAME", ".tmp/data.db"),
 //     },
//      options: {
//        useNullAsDefault: true,
//      },
 //   },
//  },
//});

// ATLAS MONGODB CONNECTION
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
