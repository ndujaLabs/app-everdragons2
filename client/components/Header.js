// eslint-disable-next-line no-undef
const { Navbar, Nav, Button } = ReactBootstrap;

// eslint-disable-next-line no-undef
const { Link } = ReactRouterDOM;

import * as Scroll from "react-scroll";

import Base from "./Base";

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
        <span onClick={this.copyToClipboard} className={"pointer"}>
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

    // let connectedTo = (
    //   <span className={"connected"}>
    //     {this.Store.connectedWallet ? (
    //       <span className={"notConnected"}>Switch to Ethereum Mainnet</span>
    //     ) : null}
    //   </span>
    // );
    // let { connectedNetwork } = this.Store;

    // if (connectedNetwork) {
    //   connectedTo = "";
    //   // <span><i className="fa fa-plug"
    //   //          style={{color: '#40cc90', marginRight: 10}}/></span>
    // } else {
    //   // connectedTo = '
    // }

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
        <Navbar.Brand href="/">
          <img src={"/images/everDragons2Icon.png"} style={{ height: 40 }} />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={this.setExpanded}
        />
        <Navbar.Collapse id="navbarScroll">
          {this.state.pathname === "/" ? (
            <Nav className="mr-auto my-2 my-lg-0" navbarScroll>
              <Scroll.Link
                offset={-80}
                spy={true}
                smooth={true}
                to="intro"
                onClick={this.setExpanded}
              >
                Intro
              </Scroll.Link>
              {/*<Scroll.Link*/}
              {/*  offset={-80}*/}
              {/*  spy={true}*/}
              {/*  smooth={true}*/}
              {/*  to="story"*/}
              {/*  onClick={this.setExpanded}*/}
              {/*>*/}
              {/*  Story*/}
              {/*</Scroll.Link>*/}
              {/*/!*<Scroll.Link*!/*/}
              {/*/!*  offset={-80}*!/*/}
              {/*/!*  spy={true} smooth={true} to='art' onClick={this.setExpanded}>Art</Scroll.Link>*!/*/}
              {/*<Scroll.Link*/}
              {/*  offset={-80}*/}
              {/*  spy={true}*/}
              {/*  smooth={true}*/}
              {/*  to="roadmap"*/}
              {/*  onClick={this.setExpanded}*/}
              {/*>*/}
              {/*  Roadmap*/}
              {/*</Scroll.Link>*/}
              {/*<Scroll.Link*/}
              {/*  offset={-80}*/}
              {/*  spy={true}*/}
              {/*  smooth={true}*/}
              {/*  to="sale"*/}
              {/*  onClick={this.setExpanded}*/}
              {/*>*/}
              {/*  Sale*/}
              {/*</Scroll.Link>*/}
              {/*<Scroll.Link*/}
              {/*  offset={-80}*/}
              {/*  spy={true}*/}
              {/*  smooth={true}*/}
              {/*  to="faq"*/}
              {/*  onClick={this.setExpanded}*/}
              {/*>*/}
              {/*  FAQ*/}
              {/*</Scroll.Link>*/}
              {/*/!*<Scroll.Link*!/*/}
              {/*/!*  offset={-80}*!/*/}
              {/*/!*  spy={true} smooth={true} to='drops' onClick={this.setExpanded}>Drops</Scroll.Link>*!/*/}
              {/*<Scroll.Link*/}
              {/*  offset={-80}*/}
              {/*  spy={true}*/}
              {/*  smooth={true}*/}
              {/*  to="origins"*/}
              {/*  onClick={this.setExpanded}*/}
              {/*>*/}
              {/*  Origins*/}
              {/*</Scroll.Link>*/}
              {/*<Scroll.Link*/}
              {/*  offset={-80}*/}
              {/*  spy={true}*/}
              {/*  smooth={true}*/}
              {/*  to="team"*/}
              {/*  onClick={this.setExpanded}*/}
              {/*>*/}
              {/*  Team*/}
              {/*</Scroll.Link>*/}
              {/*<Scroll.Link*/}
              {/*  offset={-80}*/}
              {/*  spy={true} smooth={true} to='ed'>ED Original</Scroll.Link>*/}
            </Nav>
          ) : (
            <Nav
              className="mr-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link as={Link} to="/" onClick={this.setExpanded}>
                Home
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>

        <Navbar.Collapse className="justify-content-end">
          {/*<Navbar.Text className={"socialLinks2"}>*/}
          {/*  <a*/}
          {/*    className="item"*/}
          {/*    target="_blank"*/}
          {/*    href="https://twitter.com/everdragons2"*/}
          {/*    rel="noreferrer"*/}
          {/*  >*/}
          {/*    <i className="fab fa-twitter" />{" "}*/}
          {/*    <span className="roboto300">Twitter</span>*/}
          {/*  </a>*/}
          {/*  <a*/}
          {/*    className="item"*/}
          {/*    href={"https://discord.gg/AzfFnUjrnG"}*/}
          {/*    rel="noreferrer"*/}
          {/*  >*/}
          {/*    <i className="fab fa-discord" />{" "}*/}
          {/*    <span className="roboto300">Discord</span>*/}
          {/*  </a>*/}
          {/*  <a*/}
          {/*    className="item"*/}
          {/*    href={"https://medium.com/ndujalabs"}*/}
          {/*    rel="noreferrer"*/}
          {/*  >*/}
          {/*    <i className="fab fa-medium" />{" "}*/}
          {/*    <span className="roboto300">Blog</span>*/}
          {/*  </a>*/}
          {/*</Navbar.Text>*/}

          {this.Store.discordUser ? (
            <Navbar.Text>
              Hi <strong>{this.Store.discordUser.username}</strong>
            </Navbar.Text>
          ) : null}
          {/*<Navbar.Text>{connectedTo}</Navbar.Text>*/}
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
          {/*{Address.isAdmin(this.Store.connectedWallet) ? (*/}
          {/*  <Navbar.Text>*/}
          {/*    <Link to="/admin">*/}
          {/*      <i className="fas fa-tools" /> Admin*/}
          {/*    </Link>*/}
          {/*  </Navbar.Text>*/}
          {/*) : null}*/}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
