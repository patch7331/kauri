import "styles.scss";
const clipboard = require('electron-clipboard-extended');

class ClipboardList extends React.Component {
  constructor(props) {
    super(props);
    clipboard.startWatching();
  }

  render () {
    return (
        <ul class="cpList">
          //item insertion
        </ul>
    );
  }
}

class ClipboardTXT extends React.Component {
  render () {
    return (
        <li class="cpItem">
          <p>{this.props.text}</p>
        </li>
    );
  }
}

class ClipboardIMG extends React.Component {
  render () {
    const imgURI = this.props.img.toDataURL();
    return (
        <li class="cpItem">
          <img src={imgURI} alt={"image"} />
        </li>
    );
  }
}