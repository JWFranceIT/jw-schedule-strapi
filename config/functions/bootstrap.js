"use strict";
const ramda = require("ramda");
const moment = require("moment");
/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

const findPublicRole = async () => {
  const result = await strapi
    .query("role", "users-permissions")
    .findOne({ type: "public" });
  return result;
};

const setDefaultPermissions = async () => {
  const role = await findPublicRole();
  const permissions = await strapi
    .query("permission", "users-permissions")
    .find({ type: "application", role: role.id });
  await Promise.all(
    permissions.map((p) =>
      strapi
        .query("permission", "users-permissions")
        .update({ id: p.id }, { enabled: true })
    )
  );
};

const isFirstRun = async () => {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: "type",
    name: "setup",
  });
  const initHasRun = await pluginStore.get({ key: "initHasRun" });
  await pluginStore.set({ key: "initHasRun", value: true });
  return !initHasRun;
};

const findProviders = async () => {
  // Get vendors existing in DB
  const providersExisting = await strapi
    .query("providers")
    .find({ _limit: -1 });
  return providersExisting;
};

module.exports = async () => {
  const firstRun = await isFirstRun();
  if (firstRun) {
    await setDefaultPermissions();
  }
  // Get data from JSON file stored in data file
  const json = require("fs").readFileSync("./data/openPOs.json", "utf8");
  const data = JSON.parse(json);

  const providersExisting = firstRun ? [] : await findProviders();

  // Using ramda to get unique vendor name and code
  const providerIsUnique = ramda.uniq(
    data.pos.map((x) => ({
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
  console.log(providersToSave);
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
        const currentPO = data.pos.filter(
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
  if (!firstRun) {
    // Get POS existing in DB
    const posExisting = await strapi
      .query("product-orders")
      .find({ _limit: -1 });

    // Using ramda to compare pos existing and new po of list
    const poToSave = ramda.difference(
      data.pos.map((po) => ({ po_no: po.po_no, entity: po.entity })),
      posExisting.map((po) => ({ po_no: po.number, entity: po.entity }))
    );

    // Save the POS
    poToSave.map(async (entry) => {
      // Get the po to save of list
      const currentPO = data.pos.filter(
        (po) => po.po_no === entry.po_no && po.entity === entry.entity
      );

      // Save each po
      currentPO.map(async (po) => {
        // Get the provider save in DB to affect his id to po
        const currentProvider = providersExisting.filter(
          (provider) => (
            provider.name === po.name.toUpperCase().trim(),
            provider.vendor_reference === po.vendor_code
          )
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
  }

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
