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
//TODO
const createProviderFirstRun = async(zones) => {
 
  console.log("1",zones)
  
  providers.providers.map(async(provider) => {
    await strapi.query("providers")
    .create({
      name: provider.name,
      vendor_reference: provider.vendor_reference,
    })
  })
}
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

// Création des zones en allant chercher le fichier data/reception_zone.json 
const createDataFirstRun = async() => {
  const zonesJSON = require("fs").readFileSync(
    "./data/reception_zone.json",
    "utf8"
  );
  const zones = JSON.parse(zonesJSON);
  
  const providersJSON =  require("fs").readFileSync("./data/FHProvider.json", "utf8");
  const providers = JSON.parse(providersJSON);

  zones.zones.map(async (zone) => {
    await strapi.query("reception-zone").create({
      name: zone.name,
      adresse: zone.adresse,
      entity: zone.entity,
      start: zone.start,
      end: zone.end,
      identification: zone.identification,
    }).then(zone => {providers.providers.map(provider => { 
      switch ("Magasin") {
        case "x":
          console.log("ZONE 1")
          break;
      
        default:
          console.log("default")
          break;
    }})});
  });
}


module.exports = async () => {
  const firstRun = await isFirstRun();
  if (firstRun) {
    await setDefaultPermissions();    
    await createDataFirstRun();
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
