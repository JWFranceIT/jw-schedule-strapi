// import PropTypes from "prop-types";
// import React from "react";
// import Week from "react-big-calendar/lib/Week";
// import moment from "moment-business-days";
// import TimeGrid from "react-big-calendar/lib/TimeGrid";

// function workWeekRange(date) {
//   const daysOfWeek = [];
//   var firstOfWeek = moment(date).startOf("day").toDate();
//   for (let i = 0; i <= 4; i++) {
//     const newDay = moment(firstOfWeek).businessAdd(i, "days").toDate();
//     daysOfWeek.push(newDay);
//   }
//   return daysOfWeek;
// }

// class MyWorkWeek extends React.Component {
//   render() {
//     let { date, ...props } = this.props;
//     let range = workWeekRange(date, this.props);

//     return (
//       <TimeGrid
//         {...props}
//         range={range}
//         eventOffset={15}
//         allDaySlot={false}
//         slotEventOverlap={false}
//       />
//     );
//   }
// }

// MyWorkWeek.propTypes = {
//   date: PropTypes.instanceOf(Date).isRequired,
// };

// MyWorkWeek.defaultProps = TimeGrid.defaultProps;

// MyWorkWeek.range = workWeekRange;

// MyWorkWeek.navigate = Week.navigate;

// MyWorkWeek.title = (date, { localizer }) => {
//   let [start, ...rest] = workWeekRange(date, { localizer });

//   return `Your promise date is ${moment(start).format("DD/MM/YY")}`;
// };

// export default MyWorkWeek;
