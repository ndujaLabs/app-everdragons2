// eslint-disable-next-line no-undef
const { Redirect } = ReactRouterDOM;

// eslint-disable-next-line no-undef
import { Container, Button, Row, Col } from "react-bootstrap";

import Base from "./Base";
import Loading from "./Loading";

export default class Welcome extends Base {
  constructor(props) {
    super(props);

    this.state = {};

    this.bindMany(["setCallback"]);
  }

  componentDidMount() {
    this.setCallback();
  }

  async setCallback() {
    const targetPage = window.location.pathname.split("/")[2];
    this.setStore(
      {
        targetPage: /^[a-z]+$/.test(targetPage) ? targetPage : "",
      },
      true
    );
    const { accessToken, discordUser } = this.Store;
    let needAuthentication = true;
    if (accessToken && discordUser) {
      const res = await this.request("is-still-valid", "get", undefined, {
        accessToken,
        userId: discordUser.id,
      });
      if (res.success) {
        this.setStore({
          powerTimestamp: parseInt(
            parseInt(Date.now() / 10000).toString() + discordUser.discriminator
          ),
        });
        needAuthentication = false;
      }
    }
    this.setState({
      needAuthentication,
    });
  }

  render() {
    const { needAuthentication } = this.state;
    if (needAuthentication === false) {
      return <Redirect to={`/${this.Store.targetPage || ""}`} />;
    } else if (needAuthentication) {
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
          <Row>
            <Col className={"centered"}>
              <Button
                style={{ marginTop: 80 }}
                size={"lg"}
                // variant={"warning"}
                onClick={() => (window.location = "/auth/discord/login")}
              >
                Connect to Discord
              </Button>
            </Col>
          </Row>
        </Container>
      );
    } else {
      return (
        <Container style={{ marginTop: 100 }}>
          <div className={"noTokens m0Auto"}>
            <Loading />
          </div>
        </Container>
      );
    }
  }
}
