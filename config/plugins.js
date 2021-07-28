"use strict";

// Configuration of graphql
module.exports = {
  //
  graphql: {
    endpoint: "/graphql",
    shadowCRUD: true,
    playgroundAlways: false,
    depthLimit: 7,
    amountLimit: 2500,
    apolloServer: {
      tracing: false,
    },
  },
};
