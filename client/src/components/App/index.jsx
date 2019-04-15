/** @format */

import "./styles.scss";

import { h, Component } from "preact";
import Document from "dom/Document";
import Editor from "components/Editor";
import Header from "components/Header";
import HeadingElement from "dom/elements/HeadingElement";
import ParagraphElement from "dom/elements/ParagraphElement";
import TextNode from "dom/TextNode";

export default class App extends Component {
  /**
   * Constructs a new app component.
   * @param {Object} props Component properties.
   */
  constructor(props) {
    super(props);

    let dom = new Document(
      new HeadingElement(1, new TextNode("Hello World")),
      new ParagraphElement(
        new TextNode("Kauri is a next generation document processor.")
      )
    );

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
