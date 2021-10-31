// "use strict";
// const { RRule } = require("rrule");
// const moment = require("moment");

// /**
//  * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
//  * to customize this model
//  */

// module.exports = {
//   lifecycles: {
//     // Called after an entry is created
//     async beforeCreate(data) {
//       console.log("first", moment(data.horaire,"hh:mm").utc().format("hh"))
//       const dtStart = data.DateStart ? new Date(data.DateStart) : new Date();
//       const rule = new RRule({
//         freq: RRule.DAILY,
//         byweekday: [
//           data.Monday ? RRule.MO : "",
//           data.Tuesday ? RRule.TU : "",
//           data.Wednesday ? RRule.WE : "",
//           data.Thursday ? RRule.TH : "",
//           data.Friday ? RRule.FR : "",
//         ],
//         byhour: [moment(data.horaire, "hh:mm").format("hh")],
//         byminute: [moment(data.horaire, "hh:mm").format("mm")],
//         bysecond: [0],
//         count: [5],
//         dtstart: dtStart,
//       });

//       const pauseProvider = await strapi
//         .query("providers")
//         .findOne({ name: "JW PAUSE" });
//       if (!pauseProvider) {
//         throw new Error("Provider  JW PAUSE not exist");
//       }
//       if (data.reception_zones.length === 0) {
//         throw new Error("Reception zone not defined");
//       }
//       data.reception_zones.forEach((zone) => {
//         rule.all().map(async (entry) => {
//           console.log({ "entry":entry, "start": moment.parseZone(entry).toDate()  });
//           await strapi.query("schedule").create({
//             provider: pauseProvider.id,
//             product_order: "JW PAUSE",
//             reception_zone: zone,
//             start: moment(entry).locale('fr').isDST()
//               ? moment(entry).locale('fr').toDate()
//               : moment(entry).locale('fr').add(1, "hours").toDate(),
//             end: moment(entry).locale('fr').isDST()
//               ? moment(entry).locale('fr').add(data.duration, "minutes").toDate()
//               : moment(entry).locale('fr')
//                   .add(1, "hour")
//                   .add(data.duration, "minutes")
//                   .toDate(),
//             promise_date: moment().locale('fr').utc().toDate(),
//           });
//         });
//       });
//     },
//   },
// };

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
    async beforeCreate(data) {
      console.log({ first: data });
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
        byhour: [moment(data.horaire, "HH").utc().format("HH")],
        byminute: [moment(data.horaire, "hh:mm").utc().format("mm")],
        bysecond: [0],
        count: [data.recurrence],
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
      data.reception_zones.forEach(async (zone) => {
        const currentZone = await strapi
          .query("reception-zone")
          .findOne({ id: zone });
        console.log({ currentZone: currentZone });
        rule.all().map(async (entry) => {
          console.log(moment(entry).isDST());
          await strapi.query("schedule").create({
            provider: pauseProvider.id,
            product_order: data.title,
            reception_zone: zone,
            start: moment(entry).isDST() ? moment(entry).subtract(1, "hour").toDate(): moment(entry).toDate(),
            end: moment(entry).isDST() ? moment(entry).subtract(1,"hour").add(data.duration, "minutes").toDate(): moment(entry).add(data.duration, "minutes").toDate(),
            promise_date: moment().utc().toDate(),
            full_day: data.full_day,
          });
        });
      });
    },
  },
};
