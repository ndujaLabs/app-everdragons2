import PropTypes from "prop-types";
// eslint-disable-next-line no-undef
const { Link } = ReactRouterDOM;

// eslint-disable-next-line no-undef
export default class Ab extends React.Component {
  render() {
    const { link, onClick, title, cls, icon, style } = this.props;
    let label = icon ? <i className={icon} /> : this.props.label;
    if (link) {
      if (/:\/\//.test(link)) {
        return (
          <a
            rel={"noreferrer"}
            title={title}
            href={link}
            target="_blank"
            className={cls || ""}
            style={style || {}}
          >
            {label}
          </a>
        );
      } else {
        return (
          <Link to={link} className={cls || ""}>
            {label}
          </Link>
        );
      }
    } else {
      return (
        <span
          title={title}
          className={"command " + (cls || "")}
          onClick={onClick}
          style={style || {}}
        >
          {label}
        </span>
      );
    }
  }
}

Ab.propTypes = {
  link: PropTypes.string,
  onClick: PropTypes.func,
  label: PropTypes.node,
  cls: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.string,
  style: PropTypes.object,
};
