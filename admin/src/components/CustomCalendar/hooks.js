// import { useState, useEffect } from "react";

// export const getSchedules = async (query) => {
//   const res = await fetch("http://localhost:1337/schedules", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   console.log({ res });
//   return res.json();
// };

// export const useSchedules = () => {
//   const [state, setState] = useState();
//   useEffect(() => {
//     const fetchData = async () => {
//       const data = useSchedules();
//       setState(data);
//     };
//     fetchData();
//   }, []);
//   return state;
// };
