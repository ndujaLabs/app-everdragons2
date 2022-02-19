// eslint-disable-next-line no-undef
import { Navbar, Nav, Button } from "react-bootstrap";

// eslint-disable-next-line no-undef
// const { Link } = ReactRouterDOM;
import { BrowserView } from "react-device-detect";

import Base from "./Base";
import * as Scroll from "react-scroll";
export default class Header extends Base {
  constructor(props) {
    super(props);

    this.state = {
      addressExpanded: false,
      expanded: "",
      pathname: window.location.pathname,
    };

    this.bindMany(["copyToClipboard", "checkPathname", "setExpanded"]);
  }

  setExpanded() {
    this.setState({
      expanded: this.state.expanded ? "" : "expanded",
    });
  }

  ellipseAddress(address) {
    const width = 4;
    return `${address.slice(0, width)}...${address.slice(-4)}`;
  }

  componentDidMount() {
    this.checkPathname();
  }

  copyToClipboard() {
    try {
      navigator.clipboard.writeText(this.Store.connectedWallet);
      this.setState({
        copied: true,
      });
    } catch (e) {}
  }

  checkPathname() {
    let { pathname } = window.location;
    if (pathname !== this.state.pathname) {
      this.setState({
        pathname,
      });
    }
    setTimeout(this.checkPathname, 500);
  }

  render() {
    const { expanded } = this.state;

    // let isPhone = this.Store.width < 900;

    let address = null;
    let shortAddress;
    if (this.Store.connectedWallet) {
      let fullAddress = this.Store.connectedWallet;
      shortAddress = this.ellipseAddress(fullAddress);
      address = (
        <span onClick={this.copyToClipboard} style={{ cursor: "copy" }}>
          {shortAddress}
          {/*{isPhone ? null : (*/}
          {/*  <i*/}
          {/*    style={{ marginLeft: 5 }}*/}
          {/*    onClick={this.copyToClipboard}*/}
          {/*    className="command fa fa-solid fa-copy"*/}
          {/*  />*/}
          {/*)}*/}
        </span>
      );
    }

    let connectedTo = null;
    //   (
    //   <span className={"connected"}>
    //     {this.Store.connectedWallet ? (
    //       <span className={"notConnected"}>Switch to Polygon</span>
    //     ) : null}
    //   </span>
    // );

    let { connectedNetwork } = this.Store;
    if (connectedNetwork) {
      connectedTo = (
        <span>
          <i
            className="fa fa-plug"
            style={{ color: "#40cc90", marginRight: 10 }}
          />{" "}
          Connected to {connectedNetwork}
        </span>
      );
    }

    // const getTitle = (what, title) => {
    //   let { which } = this.state;
    //   title = title || what.substring(0, 1).toUpperCase() + what.substring(1);
    //   if (which === what) {
    //     return <b>{title}</b>;
    //   } else {
    //     return title;
    //   }
    // };

    // console.log(this.state.pathname);

    return (
      <Navbar
        expanded={expanded}
        fixed="top"
        bg="light"
        expand="lg"
        className={"roboto"}
      >
        <Navbar.Brand href="https://everdragons2.com">
          <img
            src={"/images/everDragons2Icon.png"}
            style={{ height: 40, margin: "0 8px" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={this.setExpanded}
        />
        <Navbar.Collapse id="navbarScroll">
          {
            this.isMobile() ? null : (
              <Nav className="mr-auto my-2 my-lg-0" navbarScroll>
                <Scroll.Link
                  // offset={-80}
                  // spy={true}
                  // smooth={true}
                  to="howToBuy"
                  onClick={this.setExpanded}
                >
                  How to get <span style={{ fontSize: "80%" }}>MATIC</span>
                </Scroll.Link>
              </Nav>
            )
            //   : (
            //   <Nav
            //     className="mr-auto my-2 my-lg-0"
            //     style={{ maxHeight: "100px" }}
            //     navbarScroll
            //   >
            //     <Nav.Link as={Link} to="/" onClick={this.setExpanded}>
            //       Home
            //     </Nav.Link>
            //   </Nav>
            // )
          }
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          {this.Store.discordUser?.username ? (
            <Navbar.Text>
              Hi <strong>{this.Store.discordUser.username}</strong>
            </Navbar.Text>
          ) : null}
          <Navbar.Text>{connectedTo}</Navbar.Text>
          <BrowserView>
            {this.Store.connectedWallet ? (
              <Navbar.Text>
                <i
                  className="fas fa-user-astronaut"
                  style={{ marginRight: 10 }}
                />
                {address}
              </Navbar.Text>
            ) : (
              <Button
                onClick={this.props.connect}
                variant="primary"
                className={"chiaro"}
              >
                Connect your wallet
              </Button>
            )}
          </BrowserView>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
