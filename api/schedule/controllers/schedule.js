"use strict";
const { sanitizeEntity } = require("strapi-utils");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  isExist: async (ctx) => {
    const body = ctx.request.body;
    // console.log({ body });
    // const { product_order } = body.product_order;
    const { product_order } = body;

    const isExist = await strapi
      .query("schedule")
      .find({ product_order: product_order });
    // console.log({ isExist });

    if (isExist.length !== 0) {
      await strapi.query("schedule").delete({ product_order: product_order });
    }
    await strapi.services.schedule.create(body);
    console.log(ctx.status);
    return ctx.status;
  },
  findByReceptionZone: async (ctx) => {
    const id = ctx.params.id_reception;

    const schedulesByZone = await strapi.query("schedule").find();
    console.log(schedulesByZone);
  },
};
