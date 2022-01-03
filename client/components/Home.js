import InputSolution from "./sections/InputSolution";

// eslint-disable-next-line no-undef
const { Redirect } = ReactRouterDOM;

import * as Scroll from "react-scroll";
import queryString from "query-string";
import { ethers } from "ethers";

// eslint-disable-next-line no-undef
const { Container, Row, Col } = ReactBootstrap;

import Base from "./Base";

export default class Home extends Base {
  constructor(props) {
    super(props);
    const qs = queryString.parse(window.location.search);
    if (
      qs["agdaroth-sent-me"] &&
      ethers.utils.id(qs["agdaroth-sent-me"]) ===
        "0x754806243f179623bd2c9ac7fb8ea63c12e5ddcd29a983176bf1c44c09e987e7"
    ) {
      this.state = {
        nice: true,
      };
    } else {
      this.state = {};
    }
  }

  componentDidMount() {
    Scroll.animateScroll.scrollToTop();
  }

  render() {
    const { discordUser, connectedWallet } = this.Store;

    if (!discordUser) {
      return <Redirect to={"/welcome"} />;
    }

    return (
      <Container style={{ marginTop: 100 }}>
        <Row>
          <Col className={"centered"}>
            <Scroll.Element name="intro">
              <img
                src={"/images/new-everdragons2logo.png"}
                className={"ed2logoSmall"}
              />
              {/*<img src={'/images/everDragons2Logo2.png'} className={'ed2logo'}/>*/}
            </Scroll.Element>
          </Col>
        </Row>
        {connectedWallet ? (
          this.state.nice ? (
            <InputSolution Store={this.Store} setStore={this.setStore} />
          ) : (
            <Row>
              <Col>
                <h2 className={"centered mt24"}>
                  It looks like you came here too early :-(
                </h2>
              </Col>
            </Row>
          )
        ) : (
          <Row>
            <Col>
              <h2 className={"centered mt24"}>
                Please, connect your wallet before input the solutions.
                <br />
                It is necessary to whitelist you, if the solutions are correct.
              </h2>
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}
