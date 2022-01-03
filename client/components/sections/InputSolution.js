// eslint-disable-next-line no-undef
const { Row, Col, Button, InputGroup, FormControl } = ReactBootstrap;

import auth from "../../utils/Auth";
import Base from "../Base";
import Loading from "../Loading";

export default class InputSolution extends Base {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      coord0: "",
      coord1: "",
      coord2: "",
      coord3: "",
      coord4: "",
      coord5: "",
      coord6: "",
      coord7: "",
      coord8: "",
      coord9: "",
    };

    this.bindMany(["handleChange", "submit", "getInput"]);
  }

  componentDidMount() {
    this.setTimeout(this.slide, 3000);
  }

  handleChange(event) {
    let { name, value } = event.target;
    const state = {};
    state[name] = value;
    this.setState(state);
  }

  async submit() {
    let solutions = [];
    try {
      for (let i = 0; i < 10; i++) {
        let solution = this.state["coord" + i].split(",").map((e) => {
          let a = parseFloat(e);
          if (a.toString() !== e) {
            throw new Error();
          }
          return a;
        });
        solutions[i] = solution;
      }
    } catch (e) {
      return this.setState({
        error: "Some solutions are missed or invalid",
      });
    }
    this.setState({
      submitting: true,
    });
    const { accessToken, discordUser } = this.Store;
    const { msgParams, signature } = await auth.getSignedAuthToken(
      this.Store.chainId,
      this.Store.connectedWallet,
      {
        accessToken,
        userId: discordUser.id,
        solutions: JSON.stringify(solutions),
      }
    );
    const res = await this.request("verify-solutions", "post", {
      msgParams,
      signature,
    });
    if (res.success) {
      this.setState({
        score: res.score,
        submitting: false,
      });
    } else {
      this.setState({
        error: res.error || "Nope, that is not the right solution",
        submitting: false,
      });
    }
  }

  getInput(index) {
    const field = "coord" + index;
    return (
      <InputGroup
        key={"input" + index}
        className="mb-3"
        // size={'lg'}
      >
        <InputGroup.Text id="basic-addon3">
          <span className={"coord"}>Coordinates #{index}</span> @
        </InputGroup.Text>
        <FormControl
          name={field}
          value={this.state[field]}
          onChange={this.handleChange}
          placeholder={"37.7667857,-122.4143196"}
        />
      </InputGroup>
    );
  }

  render() {
    const { score } = this.state;

    if (score) {
      return (
        <div>
          <Row>
            <Col>
              <h2 className={"mt24"}>The solutions are correct!</h2>
              <div className={"centered m32"}>
                You rank #{score} in the list. If that is less than 104, you got
                an egg.
              </div>
            </Col>
          </Row>
        </div>
      );
    }

    return (
      <div>
        <Row>
          <Col>
            <h2 className={"mt24"}>Congratulations!</h2>
            <div className={"centered m32"}>
              Input the coordinates of the places where you find the eggs in the
              correct order. Take the coordinates from Google Maps url.
            </div>
          </Col>
        </Row>
        <Row>
          <Col>{this.getInput(0)}</Col>
          <Col>{this.getInput(1)}</Col>
        </Row>
        <Row>
          <Col>{this.getInput(2)}</Col>
          <Col>{this.getInput(3)}</Col>
        </Row>
        <Row>
          <Col>{this.getInput(4)}</Col>
          <Col>{this.getInput(5)}</Col>
        </Row>
        <Row>
          <Col>{this.getInput(6)}</Col>
          <Col>{this.getInput(7)}</Col>
        </Row>
        <Row>
          <Col>{this.getInput(8)}</Col>
          <Col>{this.getInput(9)}</Col>
        </Row>
        <Row>
          <Col className={"centered"}>
            {this.state.error ? (
              <div className={"centered error"}>{this.state.error}</div>
            ) : null}
            <Button
              size={"lg"}
              disabled={this.state.submitting}
              onClick={this.submit}
            >
              {this.state.submitting ? (
                <div>
                  <div className={"floatLeft"}>{this.state.countDownStep}</div>
                  <Loading />
                </div>
              ) : (
                "Verify your solution!"
              )}
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
