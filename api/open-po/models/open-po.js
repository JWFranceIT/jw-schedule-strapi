"use strict";
const ramda = require("ramda");
const moment = require("moment");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */
const findProviders = async () => {
  // Get vendors existing in DB
  const providersExisting = await strapi
    .query("providers")
    .find({ _limit: -1 });
  return providersExisting;
};

module.exports = {
  lifecycles: {
    async afterCreate(data) {
      const providersExisting = await findProviders();
      // Get data from JSON file stored in data file
      const openPOsJSON = require("fs").readFileSync(
        `./public${data.po.url}`,
        "utf8"
      );
      const openPOs = JSON.parse(openPOsJSON);
      console.log("👽CLG - openPOs", openPOs.pos.length);

      // Get POS existing in DB
      const posExisting = await strapi
        .query("product-orders")
        .find({ _limit: -1 });

      
        posExisting.map(
          (po) => (
            
            console.log({po})
          )
        )
      
      // Using ramda to compare pos existing and new po of list
      const poToSave = ramda.difference(
        openPOs.pos.map((po) => ({ po_no: po.po_no, entity: po.entity })),
        posExisting.map((po) => ({ po_no: po.number, entity: po.entity }))
      );

      // Save the POS
      poToSave.map(async (entry) => {
        // Get the po to save of list
        const currentPO = openPOs.pos.filter(
          (po) => po.po_no === entry.po_no && po.entity === entry.entity
        );

        // Save each po
        currentPO.map(async (po) => {
          // Get the provider save in DB to affect his id to po
          const currentProvider = providersExisting.filter(
            (provider) => provider.vendor_reference === po.vendor_code
          );

          // Using strapi query to create po
          await strapi.query("product-orders").create({
            number: po.po_no,
            Promise_Date: moment(
              po.promise_date + "06:00:00",
              "DD-MM-YY HH:mm:ss"
            ).toDate(),
            entity: po.entity,
            provider: currentProvider[0].id,
          });
        });
      });

      // Using ramda to get unique vendor name and code
      const providerIsUnique = ramda.uniq(
        openPOs.pos.map((x) => ({
          name: x.name.toUpperCase().trim(),
          vendor_reference: x.vendor_code.trim(),
        }))
      );

      // Using ramda to compare vendor existing and new vendor of po list
      const providersToSave = ramda.difference(
        providerIsUnique,
        providersExisting?.map((x) => ({
          name: x.name.toUpperCase().trim(),
          vendor_reference: x.vendor_reference.trim(),
        }))
      );

      // Save the vendors
      providersToSave.map(async (entry) => {
        // Use strapi query to create provider
        await strapi
          .query("providers")
          .create({
            name: entry.name,
            vendor_reference: entry.vendor_reference,
          })
          // After create provider, creation of associate pos
          .then((provider) => {
            const currentPO = openPOs.pos.filter(
              (entry) => provider.name === entry.name.toUpperCase().trim()
            );

            currentPO.forEach(async (entry) => {
              await strapi.query("product-orders").create({
                number: entry.po_no,
                Promise_Date: moment(
                  entry.promise_date + "06:00:00",
                  "DD-MM-YY HH:mm:ss"
                ).toDate(),
                entity: entry.entity,
                provider: provider.id,
              });
            });
          });
      });
      await strapi.query("open-po").delete({ id: data.id });
      const file = await strapi.plugins["upload"].services.upload.fetch({
        id: data.po.id,
      });
      await strapi.plugins["upload"].services.upload.remove(file);
    },
  },
};
