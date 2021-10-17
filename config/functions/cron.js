"use strict";
const ramda = require("ramda");
const moment = require("moment");
/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#cron-tasks
 */

// TODO optimize the repetion
module.exports = {
  // Execute the task every 59 minutes

  // "*/59 * * * *": {
  //   task: async () => {
  //     // Get data from JSON file stored in data file
  //     const json = require("fs").readFileSync("./data/openPOs.json", "utf8");
  //     const data = JSON.parse(json);

  //     // Using ramda to get unique vendor name and code
  //     const providerIsUnique = ramda.uniq(
  //       data.pos.map((x) => ({
  //         name: x.name.toUpperCase().trim(),
  //         vendor_reference: x.vendor_code.trim(),
  //       }))
  //     );

  //     // Get vendors existing in DB
  //     const providersExisting = await strapi
  //       .query("providers")
  //       .find({ _limit: -1 });

  //     // Using ramda to compare vendor existing and new vendor of po list
  //     const providersToSave = ramda.difference(
  //       providerIsUnique,
  //       providersExisting.map((x) => ({
  //         name: x.name.toUpperCase().trim(),
  //         vendor_reference: x.vendor_reference.trim(),
  //       }))
  //     );

  //     // Save the vendors
  //     providersToSave.map(async (entry) => {
  //       // Use strapi query to create provider
  //       await strapi
  //         .query("providers")
  //         .create({
  //           name: entry.name,
  //           vendor_reference: entry.vendor_reference,
  //         })
  //         // After create provider, creation of associate pos
  //         .then((provider) => {
  //           const currentPO = data.pos.filter(
  //             (entry) => provider.name === entry.name.toUpperCase().trim()
  //           );

  //           currentPO.forEach(async (entry) => {
  //             await strapi.query("product-orders").create({
  //               number: entry.po_no,
  //               Promise_Date: moment(
  //                 entry.promise_date + "06:00:00",
  //                 "DD-MM-YY HH:mm:ss"
  //               ).toDate(),
  //               entity: entry.entity,
  //               provider: provider.id,
  //             });
  //           });
  //         });
  //     });

  //     // Get POS existing in DB
  //     const posExisting = await strapi
  //       .query("product-orders")
  //       .find({ _limit: -1 });

  //     // Using ramda to compare pos existing and new po of list
  //     const poToSave = ramda.difference(
  //       data.pos.map((po) => ({ po_no: po.po_no, entity: po.entity })),
  //       posExisting.map((po) => ({ po_no: po.number, entity: po.entity }))
  //     );

  //     // Save the POS
  //     poToSave.map(async (entry) => {
  //       // Get the po to save of list
  //       const currentPO = data.pos.filter(
  //         (po) => po.po_no === entry.po_no && po.entity === entry.entity
  //       );

  //       // Save each po
  //       currentPO.map(async (po) => {
  //         // Get the provider save in DB to affect his id to po
  //         const currentProvider = providersExisting.filter(
  //           (provider) => (
  //             provider.name === po.name.toUpperCase().trim(),
  //             provider.vendor_reference === po.vendor_code
  //           )
  //         );
  //         // Using strapi query to create po
  //         await strapi.query("product-orders").create({
  //           number: po.po_no,
  //           Promise_Date: moment(
  //             po.promise_date + "06:00:00",
  //             "DD-MM-YY HH:mm:ss"
  //           ).toDate(),
  //           entity: po.entity,
  //           provider: currentProvider[0].id,
  //         });
  //       });
  //     });
  //   },
  //   options: {
  //     tz: "Europe/Paris",
  //   },
  // },
};
