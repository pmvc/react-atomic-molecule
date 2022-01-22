import React from "react";
import { mixClass } from "class-lib";
import SemanticUI from "../molecules/SemanticUI";
import { useCSS } from "../../src/needCSS";

const Divider = (props) => {
  useCSS(["divider"], "semantic");
  const classes = mixClass(props.className, "divider");

  return <SemanticUI {...props} className={classes} />;
};

export default Divider;
