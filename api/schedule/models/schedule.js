"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    // Called before an entry is created
    beforeCreate(data) {
      console.log("👽CLG - data", data)
      data.start = new Date(data.start);
      data.end = new Date(data.end);
      data.promise_date = new Date(data.promise_date);
    },
  },
};
