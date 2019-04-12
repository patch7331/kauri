/** @format */

import "./styles.scss";

import { h, Component } from "preact";
import { version } from "../../../package.json";

export default function Header() {
  return (
    <div class="header">
      <h1>Kauri</h1>
      <p>{version}</p>
    </div>
  );
}
