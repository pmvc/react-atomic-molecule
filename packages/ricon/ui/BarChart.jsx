import base from "./base";

const BarChart = (props) => {
  const d = "M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z";

  return base("BarChart", d)(props);
};
export default BarChart;
