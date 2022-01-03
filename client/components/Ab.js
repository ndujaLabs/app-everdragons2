import Base from "./Base";

// eslint-disable-next-line no-undef
export default class Ab extends Base {
  render() {
    const { link, label, onClick, title } = this.props;
    if (link)
      return (
        <a
          rel={"noreferrer"}
          title={title}
          href={link}
          target="_blank"
          className={this.props.className || ""}
        >
          {label}
        </a>
      );
    else
      return (
        <span
          title={title}
          className={"command " + (this.props.className || "")}
          onClick={onClick}
        >
          {label}
        </span>
      );
  }
}
