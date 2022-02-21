import BuyTokens from "./sections/BuyTokens";

// eslint-disable-next-line no-undef
// const { Redirect } = ReactRouterDOM;

import { BrowserView, MobileView } from "react-device-detect";

import * as Scroll from "react-scroll";
// import queryString from "query-string";
// import { ethers } from "ethers";
// import { switchTo } from "../utils/networkUtils";
// eslint-disable-next-line no-undef
import { Container, Row, Col } from "react-bootstrap";

import Base from "./Base";
import Ab from "./Ab";
import { switchTo } from "../utils/networkUtils";
// import Ab from "./Ab";

export default class Home extends Base {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    Scroll.animateScroll.scrollToTop();
  }

  render() {
    // const stage = /stage/.test(window.location.search);

    const { connectedWallet, connectedNetwork } = this.Store;
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
          {connectedWallet ? (
            connectedNetwork ? (
              <BuyTokens Store={this.Store} setStore={this.setStore} />
            ) : (
              <Row>
                <Col lg={2} />
                <Col lg={8}>
                  <div className={"alert centered"}>
                    UNSUPPORTED NETWORK.
                    <br />
                    Click{" "}
                    <Ab
                      label={"here to switch to Polygon PoS"}
                      onClick={() => switchTo(137)}
                    /><br/>
                    or{" "}
                    <Ab
                      label={"here to switch to Ethereum Mainnet"}
                      onClick={() => switchTo(1)}
                    />
                  </div>
                </Col>
                <Col lg={2} />
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
        </BrowserView>
        <Row style={{ margin: "0 24px" }}>
          <Col lg={4} md={6} xs={12}>
            <img
              className={"sneakpeak"}
              src={
                "https://s3.us-west-1.amazonaws.com/img.everdragons2.com/assets/animation1.gif"
              }
            />
          </Col>
          <Col lg={4} md={6} xs={12}>
            <img
              className={"sneakpeak"}
              src={
                "https://s3.us-west-1.amazonaws.com/img.everdragons2.com/assets/animation2.gif"
              }
            />
          </Col>
          <Col lg={4} md={6} xs={12}>
            <img
              className={"sneakpeak"}
              src={
                "https://s3.us-west-1.amazonaws.com/img.everdragons2.com/assets/animation3.gif"
              }
            />
          </Col>
        </Row>
        <Row style={{ margin: "0 24px" }}>
          <Col lg={4} md={6} xs={12}>
            <img
              className={"sneakpeak"}
              src={
                "https://s3.us-west-1.amazonaws.com/img.everdragons2.com/assets/animation4.gif"
              }
            />
          </Col>
          <Col lg={4} md={6} xs={12}>
            <img
              className={"sneakpeak"}
              src={
                "https://s3.us-west-1.amazonaws.com/img.everdragons2.com/assets/animation5.gif"
              }
            />
          </Col>
          <Col lg={4} md={6} xs={12}>
            <img
              className={"sneakpeak"}
              src={
                "https://s3.us-west-1.amazonaws.com/img.everdragons2.com/assets/animation6.gif"
              }
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
