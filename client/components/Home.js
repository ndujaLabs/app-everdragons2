import BuyTokens from "./sections/BuyTokens";

// eslint-disable-next-line no-undef
// const { Redirect } = ReactRouterDOM;

import * as Scroll from "react-scroll";
// import queryString from "query-string";
// import { ethers } from "ethers";
import { switchTo } from "../utils/networkUtils";
// eslint-disable-next-line no-undef
import { Container, Row, Col } from "react-bootstrap";

import Base from "./Base";
import Ab from "./Ab";

export default class Home extends Base {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    Scroll.animateScroll.scrollToTop();
  }

  render() {
    const { connectedWallet, connectedNetwork } = this.Store;

    // if (!discordUser) {
    //   return <Redirect to={"/welcome"} />;
    // }

    return (
      <Container style={{ marginTop: 100 }}>
        <Row>
          <Col className={"centered"}>
              <img
                src={"/images/new-everdragons2logo.png"}
                className={"ed2logoSmall"}
              />
          </Col>
        </Row>
        {connectedWallet ? (
          connectedNetwork ? (
            <BuyTokens Store={this.Store} setStore={this.setStore} />
          ) : (
            <Row>
              <Col>
                <h2 className={"centered mt24"}>
                  Please, connect your wallet to Polygon PoS.
                  <br />
                  <Ab
                    label={"Click here to switch/configure it"}
                    onClick={() => switchTo(80001)}
                  />
                  .
                </h2>
              </Col>
            </Row>
          )
        ) : (
          <Row>
            <Col>
              <h2 className={"centered mt24"}>
                Connect your wallet to access the Everdragons2 App
              </h2>
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}
