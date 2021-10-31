"use strict";
const ramda = require("ramda");
const moment = require("moment");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

// Function to find all providers
const findProviders = async () => {
  // Get vendors existing in DB
  const providersExisting = await strapi
    .query("providers")
    .find({ _limit: -1 });
  return providersExisting;
};


/**
 * Function to update the PO in DB
 * @params {array} openPos - Array of open pos
 * @params {array} posExisting - Array of existing pos in DB
 * @params {array} providersExisting - Array of existing providers in DB
 */
const poToUpdate = (openPOs, posExisting, providersExisting) => {
  const poToUpdate = ramda.difference(
    openPOs.pos.map((po) => ({
      po_no: po.po_no,
      entity: po.entity,
      vendor_code: po.vendor_code,
      promise_date: moment(po.promise_date, "DD-MM-YY").format("DD-MM-YY"),
    })),
    posExisting.map((po) => ({
      po_no: po.number,
      entity: po.entity,
      vendor_code: po.provider.vendor_reference,
      promise_date: moment(po.Promise_Date).format("DD-MM-YY"),
    }))
  );

  poToUpdate.map(async (entry) => {
    const currentProvider = providersExisting.filter(
      (provider) => provider.vendor_reference === entry.vendor_code
    );
    const currentPO = posExisting.filter(
      (po) => po.number === entry.po_no && po.entity === entry.entity
    );
    await strapi.query("product-orders").update(
      { id: currentPO[0].id },
      {
        Promise_Date: moment(
          entry.promise_date + "06:00:00",
          "DD-MM-YY HH:mm:ss"
        ).toDate(),
        provider: currentProvider[0].id,
      }
    );
  });
};

/**
 * Function to save the new PO in DB
 * @params {array} openPos - Array of open pos
 * @params {array} posExisting - Array of existing pos in DB
 */
const poToSave = (openPOs, posExisting) => {
  // Using ramda to compare pos existing and new po of list
  const poToSave = ramda.difference(
    openPOs.pos.map((po) => ({ po_no: po.po_no, entity: po.entity })),
    posExisting.map((po) => ({ po_no: po.number, entity: po.entity }))
  );

  // Save the new POS
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
};


/**
 * Function to save vendor who aren't in DB then save associate PO
 * @params {array} openPos - Array of open pos
 * @params {array} providersExisting - Array of existing providers in DB
 */
const providerToSaveBeforePos = (openPOs, providersExisting) => {
  // Using ramda to get unique vendor name and code
  const providerIsUnique = ramda.uniq(
    openPOs.pos.map((x) => ({
      name: x.name.trim(),
      vendor_reference: x.vendor_code.trim(),
    }))
  );

  // Using ramda to compare vendor existing and new vendor of po list
  const providersToSave = ramda.difference(
    providerIsUnique,
    providersExisting?.map((x) => ({
      name: x.name.trim(),
      vendor_reference: x.vendor_reference.trim(),
    }))
  );

  // Save the vendors
  providersToSave.map(async (entry) => {
    // Use strapi query to create provider
    await strapi
      .query("providers")
      .create({
        name: entry.name.toUpperCase().trim(),
        vendor_reference: entry.vendor_reference,
      })
      // After create provider, creation of associate pos
      .then((provider) => {
        const currentPO = openPOs.pos.filter(
          (entry) => provider.vendor_reference === entry.vendor_code.trim()
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

      // Get POS existing in DB
      const posExisting = await strapi
        .query("product-orders")
        .find({ _limit: -1 });

      providerToSaveBeforePos(openPOs, providersExisting);
      poToSave(openPOs, posExisting);
      poToUpdate(openPOs, posExisting, providersExisting);

      // Use to delete the file of open pos
      await strapi.query("open-po").delete({ id: data.id });
      const file = await strapi.plugins["upload"].services.upload.fetch({
        id: data.po.id,
      });
      await strapi.plugins["upload"].services.upload.remove(file);
    },
  },
};
