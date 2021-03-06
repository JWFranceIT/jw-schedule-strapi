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

    const currentProvider = wareHouseUserMatch
      ? await strapi.query("providers").findOne({ name: wareHouseUserMatch[3] })
      : await strapi.query("providers").findOne({ name: provider });

    const currentZone =
      !wareHouseUserMatch || wareHouseUserMatch.length === 0
        ? currentProvider.reception_zones.find(
            (zone) => zone.entity === productOrder?.entity
          )
        : await strapi.query("reception-zone").findOne({
            identification: wareHouseUserMatch[2],
            entity: wareHouseUserMatch[1],
          });

    const isExist = await strapi
      .query("schedule")
      .findOne({ product_order: product_order });

    const regex = new RegExp("^(..)(\\d)(EXW+)([0-9]+)", "g");

    try {
      if (regex.test(provider) && currentZone) {
        ctx.send({
          provider: provider,
          id: currentProvider.id,
          product_order: product_order,
          statusCode: 200,
          reception_zone: currentZone.id,
          promise_date: new Date(),
          time: wareHouseUserMatch[4],
          adresse: currentZone.adresse,
          name: currentZone.name,
          JW: true,
          isExist,
        });
      }
      if (productOrder?.provider.name === provider && currentZone) {
        ctx.send({
          provider: productOrder.provider.name,
          id: productOrder.provider.id,
          time:
            productOrder.entity === "FH"
              ? productOrder.provider.time
              : productOrder.provider.time2,
          product_order: product_order,
          promise_date: productOrder.Promise_Date,
          reception_zone: currentZone.id,
          adresse: currentZone.adresse,
          name: currentZone.name,
          statusCode: 200,
          JW: false,
          isExist,
        });
      }

      if (
        productOrder !== null &&
        productOrder?.provider.name !== provider &&
        currentZone
      ) {
        throw "errorCredentials";
      }
      if (currentZone === undefined && productOrder !== null) {
        throw "zoneUndefined";
      }
      if (
        regex.test(provider) === false &&
        currentZone === undefined &&
        productOrder === null
      ) {
        throw "errorCredentials";
      }
    } catch (error) {
      ctx.badRequest(error.toString());
    }
  },
};
