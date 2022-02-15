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
        <Row style={{ margin: "0 24px" }}>
          <Col lg={4} md={6} xs={12}>
            <img
              className={"sneakpeak"}
              src={"https://img.everdragons2.com/assets/animation1.gif"}
            />
          </Col>
          <Col lg={4} md={6} xs={12}>
            <img
              className={"sneakpeak"}
              src={"https://img.everdragons2.com/assets/animation2.gif"}
            />
          </Col>
          <Col lg={4} md={6} xs={12}>
            <img
              className={"sneakpeak"}
              src={"https://img.everdragons2.com/assets/animation3.gif"}
            />
          </Col>
        </Row>
        <Row style={{ margin: "0 24px" }}>
          <Col lg={4} md={6} xs={12}>
            <img
              className={"sneakpeak"}
              src={"https://img.everdragons2.com/assets/animation4.gif"}
            />
          </Col>
          <Col lg={4} md={6} xs={12}>
            <img
              className={"sneakpeak"}
              src={"https://img.everdragons2.com/assets/animation5.gif"}
            />
          </Col>
          <Col lg={4} md={6} xs={12}>
            <img
              className={"sneakpeak"}
              src={"https://img.everdragons2.com/assets/animation6.gif"}
            />
          </Col>
        </Row>
        <Scroll.Element name="howToBuy">
          <Row>
            <Col>
              <h2 style={{ padding: "30px 0 20px" }}>How to buy MATIC</h2>
            </Col>
          </Row>
        </Scroll.Element>
        <Row>
          <Col>
            You can buy MATIC on many exchanges. We recommend Binance, Gate.io
            or KuCoin as we know (from our community — big thanks!) that you can
            withdraw directly into Metamask on Polygon Mainnet, paying
            negligible fees.
          </Col>
          <Col>
            Beware that other exchanges like Coinbase let you buy MATIC only on
            the Ethereum network. If you have these, you have{" "}
            <a
              rel={"noreferrer"}
              href={"https://wallet.polygon.technology/bridge/"}
              target={"_blank"}
            >
              to bridge them to the Polygon network
            </a>{" "}
            (and you need a bit of ETH as well, to pay the transaction fees).
          </Col>
          <Col>
            <p>
              How much MATIC? You need 100 MATIC per NFT, plus a few cents for
              gas fee.
            </p>
            <p>
              Whatever path you choose, make sure you can see a positive balance
              in your Metamask wallet on Polygon Mainnet (see top right).
            </p>
          </Col>
        </Row>
        <div style={{ height: 100 }}></div>
      </Container>
    );
  }
}
