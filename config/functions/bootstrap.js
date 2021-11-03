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
/**
 *
 * @param {STRING} name
 * Pass string of name to create a provider
 */
const isExist = async (name) => {
  const alreadyExist = await strapi.query("providers").findOne({ name });
  if (!alreadyExist) {
    await strapi.query("providers").create({
      name: name,
      vendor_reference: name,
      time: 30,
    });
  }
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

module.exports = async () => {
  const firstRun = await isFirstRun();
  if (firstRun) {
    await setDefaultPermissions();
  }
  // Récupérer les fichiers JSON
  const zonesJSON = require("fs").readFileSync(
    "./data/reception_zone.json",
    "utf8"
  );
  const providersJSON = require("fs").readFileSync(
    "./data/FHProvider.json",
    "utf8"
  );
  // Parse JSON
  const zonesToCreate = JSON.parse(zonesJSON);
  const providersToSave = JSON.parse(providersJSON);

  //Vérifier si des zones existent en DB
  const receptionZonesExisting = await strapi
    .query("reception-zone")
    .find({ _limit: -1 });
  // Comparateur pour fonction ramda differenceWith
  const cmp = (x, y) => x.name.toUpperCase().trim() === y.name.toUpperCase().trim();
  const cmp2 = (x, y) => x.vendor_reference === y.vendor_reference;
  //Compare le fichier JSON parsé aux données en DB et renvoie les zones manquantes en DB
  const diff = ramda.differenceWith(
    cmp,
    zonesToCreate.zones,
    receptionZonesExisting
  );
  // Condition pour créer les zones manquantes
  if (diff.length !== 0) {
    diff.forEach((zone) => {
      strapi.query("reception-zone").create({
        name: zone.name,
        entity: zone.entity,
        adresse: zone.adresse,
        start: zone.start,
        end: zone.end,
        identification: zone.identification,
      });
    });
  }
  //Récupérer les providers en DB
  const providers = await strapi.query("providers").find({ _limit: -1 });

  // const test = ramda.difference(providers.map(x => ({name: x.name, vendor_reference: x.vendor_reference })), providersToSave.providers.map(x => ({name: x.name, vendor_reference: x.vendor_reference })) )

  //Compare le fichier JSON parsé aux données en DB et renvoie les providers manquants en DB
  const diffProviders = ramda.differenceWith(
    cmp2,
    providersToSave.providers,
    providers
  );
  console.log({ diffProviders });
  // Récupération des zones créer précédemment
  const receptionZonesCreated = await strapi
    .query("reception-zone")
    .find({ _limit: -1 });
  // Condition pour créer les providers manquants en DB
  if (diffProviders.length !== 0) {
    diffProviders.forEach((provider) => {
      const reception_zones = [];
      receptionZonesCreated.map((zone) => {
        if (!ramda.isEmpty(provider[zone.name]) && provider[zone.name]) {
          reception_zones.push(zone.id);
        }
      });
      strapi.query("providers").create({
        name: provider.name.toUpperCase().trim(),
        vendor_reference: provider.vendor_reference,
        time: provider.time,
        time2: provider.time2,
        reception_zones,
      });
    });
  }
  //Create JW PAUSE user
  isExist("JW PAUSE");
  //Create EXW user
  isExist("EXW");
  //Create CARISTE user
  isExist("CARISTE");
};
