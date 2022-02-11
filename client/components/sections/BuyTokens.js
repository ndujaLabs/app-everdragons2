// eslint-disable-next-line no-undef
import { Row, Col, Button, ProgressBar, Spinner } from "react-bootstrap";

import FormGroup from "../FormGroup";
import Base from "../Base";
import Loading from "../Loading";
import { ethers } from "ethers";
import { decodeMetamaskError } from "../../utils/networkUtils";
import Address from "../../utils/Address";
import Ab from "../Ab";
import { openSeaLink } from "../../config";
import { switchTo } from "../../utils/networkUtils";

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
      saleStarted: false,
      saleStartIn: 0,
      progress: 0,
      isOwner: false,
      checked: false,
    };

    this.bindMany([
      "handleChange",
      "handleBlur",
      "submit",
      "getValues",
      "submit2",
      "checkAmount",
    ]);
  }

  componentDidMount() {
    this.getValues();
  }

  checkAmount(name, value) {
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

  handleChange(event) {
    let { name, value } = event.target;
    this.checkAmount(name, value);
  }

  handleBlur(event) {
    let { name, value } = event.target;
    this.checkAmount(name, value);
  }

  async getValues() {
    const { GenesisFarm, Everdragons2Genesis } = this.Store.contracts;
    if (GenesisFarm.address !== ethers.constants.AddressZero) {
      const price =
        this.state.price || ethers.utils.formatEther(await GenesisFarm.price());
      const saleStartAt = (await GenesisFarm.saleStartAt()).toNumber() * 1000;
      let saleStarted = false;
      let saleStartIn = 0;
      if (Date.now() > saleStartAt) {
        saleStarted = true;
      } else {
        saleStartIn = saleStartAt - Date.now();
      }
      const nextTokenId = saleStarted
        ? (await GenesisFarm.nextTokenId()).toNumber()
        : 351;
      const minted = nextTokenId - 351;
      const progress = Math.ceil((minted * 100) / 600);
      const balance = saleStarted
        ? (
            await Everdragons2Genesis.balanceOf(this.Store.connectedWallet)
          ).toNumber()
        : 0;
      const isOwner = Address.equal(
        await Everdragons2Genesis.owner(),
        this.Store.connectedWallet
      );
      this.setState({
        saleStarted,
        saleStartIn,
        price,
        minted,
        progress,
        balance,
        isOwner,
        checked: true,
      });
    } else {
      this.setState({
        checked: true,
      });
    }
    this.setTimeout(this.getValues, 30000);
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
      // isOwner,
      progress,
      saleStarted,
      saleStartIn,
      error,
      minted,
      balance,
      checked,
    } = this.state;

    const { chainId } = this.Store;

    if (!checked) {
      return (
        <Row>
          <Col className={"centered"}>
            <Spinner animation="grow" variant="warning" />
          </Col>
        </Row>
      );
    }

    if (!saleStarted && !saleStartIn) {
      return (
        <Row>
          <Col>
            <h2 className={"centered mt24"}>
              The sale will start Friday, February 11th, at 10 am PST
            </h2>
          </Col>
        </Row>
      );
    }
    let hours, minutes;
    if (saleStartIn > 0) {
      hours = parseInt(saleStartIn / 3600000);
      minutes = parseInt((saleStartIn / 60000) % 60);
    }

    return (
      <div>
        {chainId === 80001 ? (
          <Row>
            <Col lg={2} />
            <Col lg={8}>

              <div className={"alert centered"}>
                YOU ARE USING THE TEST APP ON MUMBAI.
                <br />
                <Ab
                  label={"Click here to switch to Polygon PoS"}
                  onClick={() => switchTo(137)}
                />
              </div>
            </Col>
            <Col lg={2} />
          </Row>
        ) : null}
        {saleStartIn > 0 ? (
          <Row>
            <Col lg={2} />
            <Col lg={8}>
              <div
                className={"textBlock centered"}
                style={{ padding: 16, backgroundColor: "#cf9" }}
              >
                Sale starts in {hours > 0 ? `${hours} hours and ` : ""}
                {minutes} minutes
              </div>
            </Col>
            <Col lg={2} />
          </Row>
        ) : null}
        <Row>
          <Col lg={2} />
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
                    color: "black",
                    fontWeight: "bold",
                  }}
                  label={`${minted} sold`}
                />
              </ProgressBar>
              {price ? (
                <div className={"underProgress centered"}>
                  {minted < 250 ? (
                    <span>Tokens available for sale: {250 - minted}</span>
                  ) : (
                    "Sold out."
                  )}
                </div>
              ) : null}
            </div>
          </Col>
          <Col lg={2} />
        </Row>
        {!price ? (
          <Row>
            <Col lg={2} />
            <Col lg={8}>
              <div className={"centered padded"}>
                <Loading />
              </div>
            </Col>
            <Col lg={2} />
          </Row>
        ) : balance ? (
          <Row>
            <Col lg={2} />
            <Col lg={8}>
              <div
                className={"textBlock centered"}
                style={{ padding: 16, backgroundColor: "#cf9" }}
              >
                Congratulations, you own {balance} E2GT
                {openSeaLink[chainId] ? (
                  <div className={"trade"}>
                    <Ab
                      link={openSeaLink[chainId]}
                      label={"You can check them on OpenSea"}
                    />
                  </div>
                ) : null}
              </div>
            </Col>
            <Col lg={2} />
          </Row>
        ) : null}

        {saleStartIn > 0 ? null : minted < 250 ? (
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
