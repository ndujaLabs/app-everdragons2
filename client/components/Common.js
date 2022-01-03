import ls from "local-storage";

// eslint-disable-next-line no-undef
export default class Common extends React.Component {
  constructor(props) {
    super(props);

    this.bindMany = this.bindMany.bind(this);
    this.ls = ls;
  }

  bindMany(methods) {
    for (let m of methods) {
      // console.log(m)
      this[m] = this[m].bind(this);
    }
  }

  render() {
    return <div />;
  }
}
