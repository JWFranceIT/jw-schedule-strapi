"use strict";
const excelToJson = require("convert-excel-to-json");
const ramda = require("ramda");
const moment = require("moment");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */
// const findProviders = async () => {
//   // Get vendors existing in DB
//   const providersExisting = await strapi
//     .query("providers")
//     .find({ _limit: -1 });
//   return providersExisting;
// };

module.exports = {
  lifecycles: {
    async afterCreate(data) {
      const getProvider = await strapi
        .query("providers")
        .find({ vendor_reference: "102240" });

      const results = excelToJson({
        sourceFile: `./public${data.rak.url}`,
        columnToKey: {
          B: "number",
          D: "city",
          E: "loadDate",
          F: "promiseDate",
        },
      });
      results.Loads.map(async (result) => {
        const sorted = ramda.pick(
          ["number", "city", "loadDate", "promiseDate"],
          result
        );

        if (sorted.number) {
          const getRak = await strapi
            .query("product-orders")
            .findOne({ number: sorted.number });
          if (getRak === null) {
            if (!("J" in result) && !ramda.isEmpty(sorted)) {
              const promise_date = sorted.promiseDate
                ? moment(sorted.promiseDate, "DD-MM-YY HH:mm:ss")
                    .add(6, "hours")
                    .toDate()
                : moment(sorted.loadDate, "DD-MM-YY HH:mm:ss")
                    .add(7, "days")
                    .add(6, "hours")
                    .toDate();
              strapi.query("product-orders").create({
                number: sorted.number,
                entity: sorted.city === "Eauze" ? "FH" : "FF",
                Promise_Date: promise_date,
                provider: getProvider[0].id,
              });
            }
          }
        }
      });

      await strapi.query("rak-eesti").delete({ id: data.id });
      const file = await strapi.plugins["upload"].services.upload.fetch({
        id: data.rak.id,
      });
      await strapi.plugins["upload"].services.upload.remove(file);
    },
  },
};
