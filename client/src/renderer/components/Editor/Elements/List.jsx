/** @format */

import { h } from "preact";
import { renderNodeList, renderStyles } from "dom/render";
import { kebabize } from "helpers/inflections";

export function List(props) {
  // Determine list type
  const List = props.ordered ? "ol" : "ul";
  const { styles } = props;

  // Calculate list style
  switch (props.variant) {
    case "decimal":
    case "decimalLeadingZero":
      styles.listStyleType = kebabize(props.variant);
      break;
  }

  return (
    <List style={renderStyles(styles)}>
      {renderNodeList(props.children)}
    </List>
  );
}

export function ListItem(props) {
  return (
    <li style={renderStyles(props.styles)}>{renderNodeList(props.children)}</li>
  );
}
