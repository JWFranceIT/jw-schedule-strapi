"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  login: async (ctx) => {
    const { provider, product_order } = ctx.request.body;
    const wareHouseUserMatch = provider.match(/^(..)(\d)(EXW+)([0-9]+)/);

    const productOrder = await strapi
      .query("product-orders")
      .findOne({ number: product_order });
    console.log({ productOrder });
    const currentProvider = wareHouseUserMatch
      ? await strapi.query("providers").findOne({ name: wareHouseUserMatch[3] })
      : await strapi.query("providers").findOne({ name: provider });
    console.log({ currentProvider });
    const currentZone = !wareHouseUserMatch
      ? currentProvider.reception_zones.find(
          (zone) => zone.entity === productOrder.entity
        )
      : await strapi.query("reception-zone").findOne({
          name: wareHouseUserMatch[2],
          entity: wareHouseUserMatch[1],
        });

    const isExist = await strapi
      .query("schedule")
      .findOne({ product_order: product_order });

    const regex = new RegExp("^(..)(\\d)(EXW+)([0-9]+)", "g");

    regex.test(provider) && currentZone
      ? ctx.send({
          provider: provider,
          id: currentProvider.id,
          product_order: product_order,
          statusCode: 200,
          reception_zone: currentZone.id,
          promise_date: new Date(),
          time: wareHouseUserMatch[4],
          adresse: currentZone.adresse,
          JW: true,
          isExist,
        })
      : productOrder?.provider.name === provider
      ? ctx.send({
          provider: productOrder.provider.name,
          id: productOrder.provider.id,
          time: productOrder.provider.time,
          product_order: product_order,
          promise_date: productOrder.Promise_Date,
          reception_zone: currentZone.id,
          adresse: currentZone.adresse,
          statusCode: 200,
          JW: false,
          isExist,
        })
      : ctx.badRequest("Error credentials");
  },
};
