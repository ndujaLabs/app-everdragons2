// eslint-disable-next-line no-undef
const { Redirect } = ReactRouterDOM;

import * as Scroll from "react-scroll";
import queryString from "query-string";

// eslint-disable-next-line no-undef
const { Container, Row, Col } = ReactBootstrap;

import Base from "./Base";
import InputSolution from "./sections/InputSolution";

export default class Home extends Base {
  constructor(props) {
    super(props);
    const qs = queryString.parse(window.location.search);
    this.state = {
      qs,
    };
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
          <InputSolution Store={this.Store} setStore={this.setStore} />
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
