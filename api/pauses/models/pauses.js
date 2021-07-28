"use strict";
const { RRule } = require("rrule");
const moment = require("moment");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    // Called after an entry is created
    async afterCreate(data) {
      moment.locale("fr");

      const dtStart =
        data.DateStart !== null ? new Date(data.DateStart) : new Date();
      console.log(dtStart);
      const rule = new RRule({
        freq: RRule.DAILY,
        byweekday: [
          data.Monday ? RRule.MO : "",
          data.Tuesday ? RRule.TU : "",
          data.Wednesday ? RRule.WE : "",
          data.Thursday ? RRule.TH : "",
          data.Friday ? RRule.FR : "",
        ],
        byhour: [moment.parseZone(data.heure, "HH").utc().hours()],
        byminute: [data.minute],
        bysecond: [0],
        count: [50],
        dtstart: dtStart,
      });

      const pauseProvider = await strapi
        .query("providers")
        .findOne({ name: "JW PAUSE" });
      data.reception_zones.forEach((zone) =>
        rule.all().map(async (entry) => {
          await strapi.query("schedule").create({
            provider: pauseProvider.id,
            product_order: "JW PAUSE",
            reception_zone: zone.id,
            start: moment.utc(entry).toDate(),
            end: moment.utc(entry).add(data.duration, "minutes").toDate(),
            promise_date: moment.utc().toDate(),
          });
        })
      );
    },
  },
};
