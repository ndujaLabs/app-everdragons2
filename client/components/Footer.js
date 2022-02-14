// const {Link} = ReactRouterDOM
import Base from "./Base";
import Ab from "./Ab";

// eslint-disable-next-line no-undef
import { Navbar } from "react-bootstrap";

export default class Footer extends Base {
  render() {
    return (
      <Navbar
        fixed="bottom"
        bg="dark"
        expand="lg"
        className="d-flex justify-content-between navbar navbar-expand-lg navbar-light px-0 sticky"
      >
        <div
          id={"footer"}
          className={"centered"}
          style={{ fontSize: "80%", width: "100%" }}
        >
          <div>
            {" "}
            For more info about the Everdragons2 project, visit{" "}
            <Ab
              label={"https://everdragons2.com"}
              link={"https://everdragons2.com"}
            />{" "}
          </div>
          (c) 2021-present{" "}
          <Ab label={"'ndujaLabs"} link={"https://ndujalabs.com"} />
          {" | "}
          <a
            className="item"
            target="_blank"
            href="https://twitter.com/everdragons2"
            rel="noreferrer"
          >
            <i className="fab fa-twitter" />{" "}
            <span className="roboto300">Twitter</span>
          </a>
          <a
            className="item"
            href={"https://discord.gg/AzfFnUjrnG"}
            rel="noreferrer"
          >
            <i className="fab fa-discord" />{" "}
            <span className="roboto300">Discord</span>
          </a>
          <a
            className="item"
            href={"https://medium.com/ndujalabs"}
            rel="noreferrer"
          >
            <i className="fab fa-medium" />{" "}
            <span className="roboto300">Blog</span>
          </a>
        </div>
      </Navbar>
    );
  }
}
