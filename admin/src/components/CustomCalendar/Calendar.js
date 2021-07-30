// import React, { useMemo, useState, useEffect } from "react";
// import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment-business-days";
// import { useSchedules } from "./hooks";

// import { isEmpty } from "lodash";
// import MyWorkWeek from "./MyWorkWeek";
// import "moment/locale/fr";
// import "react-big-calendar/lib/css/react-big-calendar.css";

// export function Calendar() {
//   const data = useSchedules();
//   console.log({ data });
//   moment.locale("fr");

//   const scheduleByZone = useMemo(() => {
//     if (!data) return [];
//     data.data.schedules.map((x) => {
//       const toto = moment(x.start).set({ hour: 8, minute: 0 }).toDate();
//       const tata = moment(x.end).set({ hour: 17, minute: 29 }).toDate();
//       x.start = x.full_day ? toto : new Date(x.start);
//       x.end = x.full_day ? tata : new Date(x.end);
//       x.title = `${provider} ${x.product_order} ${moment(promise_date).format(
//         "DD/MM/YYYY"
//       )}`;
//     });
//     return data.data.schedules;
//   }, [data]);

//   useEffect(() => {
//     if (isEmpty(scheduleByZone)) setEvents([]);
//     setEvents(
//       scheduleByZone.map((e) => {
//         return {
//           start: e.start,
//           end: e.end,
//           title: e.title,
//         };
//       })
//     );
//   }, [scheduleByZone]);

//   const localizer = momentLocalizer(moment);

//   const ColoredDateCellWrapper = ({ children }) => {
//     return React.cloneElement(React.Children.only(children), {
//       style: {
//         backgroundColor: "#008000",
//       },
//     });
//   };
//   const [events, setEvents] = useState(scheduleByZone);

//   const eventStyleGetter = () => {
//     return {
//       style: {
//         backgroundColor: "#CA2A07",
//       },
//     };
//   };
//   const messages = {
//     previous: "Précédent",
//     next: "Suivant",
//     today: "Aujourd'hui",
//   };
//   //   if (scheduleLoading) return <p>Wait & see</p>;
//   //   if (scheduleError) return <p>{scheduleError}</p>;
//   return (
//     <>
//       <BigCalendar
//         messages={messages}
//         style={{ height: 1000 }}
//         events={events}
//         views={{ myWeek: MyWorkWeek }}
//         defaultView={"myWeek"}
//         defaultDate={new Date()}
//         getNow={() => new Date()}
//         onNavigate={() => new Date()}
//         components={{
//           timeSlotWrapper: ColoredDateCellWrapper,
//         }}
//         localizer={localizer}
//         timeslots={1}
//         eventPropGetter={eventStyleGetter}
//         min={new Date(0, 0, 0, 8, 0, 0)}
//         max={new Date(0, 0, 0, 17, 29, 0)}
//         longPressThreshold={5}
//       />
//     </>
//   );
// }
