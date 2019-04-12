/** @format */

import "./styles.scss";

import { h } from "preact";

import Editor from "components/Editor";
import Header from "components/Header";

export default function App() {
  return (
    <div class="app">
      <Header />
      <Editor />
    </div>
  );
}
