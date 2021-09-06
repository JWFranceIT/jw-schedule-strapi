"use strict";

// Configuration of graphql
module.exports = {
  // use to definie amountLimit to 2500 return also 100
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
