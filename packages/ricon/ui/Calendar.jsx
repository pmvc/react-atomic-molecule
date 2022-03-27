import base from "./base";

const Calendar = ({
  children = ("0" + new Date().getDate()).slice(-2),
  viewBox = "0 0 139 139",
  ...props
}) => {
  const d =
    "M113.8,22.905h-13.514v-5.406c0-3.215-2.631-5.845-5.846-5.845s-5.844,2.63-5.844,5.845v5.406H50.406v-5.406  c0-3.215-2.63-5.845-5.845-5.845s-5.845,2.63-5.845,5.845v5.406H25.202c-5.533,0-10.035,4.501-10.035,10.034v74.122  c0,5.533,4.501,10.034,10.035,10.034h79.632c10.478,0,19-8.522,19-19V32.939C123.834,27.406,119.333,22.905,113.8,22.905z   M25.202,30.905h13.521c0.077,3.149,2.671,5.702,5.838,5.702c3.166,0,5.759-2.553,5.837-5.702h38.205  c0.078,3.149,2.67,5.702,5.837,5.702s5.761-2.553,5.839-5.702H113.8c1.104,0,2.034,0.932,2.034,2.034v15.624H23.167V32.939  C23.167,31.836,24.099,30.905,25.202,30.905z M23.167,107.061V56.438h92.667V91.5H99.487l-0.12,17.595H25.202  C24.099,109.095,23.167,108.163,23.167,107.061z M107.37,108.788l0.064-9.288h8.299C115.148,104.058,111.77,107.744,107.37,108.788z";
  props.children = (
    <text style={Styles.label} transform="translate(65, 47)">
      <tspan x="0" dy="1em" textAnchor="middle">
        {children}
      </tspan>
    </text>
  );
  props.viewBox = viewBox;
  return base("Calendar", d)(props);
};

export default Calendar;

const Styles = {
  label: {
    fontSize: "3.5rem",
    fontWeight: 900,
  },
};
