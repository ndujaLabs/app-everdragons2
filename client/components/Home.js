import BuyTokens from "./sections/BuyTokens";

// eslint-disable-next-line no-undef
// const { Redirect } = ReactRouterDOM;

import { BrowserView, MobileView } from "react-device-detect";

import * as Scroll from "react-scroll";
// import queryString from "query-string";
// import { ethers } from "ethers";
import { switchTo } from "../utils/networkUtils";
// eslint-disable-next-line no-undef
import { Container, Row, Col, ProgressBar } from "react-bootstrap";

import Base from "./Base";
import Ab from "./Ab";

export default class Home extends Base {
  constructor(props) {
    super(props);

    this.state = {};
    this.bindMany(["getCurrentStatus"]);
  }

  componentDidMount() {
    Scroll.animateScroll.scrollToTop();
    if (!this.Store.connectedNetwork) {
      this.getCurrentStatus();
    }
  }

  async getCurrentStatus() {
    const res = await this.request("/get-current-status", "get");
    if (res.success && !this.Store.connectedNetwork) {
      this.setStore({
        currentTotalSupply: res.totalSupply,
      });
    }
  }

  render() {
    const { connectedWallet, connectedNetwork } = this.Store;
    const currentTotalSupply = this.Store.currentTotalSupply || 0;

    // if (!discordUser) {
    //   return <Redirect to={"/welcome"} />;
    // }

    const progress = Math.ceil((currentTotalSupply * 100) / 1000);
    const base = Math.ceil((350 * 100) / 1000);

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
        <MobileView>
          <Row>
            <Col>
              <h2 className={"centered mt24"}>
                Please, use a desktop computer to mint your Everdragons2 Genesis
                Token. Mobile is not supported, yet.
              </h2>
            </Col>
          </Row>
        </MobileView>
        <BrowserView>
          {connectedNetwork ? null : (
            <Row>
              <Col lg={2} />
              <Col lg={8}>
                <div className={"mt24 likeh2"}>
                  Get Everdragons2 Genesis Tokens
                </div>
              </Col>
              <Col lg={2} />
            </Row>
          )}
          {connectedWallet ? (
            connectedNetwork ? (
              <BuyTokens Store={this.Store} setStore={this.setStore} />
            ) : (
              <Row>
                <Col>
                  <h2 className={"centered mt24 h2smaller"}>
                    Please, connect your wallet to Polygon PoS.
                    <br />
                    <Ab
                      label={"Click here to switch/configure it"}
                      onClick={() => switchTo(137)}
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
          {connectedNetwork ? null : (
            <Row>
              <Col lg={2} />
              <Col lg={8}>
                <div className={"padded"}>
                  <ProgressBar>
                    <ProgressBar
                      variant="warning"
                      now={base + progress}
                      key={2}
                      style={{
                        textShadow: "0 0 3px white",
                        backgroundImage: "linear-gradient(orange, gold)",
                        color: "black",
                        fontWeight: "bold",
                      }}
                      // label={`350 assigned, ${minted} sold`}
                    />
                    <ProgressBar
                      striped
                      variant="success"
                      now={100 - base - progress}
                      key={1}
                    />
                  </ProgressBar>
                  <div className={"underProgress centered"}>
                    <span>
                      Total supply: <b>1000</b> | Left for sale:{" "}
                      <b>{650 - currentTotalSupply}</b> | Price: <b>100</b>
                      <span style={{ fontSize: "80%" }}> MATIC</span>
                    </span>
                  </div>
                </div>
              </Col>
              <Col lg={2} />
            </Row>
          )}
        </BrowserView>
      </Container>
    );
  }
}
