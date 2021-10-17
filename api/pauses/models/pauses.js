"use strict";
const { RRule } = require("rrule");
const moment = require("moment");
const { tryCatch } = require("ramda");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    // Called after an entry is created
    async beforeCreate(data) {
      const dtStart = data.DateStart ? new Date(data.DateStart) : new Date();
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
      if (!pauseProvider) {
        throw new Error("Provider  JW PAUSE not exist");
      }
      if (data.reception_zones.length === 0) {
        throw new Error("Reception zone not defined");
      }
      data.reception_zones.forEach((zone) => {
        rule.all().map(async (entry) => {
          console.log({entry})
          await strapi.query("schedule").create({
            provider: pauseProvider.id,
            product_order: "JW PAUSE",
            reception_zone: zone,
            start: moment(entry).isDST() ? moment.utc(entry).toDate() : moment.utc(entry).add(1, "hours").toDate(),
            end: moment(entry).isDST() ? moment.utc(entry).add(data.duration, "minutes").toDate() : moment.utc(entry).add(1, "hour").add(data.duration, "minutes").toDate(),
            promise_date: moment.utc().toDate(),
          });
        });
      });
    },
  },
};
