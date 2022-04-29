import { cloneElement } from "react";
import { mixClass } from "class-lib";
import get from "get-object-value";
import SemanticUI from "../molecules/SemanticUI";
import Message from "../molecules/Message";
import Label from "../molecules/Label";
import useCSS from "../../src/useCSS";

const Field = (props) => {
  useCSS(["input", "search", "form"], "semantic");
  const {
    className,
    fieldClassName,
    fieldStyle,
    fieldStyles,
    fieldProps,
    children,
    inline,
    type,
    inputComponent,
    inputWrapper,
    inputWrapperAttr,
    label,
    labelStyle,
    labelStyles,
    labelWrap,
    style,
    styles,
    styleOrder,
    required,
    messageType,
    messageProps,
    message,
    topTip,
    bottomTip,
    rightTip,
    ...others
  } = props || {};
  const thisMessage = message ?? props["data-message"];
  const thisMessageType = messageType ?? props["data-message-type"];
  const isGroup = !(props.atom || inputComponent);
  const classes = mixClass(fieldClassName, {
    "label-wrap": labelWrap,
    required: !!required,
    field: !isGroup,
    fields: isGroup,
    inline: !!inline,
    info: thisMessageType === "info",
    error: thisMessageType === "error",
    success: thisMessageType === "success",
    warning: thisMessageType === "warning",
  });
  let oLabel = null;
  let thisMessageProps = messageProps || {};
  if (label) {
    const thisLabelStyle = { ...get(labelStyle, null, {}) };
    if (props.id) {
      thisLabelStyle.cursor = "pointer";
    }
    if (labelWrap) {
      thisLabelStyle.flex = "0 1 100%";
      thisMessageProps.style = { ...thisMessageProps.style };
      thisMessageProps.style.flex = "0 1 100%";
    }
    oLabel = (
      <SemanticUI
        atom="label"
        key="label"
        htmlFor={props.id}
        style={thisLabelStyle}
        styles={labelStyles}
        styleOrder={styleOrder}
        title={label}
      >
        {label}
      </SemanticUI>
    );
  }
  let input = null;
  let thisFieldStyles = fieldStyles;
  let thisFieldStyle = fieldStyle;
  let thisChildren = children;
  if (isGroup) {
    if (!thisFieldStyles) {
      thisFieldStyles = styles;
    }
    if (!thisFieldStyle) {
      thisFieldStyle = { ...style };
    } else {
      thisFieldStyle = { ...thisFieldStyle };
    }
    if (label && labelWrap) {
      thisFieldStyle.flexWrap = "wrap";
    }
  } else {
    const isSelect = "select" === props.atom;
    input = inputComponent ? inputComponent : <SemanticUI />;
    const inputProps = get(input, ["props"], {});

    // set inputChildren
    let inputChildren = inputProps.children || null;
    if (isSelect) {
      thisChildren = null;
      inputChildren = children;
    }

    const inputClasses = mixClass(className, inputProps.className, {
      dropdown: isSelect,
    });

    input = cloneElement(
      input,
      {
        ...others,
        style: {
          boxSizing: "inherit",
          ...get(input, ["props", "style"]),
          ...style,
        },
        key: "input",
        className: inputClasses,
        styles,
        styleOrder,
        required,
        type,
      },
      inputChildren
    );
  }
  let topTipEl;
  if (topTip) {
    topTipEl = (
      <Label key="topTip" className="pointing below prompt">
        {topTip}
      </Label>
    );
  }
  let inputs;
  if ("checkbox" === type || "radio" === type) {
    inputs = [topTipEl, input, oLabel];
  } else {
    inputs = [oLabel, topTipEl, input];
  }
  if (inputWrapper) {
    inputs = cloneElement(inputWrapper, inputWrapperAttr, inputs);
  }
  let messageEl;
  let bottomTipEl;
  let rightTipEl;
  if (thisMessage) {
    messageEl = (
      <Message messageType={thisMessageType} {...thisMessageProps}>
        {thisMessage}
      </Message>
    );
  }
  if (bottomTip) {
    bottomTipEl = <Label className="above pointing prompt">{bottomTip}</Label>;
  }
  if (rightTip) {
    rightTipEl = <Label className="left pointing prompt">{rightTip}</Label>;
  }

  // init FieldStyle boxSizing
  thisFieldStyle = { ...thisFieldStyle };
  if (!thisFieldStyle.boxSizing) {
    thisFieldStyle.boxSizing = "inherit";
  }

  return (
    <SemanticUI
      {...fieldProps}
      className={classes}
      style={thisFieldStyle}
      styles={thisFieldStyles}
      styleOrder={styleOrder}
    >
      {inputs}
      {thisChildren}
      {rightTipEl}
      {bottomTipEl}
      {messageEl}
    </SemanticUI>
  );
};

export default Field;
