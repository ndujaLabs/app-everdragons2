// eslint-disable-next-line no-undef
import {
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
  ProgressBar,
} from "react-bootstrap";

import FormGroup from "../FormGroup";
import Base from "../Base";
import Loading from "../Loading";
import { ethers } from "ethers";
import { decodeMetamaskError } from "../../utils/networkUtils";
import Address from "../../utils/Address";
import Ab from "../Ab";

export default class BuyTokens extends Base {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      amount2: 0,
      errors: {},
      total: 0,
      price: "",
      minted: 0,
      balance: 0,
      address: "",
    };

    this.bindMany([
      "handleChange",
      "handleBlur",
      "submit",
      "getValues",
      "submit2",
    ]);
  }

  componentDidMount() {
    this.getValues();
  }

  handleChange(event) {
    let { name, value } = event.target;
    const state = {
      errors: {},
      total: 0,
      submitting: undefined,
      error: undefined,
    };
    if (name === "amount") {
      value = parseInt(value || "0");
      if (isNaN(value)) {
        state.errors.amount = "Not a number";
      } else if (value > 10) {
        state.errors.amount = "You cannot buy more than 10 tokens at once";
      } else {
        state.total = parseFloat(
          (parseFloat(this.state.price) * value).toString().substring(0, 5)
        );
      }
    }
    state[name] = value;
    this.setState(state);
  }

  handleBlur(event) {
    // let { name, value } = event.target;
    // const state = {};
    // state[name] = value;
    // this.setState(state);
  }

  async getValues() {
    const { GenesisFarm, Everdragons2Genesis } = this.Store.contracts;
    const price =
      this.state.price || ethers.utils.formatEther(await GenesisFarm.price());
    const nextTokenId = (await GenesisFarm.nextTokenId()).toNumber();
    const minted = nextTokenId - 351;
    const progress = Math.ceil((minted * 100) / 600);
    const balance = (
      await Everdragons2Genesis.balanceOf(this.Store.connectedWallet)
    ).toNumber();
    const isOwner = Address.equal(
      await Everdragons2Genesis.owner(),
      this.Store.connectedWallet
    );
    this.setState({
      price,
      minted,
      progress,
      balance,
      isOwner,
    });
  }

  async submit() {
    const amount = this.state.amount;
    if (amount > 0 && amount <= 10) {
      this.setState({
        submitting: "Waiting for response",
        error: undefined,
      });
      const { GenesisFarm } = this.Store.contracts;
      try {
        let tx = await GenesisFarm.connect(this.Store.signer).buyTokens(
          amount,
          {
            value: (await GenesisFarm.price()).mul(amount),
          }
        );
        await tx.wait();
        this.setState({
          congratulations: true,
          submitting: undefined,
          amount: 0,
          total: 0,
        });
        this.getValues();
      } catch (e) {
        this.setState({
          error: decodeMetamaskError(e.message),
          submitting: undefined,
        });
      }
    } else {
      this.setState({ error: "Invalid amount", submitting: undefined });
    }
  }

  async submit2() {
    const amount = this.state.amount2;
    const address = this.state.address;

    const { GenesisFarm } = this.Store.contracts;
    try {
      let tx = await GenesisFarm.connect(this.Store.signer).withdrawProceeds(
        address,
        amount
      );
      await tx.wait();
      this.setState({
        congratulations: true,
        submitting: undefined,
      });
      this.getValues();
    } catch (e) {
      this.setState({
        error: decodeMetamaskError(e.message),
        submitting: undefined,
      });
    }
  }

  render() {
    const {
      submitting,
      total,
      price,
      isOwner,
      progress,
      error,
      minted,
      balance,
    } = this.state;
    return (
      <div>
        <Row>
          <Col lg={2}></Col>
          <Col lg={8}>
            <h2 className={"mt24"}>Get Everdragons2 Genesis Tokens</h2>
            <div className={"padded"}>
              <ProgressBar>
                <ProgressBar
                  striped
                  variant="success"
                  now={59}
                  label={"350 tokens reserved"}
                  key={1}
                />
                <ProgressBar
                  variant="warning"
                  now={progress}
                  key={2}
                  style={{
                    textShadow: "0 0 3px white",
                    backgroundImage: "linear-gradient(orange, gold)",
                  }}
                />
              </ProgressBar>
              {price ? (
                <div className={"underProgress centered"}>
                  {minted < 250 ? (
                    <span>{250 - minted} available tokens</span>
                  ) : (
                    "Sold out."
                  )}
                </div>
              ) : null}
            </div>
          </Col>
          <Col lg={2}></Col>
        </Row>
        {!price ? (
          <Row>
            <Col lg={2}></Col>
            <Col lg={8}>
              <div className={"centered padded"}>
                <Loading />
              </div>
            </Col>
            <Col lg={2}></Col>
          </Row>
        ) : balance ? (
          <Row>
            <Col lg={2}></Col>
            <Col lg={8}>
              <div
                className={"textBlock centered"}
                style={{ padding: 16, backgroundColor: "#cf9" }}
              >
                Congratulations, you own {balance} E2GT
                <div className={"trade"}>
                  <Ab
                    link={
                      "https://testnets.opensea.io/collection/everdragons2-genesis-token-ip1kxjwrjn"
                    }
                    label={"Trade them on OpenSea"}
                  />
                </div>
              </div>
            </Col>
            <Col lg={2}></Col>
          </Row>
        ) : null}

        {minted < 250 ? (
          <Row>
            <Col style={{ textAlign: "right" }}>
              <FormGroup
                name={"amount"}
                thiz={this}
                placeholder={"Amount of tokens"}
                divCls={"shortInput floatRight"}
              />
              {total > 0 ? (
                <div style={{ clear: "both" }}>Total price {total} MATIC</div>
              ) : null}
            </Col>
            <Col className={"mt4"}>
              {submitting ? (
                <div>
                  <div>{submitting}</div>
                  <div style={{ clear: "both" }}>
                    <Loading />
                  </div>
                </div>
              ) : (
                <Button
                  size={"lg"}
                  disabled={submitting}
                  onClick={this.submit}
                  className={"shortInput"}
                  variant={"success"}
                >
                  Buy now!
                </Button>
              )}
            </Col>
          </Row>
        ) : null}
        {error ? (
          <Row>
            <Col>
              <div className={"error centered"}>ERROR: {error}</div>{" "}
            </Col>
          </Row>
        ) : null}

        {/*
        /// ADMIN
        */}

        {/*{isOwner ? (*/}
        {/*  <Row style={{ marginTop: 48 }}>*/}
        {/*    <Col style={{ textAlign: "right" }}>*/}
        {/*      <FormGroup*/}
        {/*        name={"amount2"}*/}
        {/*        thiz={this}*/}
        {/*        placeholder={"Amount"}*/}
        {/*        divCls={"shortInput floatRight"}*/}
        {/*      />*/}
        {/*      <FormGroup*/}
        {/*        name={"address"}*/}
        {/*        thiz={this}*/}
        {/*        placeholder={"Address"}*/}
        {/*        divCls={"shortInput floatRight"}*/}
        {/*      />*/}
        {/*    </Col>*/}
        {/*    <Col>*/}
        {/*      <Button size={"lg"} onClick={this.submit2}>*/}
        {/*        Get!*/}
        {/*      </Button>*/}
        {/*    </Col>*/}
        {/*  </Row>*/}
        {/*) : null}*/}
      </div>
    );
  }
}
