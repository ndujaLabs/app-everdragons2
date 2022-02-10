// eslint-disable-next-line no-undef
const { Redirect } = ReactRouterDOM;
// eslint-disable-next-line no-undef
import { Container } from "react-bootstrap";

import Base from "./Base";
import queryString from "query-string";
import Loading from "./Loading";

export default class Token extends Base {
  constructor(props) {
    super(props);
    this.state = {};

    this.bindMany(["getResults"]);
  }

  componentDidMount() {
    this.getResults();
  }

  getResults() {
    const qs = queryString.parse(window.location.search);
    if (qs.error) {
      return this.setState({ error: qs.error });
    }
    const { access_token } = qs;
    delete qs.access_token;
    const targetPage = this.Store.targetPage || "";
    this.setStore(
      {
        accessToken: access_token,
        discordUser: qs,
        targetPage: this.Store.targetPage || "/",
      },
      true
    );
    this.setState({
      targetPage,
    });
  }

  render() {
    const { targetPage } = this.state;
    if (typeof targetPage !== "undefined") {
      return <Redirect to={"/"} />;
    } else {
      return (
        <Container style={{ marginTop: 100 }}>
          <div className={"noTokens m0Auto"}>
            {this.state.error ? (
              <div className={"error"}>{this.state.error}</div>
            ) : (
              <Loading />
            )}
          </div>
        </Container>
      );
    }
  }
}
