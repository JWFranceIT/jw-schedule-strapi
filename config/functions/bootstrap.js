"use strict";

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

module.exports = async () => {
  // Create user JW PAUSE
  const isJWPAUSEExist = await strapi
    .query("providers")
    .findOne({ name: "JW PAUSE" });
  if (!isJWPAUSEExist) {
    await strapi.query("providers").create({
      name: "JW PAUSE",
      vendor_reference: "JW PAUSE",
      time: 30,
    });
  }
  // Create user EXW
  const isEXWExist = await strapi.query("providers").findOne({ name: "EXW" });
  if (!isEXWExist) {
    await strapi.query("providers").create({
      name: "EXW",
      vendor_reference: "EXW",
      time: 60,
    });
  }
};
