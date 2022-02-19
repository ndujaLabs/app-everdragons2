// eslint-disable-next-line no-undef
import { Row, Col, Button, ProgressBar, Spinner } from "react-bootstrap";

import FormGroup from "../FormGroup";
import Base from "../Base";
import Loading from "../Loading";
import { ethers } from "ethers";
import { decodeMetamaskError } from "../../utils/networkUtils";
import Address from "../../utils/Address";
import Ab from "../Ab";
import { openSeaLink, contracts } from "../../config";
import { switchTo } from "../../utils/networkUtils";

export default class BuyTokens extends Base {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      amount2: 0,
      errors: {},
      total: 0,
      price: "100",
      minted: 0,
      balance: 0,
      address: "",
      saleStarted: false,
      saleStartIn: 0,
      progress: 0,
      isOwner: false,
      checked: false,
      walletBalance: 0,
      ethPrice: 0,
      progress2: 0,
      remaining: 650,
    };

    this.bindMany([
      "handleChange",
      "handleBlur",
      "buy",
      "getValues",
      "withdraw",
      "checkAmount",
      "copyToClipboard",
      "showHowToAdd",
      "getFarm",
      "distribute",
      "buyInEth",
      "getCurrentStatus",
    ]);
  }

  componentDidMount() {
    this.getCurrentStatus();
  }

  checkAmount(name, value) {
    const state = {
      errors: {},
      total: 0,
      submitting: undefined,
      error: undefined,
    };
    const price = this.isMatic(this.Store.chainId)
      ? this.state.price
      : this.getEtherPrice();
    if (name === "amount") {
      value = parseInt(value || "0");
      if (isNaN(value)) {
        state.errors.amount = "Not a number";
      } else if (value > 10) {
        state.errors.amount = "You cannot buy more than 10 tokens at once";
      } else if (
        parseFloat(this.state.walletBalance) <
        value * parseFloat(price)
      ) {
        state.errors.amount = "Insufficient funds";
      } else {
        state.total = parseFloat((price * value).toString());
      }
    }
    state[name] = value;
    this.setState(state);
  }

  showHowToAdd() {
    const { chainId, globals } = this.Store;
    const address = contracts[chainId].Everdragons2Genesis;
    globals.showPopUp({
      title: "How to add E2GT to your wallet",
      body: (
        <ul>
          <li>Open Metamask</li>
          <li>Scroll down the assets</li>
          <li>
            Click on <i>Import tokens</i> and set
            <ul>
              <li>
                Address: <b className={"code"}>{address}</b>
              </li>
              <li>
                Symbol: <b className={"code"}>E2GT</b>
              </li>
              <li>
                Decimals: <b className={"code"}>0</b>
              </li>
            </ul>
          </li>
        </ul>
      ),
    });
  }

  copyToClipboard(chainId) {
    const address = contracts[chainId].Everdragons2Genesis;
    try {
      navigator.clipboard.writeText(address);
      this.setState({
        copied: true,
      });
    } catch (e) {}
  }

  handleChange(event) {
    let { name, value } = event.target;
    this.checkAmount(name, value);
  }

  handleBlur(event) {
    let { name, value } = event.target;
    this.checkAmount(name, value);
  }

  getEtherPrice(lastId) {
    // price on Ethereum is 0.06, when Matic is 100
    return 0.06;
  }

  isMatic(chainId) {
    return /^(13(3|)7|80001)$/.test("" + chainId);
  }

  async getCurrentStatus() {
    await this.waitForWeb3();
    const { chainId } = this.Store;
    if (!this.isMatic(chainId)) {
      const res = await this.request("/get-current-status", "get", undefined, {
        chainId,
      });
      if (res.success) {
        this.setStore({
          currentTotalSupply: res.totalSupply,
        });
      }
    }
    this.getValues();
  }

  async getValues() {
    let walletBalance = await this.Store.provider.getBalance(
      this.Store.connectedWallet
    );
    let tmp = ethers.utils.formatEther(walletBalance.toString()).split(".");
    if (tmp[1]) {
      tmp[1] = tmp[1].substring(0, 2);
    }
    walletBalance = tmp[1] ? tmp.join(".") : tmp[0];
    const maxForSale = 650;
    const maxClaimable = 350;
    const maxSupply = 1000;
    let progress2 = 0;
    let reserved = 350;
    if (this.isMatic(this.Store.chainId)) {
      const { Everdragons2Genesis } = this.Store.contracts;
      const farm = this.getFarm();
      const nextTokenId = (await farm.nextTokenId()).toNumber();
      const price = ethers.utils.formatEther(await farm.price());
      const ethPrice = this.getEtherPrice();
      const minted = nextTokenId - 351;
      const base = maxClaimable / 10;
      let closed = await farm.saleClosedAt();
      if (closed !== 0) {
        reserved += 1000 - closed;
        progress2 = (maxSupply - closed) / 10;
      }
      const progress = Math.round(minted / 10);
      const remaining = 100 - progress - base - progress2;

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
        base,
        progress,
        balance,
        nextTokenId,
        isOwner,
        maxSupply,
        maxForSale,
        maxClaimable,
        checked: true,
        walletBalance,
        progress2,
        ethPrice,
        reserved,
        remaining,
      });
    } else {
      const minted = this.Store.currentTotalSupply || 0;
      const nextTokenId = minted + 350;
      const ethPrice = this.getEtherPrice();
      const base = maxClaimable / 10;
      progress2 = this.Store.chainId === 1 ? 10 : 5;
      reserved = this.Store.chainId === 1 ? 450 : 400;
      const progress = Math.round(minted / 10);
      const remaining = 100 - progress - base - progress2;
      this.setState({
        minted,
        base,
        progress,
        maxSupply,
        maxForSale,
        maxClaimable,
        nextTokenId,
        checked: true,
        reserved,
        walletBalance,
        progress2,
        remaining,
        ethPrice,
      });
    }
    this.setTimeout(this.getValues, 10000);
  }

  async buy() {
    const amount = this.state.amount;
    if (amount > 0 && amount <= 10) {
      this.setState({
        submitting: "Waiting for approval",
        error: undefined,
      });
      const farm = this.getFarm();
      try {
        let tx = await farm.connect(this.Store.signer).buyTokens(amount, {
          value: (await farm.price()).mul(amount),
        });
        this.setState({
          submitting: "Waiting for confirmation",
        });
        await tx.wait();
        this.setState({
          congratulations: true,
          submitting: undefined,
          amount: 0,
          total: 0,
        });
        // give time to Infura to update the info
        this.setTimeout(this.getValues, 4444);
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

  async buyInEth() {
    const amount = this.state.amount;
    if (amount > 0 && amount <= 10) {
      this.setState({
        submitting: "Waiting for validation",
        error: undefined,
        amountTaken: 0,
      });
      let res = await this.request("authorize-purchase", "post", {
        amount,
      });
      if (!res.success) {
        return this.setState({
          error: "Transaction not authorized",
          submitting: undefined,
        });
      }
      let { nonce, cost, signature } = res;
      cost = ethers.BigNumber.from(cost);
      this.setState({
        submitting: "Waiting for approval",
        error: undefined,
      });
      const farm = this.Store.contracts.EthereumFarm;
      try {
        let tx = await farm
          .connect(this.Store.signer)
          .buyTokenCrossChain(amount, nonce, cost, signature, {
            value: cost,
          });
        this.setState({
          submitting: (
            <span>
              Waiting to confirm the transaction.
              <br />
              Please do not leave/refresh the page
            </span>
          ),
        });
        await tx.wait();
        this.setState({
          submitting: (
            <span>
              Waiting for minting.
              <br />
              Please do not leave/refresh the page
            </span>
          ),
        });
        res = await this.request("mint-token", "post", {
          nonce,
        });
        const { mintingTx } = res;
        if (!mintingTx) {
          return this.setState({
            error: "Purchase not found. Contact info@ndujalabs.com for support",
            submitting: undefined,
          });
        }
        this.setState({
          congratulations: true,
          submitting: undefined,
          mintingTx,
          amountTaken: amount,
        });
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

  getFarm() {
    return this.Store.contracts.GenesisFarm3;
  }

  async withdraw() {
    const amount = ethers.BigNumber.from(this.state.amount2);
    const address = this.state.address;
    const farm = this.getFarm();
    try {
      let tx = await farm
        .connect(this.Store.signer)
        .withdrawProceeds(address, amount);
      await tx.wait();
      console.debug("DONE");
    } catch (e) {
      this.setState({
        error: decodeMetamaskError(e.message),
        submitting: undefined,
      });
    }
  }

  async distribute() {
    const quantity = ethers.BigNumber.from(this.state.quantity);
    const index = ethers.BigNumber.from(this.state.index);
    const farm = this.getFarm();
    try {
      let tx = await farm
        .connect(this.Store.signer)
        .giveExtraTokens(index, quantity);
      await tx.wait();
      console.debug("DONE");
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
      base,
      progress,
      progress2,
      error,
      minted,
      balance,
      checked,
      walletBalance,
      maxSupply,
      maxForSale,
      mintingTx,
      amountTaken,
      ethPrice,
      remaining,
      reserved,
    } = this.state;

    console.log("price", price);

    const currency = this.isMatic(this.Store.chainId) ? "MATIC" : "ETH";
    const buyFunc = this.isMatic(this.Store.chainId) ? this.buy : this.buyInEth;

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

    return (
      <div>
        {/*{chainId === 80001 ? (*/}
        {/*  <Row>*/}
        {/*    <Col lg={2} />*/}
        {/*    <Col lg={8}>*/}
        {/*      <div className={"alert centered"}>*/}
        {/*        YOU ARE USING THE TEST APP ON MUMBAI.*/}
        {/*        <br />*/}
        {/*        <Ab*/}
        {/*          label={"Click here to switch to Polygon PoS"}*/}
        {/*          onClick={() => switchTo(137)}*/}
        {/*        />*/}
        {/*      </div>*/}
        {/*    </Col>*/}
        {/*    <Col lg={2} />*/}
        {/*  </Row>*/}
        {/*) : null}*/}
        <Row>
          <Col>
            <div className={"legenda centered"}>
              E2GT are ERC721 tokens on the Polygon PoS Network.
            </div>
            <div className={"roboto centered underLegenda"}>
              You can get them in two ways:
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={2} />
          <Col lg={4}>
            <div className={"centered mt24 h2smaller hilite"}>
              <div style={{ fontSize: "120%" }}>On Polygon</div>
              The best option. You pay with MATIC on Polygon PoS. The gas cost
              is negligible and the transaction is fast and smooth.
              <br />
              {this.isMatic(chainId) ? (
                <div>Use the font below to proceed</div>
              ) : (
                <Ab
                  label={"Click here to switch/configure it"}
                  onClick={() => switchTo(137)}
                  style={{ fontWeight: "normal" }}
                />
              )}
            </div>
          </Col>
          <Col lg={4}>
            <div className={"centered mt24 h2smaller hilite"}>
              <div style={{ fontSize: "120%" }}>On Ethereum</div>
              You pay with ETH but receive the tokens on Polygon PoS. Since the
              minting happens on Polygon, the gas cost is quite low.
              <br />
              {this.isMatic(chainId) ? (
                <Ab
                  label={"Click here to switch/configure it"}
                  onClick={() => switchTo(1)}
                  style={{ fontWeight: "normal" }}
                />
              ) : (
                <div>Use the form below to proceed</div>
              )}
            </div>
          </Col>
          <Col lg={2} />
        </Row>
        <Row>
          <Col lg={2} />
          <Col lg={8}>
            <div className={"mt24 likeh2"}>
              Get Everdragons2 Genesis Tokens
              {this.isMatic(this.Store.chainId) ? (
                <div className={"smallUnder"}>
                  <Ab
                    label={"Add the token to your wallet"}
                    onClick={this.showHowToAdd}
                  />
                </div>
              ) : null}
            </div>
            <div className={"padded"}>
              <ProgressBar>
                <ProgressBar
                  variant="warning"
                  now={base + progress2}
                  key={0}
                  style={{
                    textShadow: "0 0 3px white",
                    backgroundImage:
                      "linear-gradient(lightgreen, mediumspringgreen)",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  label={`${reserved} reserved*`}
                />
                <ProgressBar
                  variant="warning"
                  now={progress}
                  key={1}
                  style={{
                    textShadow: "0 0 3px white",
                    backgroundImage: "linear-gradient(orange, gold)",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  label={`${minted} sold`}
                />
                <ProgressBar
                  striped
                  variant="success"
                  now={remaining}
                  key={2}
                />
                {/*{progress2 ? (*/}
                {/*  <ProgressBar*/}
                {/*    now={progress2}*/}
                {/*    key={3}*/}
                {/*    style={{*/}
                {/*      textShadow: "0 0 3px white",*/}
                {/*      backgroundImage:*/}
                {/*        "linear-gradient(lightgreen, mediumspringgreen)",*/}
                {/*      color: "black",*/}
                {/*      fontWeight: "bold",*/}
                {/*    }}*/}
                {/*  />*/}
                {/*) : null}*/}
              </ProgressBar>
              {price ? (
                <div>
                  <div className={"underProgress centered"}>
                    {minted < maxForSale ? (
                      <span>
                        Total supply: <b>{maxSupply}</b> | Left for sale:{" "}
                        <b>{maxForSale - minted - 100}</b>
                        <br />
                        Price on Polygon: <b>{price}</b>{" "}
                        <span style={{ fontSize: "80%" }}> MATIC</span> | Price
                        on Ethereum: <b>{ethPrice}</b>{" "}
                        <span style={{ fontSize: "80%" }}> ETH</span>
                      </span>
                    ) : (
                      "Sold out."
                    )}
                  </div>
                  <div className={"starred centered"}>
                    * 350 tokens have been won by community members in the
                    Goldmine game, the ARG contests, and a few giveaways.
                    <br />
                    {reserved - 350} tokens are kept in the treasury wallet to
                    be used for future giveaways, sales and other actions.
                  </div>
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
        ) : amountTaken ? (
          <Row>
            <Col lg={2} />
            <Col lg={8}>
              <div
                className={"textBlock centered"}
                style={{ padding: 16, backgroundColor: "#cf9" }}
              >
                Congratulations, you get {amountTaken} E2GT
                <div className={"trade"}>
                  You can check the minting transaction{" "}
                  <Ab
                    link={`https://${
                      chainId === 42 ? "mumbai." : ""
                    }polygonscan.com/tx/${mintingTx}`}
                    label={"here"}
                  />
                  .<br />
                  We also sent you 1{" "}
                  <span style={{ fontSize: "80%" }}>MATIC</span>. Enjoy it :)
                </div>
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

        {minted < maxForSale ? (
          <Row>
            <Col style={{ textAlign: "right" }}>
              <FormGroup
                name={"amount"}
                thiz={this}
                placeholder={"Amount of tokens"}
                divCls={"shortInput floatRight"}
              />
              {total > 0 ? (
                <div style={{ clear: "both" }}>
                  Total price {total}{" "}
                  <span style={{ fontSize: "80%" }}>{currency}</span>
                </div>
              ) : null}
            </Col>
            <Col className={"mt4"}>
              {submitting ? (
                <div>
                  <div className={"submittingNow"}>
                    <Loading
                      style={{
                        width: 50,
                        height: 50,
                        float: "left",
                        marginRight: 6,
                      }}
                      variant={"warning"}
                      animation={"grow"}
                    />
                    <div className={"pulsate"}>{submitting}</div>
                  </div>
                </div>
              ) : (
                <div>
                  <Button
                    size={"lg"}
                    disabled={submitting}
                    onClick={buyFunc}
                    className={"shortInput"}
                    variant={"success"}
                  >
                    Buy now!
                  </Button>
                  <div className={"balance"}>
                    Your balance: <b>{walletBalance}</b>{" "}
                    <span style={{ fontSize: "80%" }}>{currency}</span>
                  </div>
                </div>
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
        {/*<Row>*/}
        {/*  <Col lg={2} />*/}
        {/*  <Col lg={8}>*/}
        {/*    <h2 style={{ marginTop: 32 }}>*/}
        {/*      Price evolution in <span style={{ fontSize: "80%" }}>MATIC</span>{" "}*/}
        {/*      by tokenId*/}
        {/*    </h2>*/}
        {/*    <div className={"padded"}>*/}
        {/*      <ProgressBar>*/}
        {/*        <ProgressBar*/}
        {/*          variant="warning"*/}
        {/*          now={35}*/}
        {/*          key={2}*/}
        {/*          style={{*/}
        {/*            textShadow: "0 0 3px white",*/}
        {/*            backgroundImage:*/}
        {/*              "linear-gradient(lightgreen, mediumspringgreen)",*/}
        {/*            color: "black",*/}
        {/*            fontWeight: "bold",*/}
        {/*          }}*/}
        {/*          label={"0"}*/}
        {/*        />*/}

        {/*        <ProgressBar*/}
        {/*          variant="warning"*/}
        {/*          now={25}*/}
        {/*          key={2}*/}
        {/*          style={{*/}
        {/*            textShadow: "0 0 3px white",*/}
        {/*            backgroundImage: "linear-gradient(yellow, gold)",*/}
        {/*            color: "black",*/}
        {/*            fontWeight: "bold",*/}
        {/*          }}*/}
        {/*          label={"100"}*/}
        {/*        />*/}

        {/*        <ProgressBar*/}
        {/*          variant="warning"*/}
        {/*          now={10}*/}
        {/*          key={2}*/}
        {/*          style={{*/}
        {/*            textShadow: "0 0 3px white",*/}
        {/*            backgroundImage: "linear-gradient(gold, orange)",*/}
        {/*            color: "black",*/}
        {/*            fontWeight: "bold",*/}
        {/*          }}*/}
        {/*          label={"200"}*/}
        {/*        />*/}

        {/*        <ProgressBar*/}
        {/*          variant="warning"*/}
        {/*          now={10}*/}
        {/*          key={2}*/}
        {/*          style={{*/}
        {/*            textShadow: "0 0 3px white",*/}
        {/*            backgroundImage: "linear-gradient(orange, crimson)",*/}
        {/*            color: "black",*/}
        {/*            fontWeight: "bold",*/}
        {/*          }}*/}
        {/*          label={"300"}*/}
        {/*        />*/}

        {/*        <ProgressBar*/}
        {/*          variant="warning"*/}
        {/*          now={10}*/}
        {/*          key={2}*/}
        {/*          style={{*/}
        {/*            textShadow: "0 0 3px white",*/}
        {/*            backgroundImage: "linear-gradient(crimson, brown)",*/}
        {/*            color: "black",*/}
        {/*            fontWeight: "bold",*/}
        {/*          }}*/}
        {/*          label={"400"}*/}
        {/*        />*/}

        {/*        <ProgressBar*/}
        {/*          variant="warning"*/}
        {/*          now={10}*/}
        {/*          key={2}*/}
        {/*          style={{*/}
        {/*            textShadow: "0 0 3px white",*/}
        {/*            backgroundImage: "linear-gradient(crimson, red)",*/}
        {/*            color: "black",*/}
        {/*            fontWeight: "bold",*/}
        {/*          }}*/}
        {/*          label={"500"}*/}
        {/*        />*/}
        {/*      </ProgressBar>*/}
        {/*      /!*</div>*!/*/}

        {/*      /!*<div className={"padded"}>*!/*/}
        {/*      <ProgressBar>*/}
        {/*        <ProgressBar*/}
        {/*          variant="warning"*/}
        {/*          now={35}*/}
        {/*          key={2}*/}
        {/*          style={{*/}
        {/*            textShadow: "0 0 3px white",*/}
        {/*            backgroundImage: "linear-gradient(#f0f0f0, #e0e0e0)",*/}
        {/*            color: "black",*/}
        {/*            fontWeight: "bold",*/}
        {/*          }}*/}
        {/*          label={"0-350"}*/}
        {/*        />*/}

        {/*        <ProgressBar*/}
        {/*          variant="warning"*/}
        {/*          now={25}*/}
        {/*          key={2}*/}
        {/*          style={{*/}
        {/*            textShadow: "0 0 3px white",*/}
        {/*            backgroundImage: "linear-gradient(#e8e8e8, #d8d8d8)",*/}
        {/*            color: "black",*/}
        {/*            fontWeight: "bold",*/}
        {/*          }}*/}
        {/*          label={"351-600"}*/}
        {/*        />*/}

        {/*        <ProgressBar*/}
        {/*          variant="warning"*/}
        {/*          now={10}*/}
        {/*          key={2}*/}
        {/*          style={{*/}
        {/*            textShadow: "0 0 3px white",*/}
        {/*            backgroundImage: "linear-gradient(#e0e0e0, #d0d0d0)",*/}
        {/*            color: "black",*/}
        {/*            fontWeight: "bold",*/}
        {/*          }}*/}
        {/*          label={"601-700"}*/}
        {/*        />*/}

        {/*        <ProgressBar*/}
        {/*          variant="warning"*/}
        {/*          now={10}*/}
        {/*          key={2}*/}
        {/*          style={{*/}
        {/*            textShadow: "0 0 3px white",*/}
        {/*            backgroundImage: "linear-gradient(#d8d8d8, #c0c0c0)",*/}
        {/*            color: "black",*/}
        {/*            fontWeight: "bold",*/}
        {/*          }}*/}
        {/*          label={"701-800"}*/}
        {/*        />*/}

        {/*        <ProgressBar*/}
        {/*          variant="warning"*/}
        {/*          now={10}*/}
        {/*          key={2}*/}
        {/*          style={{*/}
        {/*            textShadow: "0 0 3px white",*/}
        {/*            backgroundImage: "linear-gradient(#c8c8c8, #b8b8b8)",*/}
        {/*            color: "black",*/}
        {/*            fontWeight: "bold",*/}
        {/*          }}*/}
        {/*          label={"801-900"}*/}
        {/*        />*/}

        {/*        <ProgressBar*/}
        {/*          variant="warning"*/}
        {/*          now={10}*/}
        {/*          key={2}*/}
        {/*          style={{*/}
        {/*            textShadow: "0 0 3px white",*/}
        {/*            backgroundImage: "linear-gradient(#c0c0c0, #b0b0b0)",*/}
        {/*            color: "black",*/}
        {/*            fontWeight: "bold",*/}
        {/*          }}*/}
        {/*          label={"901-1000"}*/}
        {/*        />*/}
        {/*      </ProgressBar>*/}
        {/*    </div>*/}
        {/*  </Col>*/}
        {/*  <Col lg={2} />*/}
        {/*</Row>*/}
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
        {/*      <Button size={"lg"} onClick={this.withdraw}>*/}
        {/*        Get!*/}
        {/*      </Button>*/}
        {/*    </Col>*/}
        {/*  </Row>*/}
        {/*) : null}*/}

        {/*{isOwner ? (*/}
        {/*  <Row style={{ marginTop: 48 }}>*/}
        {/*    <Col style={{ textAlign: "right" }}>*/}
        {/*      <FormGroup*/}
        {/*        name={"quantity"}*/}
        {/*        thiz={this}*/}
        {/*        placeholder={"Quantity"}*/}
        {/*        divCls={"shortInput floatRight"}*/}
        {/*      />*/}
        {/*      <FormGroup*/}
        {/*        name={"index"}*/}
        {/*        thiz={this}*/}
        {/*        placeholder={"Index"}*/}
        {/*        divCls={"shortInput floatRight"}*/}
        {/*      />*/}
        {/*    </Col>*/}
        {/*    <Col>*/}
        {/*      <Button size={"lg"} onClick={this.distribute}>*/}
        {/*        Distribute extra tokens*/}
        {/*      </Button>*/}
        {/*    </Col>*/}
        {/*  </Row>*/}
        {/*) : null}*/}
        <Row>
          <Col>
            <div style={{ height: 100 }} />
          </Col>
        </Row>
      </div>
    );
  }
}
