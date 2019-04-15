/** @format */

import "./styles.scss";

import { h, Component } from "preact";
import { Dom, HeadingElement, ParagraphElement, TextNode } from "dom";
import Editor from "components/Editor";
import Header from "components/Header";

export default class App extends Component {
  /**
   * Constructs a new app component.
   * @param {Object} props Component properties.
   */
  constructor(props) {
    super(props);

    let dom = new Dom();
    let heading = new HeadingElement(new TextNode("Hello World"));
    dom.appendChild(heading);

    let paragraph = new ParagraphElement(
      new TextNode("Kauri is a next generation document processor.")
    );
    dom.appendChild(paragraph);

    this.state = { dom };
  }

  render() {
    return (
      <div class="app">
        <Header />
        <Editor dom={this.state.dom} />
      </div>
    );
  }
}
