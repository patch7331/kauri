/** @format */

import { h } from "preact";
import { renderNodeList, renderStyles } from "dom/render";
import { kebabize } from "helpers/inflections";

/**
 * Determines which CSS list style type to use when representing this variant.
 * @param {String} variant List variant.
 * @return {String} Which CSS list style type to use.
 */
function determineListStyleType(variant) {
  switch (variant) {
    case "decimal":
    case "decimalLeadingZero":
    case "lowerRoman":
    case "upperRoman":
    case "lowerGreek":
    case "lowerLatin":
    case "upperLatin":
      return kebabize(variant);
    case "hollowBullet":
      return "circle";
    case "hollowSquare":
      console.warn("Unsupported bullet type 'hollowSquare'. TODO");
    case "filledSquare":
      return "square";
    case "upperGreek":
      console.warn("Unsupported bullet type 'upperGreek'. TODO");
    case "filledBullet":
    default:
      return "disc";
  }
}

/**
 * An editable list component.
 */
export function List(props) {
  // Determine list type
  const List = props.ordered ? "ol" : "ul";
  const { styles = {} } = props;

  // Calculate list style
  styles.listStyleType = determineListStyleType(props.variant);

  return (
    <List style={renderStyles(styles)}>{renderNodeList(props.children)}</List>
  );
}

export function ListItem(props) {
  return (
    <li style={renderStyles(props.styles)}>{renderNodeList(props.children)}</li>
  );
}
