import Base from "./Base";

// eslint-disable-next-line no-undef
const { Container } = ReactBootstrap;

export default class Error404 extends Base {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container style={{ marginTop: 100 }}>
        <div className={"noTokens m0Auto"}>
          <p>404, page not found :-(</p>
        </div>
      </Container>
    );
  }
}
