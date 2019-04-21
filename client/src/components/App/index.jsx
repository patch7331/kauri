/** @format */

import "./styles.scss";
import demo from "./demo.json";
import { h, Component } from "preact";
import Editor from "components/Editor";
import Header from "components/Header";

export default class App extends Component {
  /**
   * Constructs a new app component.
   * @param {Object} props Component properties.
   */
  constructor(props) {
    super(props);
    this.state = { document: demo.document };
  }

  render() {
    return (
      <div class="app">
        <Header title={this.state.document.title} />
        <Editor dom={this.state.document} />
      </div>
    );
  }
}
