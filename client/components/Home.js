// eslint-disable-next-line no-undef
import * as Scroll from "react-scroll";
import queryString from "query-string";
// eslint-disable-next-line no-undef
const { Container, Row, Col } = ReactBootstrap;

import Base from "./Base";
import Intro from "./sections/Intro";

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
    return (
      <div>
        <Container style={{ marginTop: 100 }}>
          <Row>
            <Col className={"centered"}>
              <Scroll.Element name="intro">
                <img
                  src={"/images/new-everdragons2logo.png"}
                  className={"ed2logo"}
                />
                {/*<img src={'/images/everDragons2Logo2.png'} className={'ed2logo'}/>*/}
              </Scroll.Element>
            </Col>
          </Row>
          <Row>
            <Col>
              <Intro Store={this.Store} setStore={this.setStore} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
