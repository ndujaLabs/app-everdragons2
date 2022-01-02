// eslint-disable-next-line no-undef
const { Row, Col, Carousel } = ReactBootstrap;

import Base from "../Base";

export default class Intro extends Base {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };

    this.bindMany(["slide"]);
  }

  componentDidMount() {
    this.setTimeout(this.slide, 3000);
  }

  slide() {
    let { index } = this.state;
    if (index === 7) {
      index = -1;
    }
    index++;
    this.setState({ index });
    this.setTimeout(this.slide, 3000);
  }

  getSingle(i) {
    return (
      <Col lg={2} xs={6} key={"d" + i}>
        <img alt={""} src={`/images/d${i}.png`} />
      </Col>
    );
  }

  isMobile() {
    return window.innerWidth < 800;
  }

  getFour(j) {
    let cols = [];
    const m = this.isMobile() ? 2 : 6;
    for (let i = 0; i < m; i++) {
      cols.push(this.getSingle(j));
      if (j === 7) {
        j = -1;
      }
      j++;
    }
    return (
      <Carousel.Item>
        <Row className={"dragons-show"}>{cols}</Row>
      </Carousel.Item>
    );
  }

  getThree(j) {
    let cols = [];
    const m = this.isMobile() ? 2 : 5;
    for (let i = 0; i < m; i++) {
      cols.push(this.getSingle(j));
      if (j === 7) {
        j = -1;
      }
      j++;
    }
    return (
      <Carousel.Item>
        <Row className={"dragons-show"}>
          {this.isMobile() ? "" : <Col lg={1}> </Col>}
          {cols}
          {this.isMobile() ? "" : <Col lg={1}> </Col>}
        </Row>
      </Carousel.Item>
    );
  }

  render() {
    const { index } = this.state;
    return (
      <div className={"home-section"}>
        {/*<Carousel*/}
        {/*  fade*/}
        {/*  indicators={false}*/}
        {/*  nextLabel={""}*/}
        {/*  nextIcon={""}*/}
        {/*  prevLabel={""}*/}
        {/*  prevIcon={""}*/}
        {/*  activeIndex={index}*/}
        {/*  // onSelect={handleSelect}*/}
        {/*>*/}
        {/*  {this.getFour(0)}*/}
        {/*  {this.getThree(2)}*/}
        {/*  {this.getFour(4)}*/}
        {/*  {this.getThree(1)}*/}
        {/*  {this.getFour(6)}*/}
        {/*  {this.getThree(3)}*/}
        {/*  {this.getFour(7)}*/}
        {/*  {this.getThree(5)}*/}
        {/*</Carousel>*/}
        {/*<Row>*/}
        {/*  <Col>*/}
        {/*    <div className={"textBlock"}>*/}
        {/*      Everdragons2 is a collection of 10,001 dragons randomly generated*/}
        {/*      from hundreds of assets. They inherit the legacy of Everdragons,*/}
        {/*      minted in 2018 as the first bridgeable cross-chain non-fungible*/}
        {/*      token (NFT) for gaming. In the marvelous upcoming Origins, the*/}
        {/*      play-to-earn game of the Everdragons Metaverse, holders of*/}
        {/*      Everdragons2 will get a Loot Box containing Obsidian (the Origins*/}
        {/*      token), Settlement Plans, and Genesis Units based on rarity.*/}
        {/*    </div>*/}
        {/*  </Col>*/}
        {/*</Row>*/}

        {/*<div className={'home-section'}>*/}
        {/*  <h1>Play Goldmine, Win Everdragons2</h1>*/}
        {/*<Row>*/}
        {/*    <Col>*/}
        {/*      <div className={'textBlock'}>*/}
        {/*        <p>*/}
        {/*          1. Go to <a href="https://discord.gg/8rHqANsM">#goldmine</a> on Discord and /register your address.*/}
        {/*        </p>*/}
        {/*        <p>*/}
        {/*          2. Click the image below... enjoy!*/}
        {/*        </p>*/}

        {/*        <a href="https://goldmine.everdragons2.com">*/}
        {/*          <img src="/images/goldmine.png" width="100%" />*/}
        {/*        </a>*/}
        {/*      </div>*/}
        {/*    </Col>*/}
        {/*</Row>*/}
        {/*</div>*/}
      </div>
    );
  }
}
