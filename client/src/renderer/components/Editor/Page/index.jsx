/** @format */

import "./styles.scss";
import { h } from "preact";

export default ({ styles, children }) => {
  const newStyles = {}
  Object.keys(styles).forEach(key => {
    const value = styles[value];
    if (key.startsWith("margin")) {
      newStyles["padding" + key.slice(6)] = value
    } else {
      newStyles[key] = value
    }
  })
  console.log(newStyles)

  return (
    <div class="page" style={newStyles}>
      {children}
    </div>
  )
}
