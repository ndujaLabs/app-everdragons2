// eslint-disable-next-line no-undef
const { BrowserRouter, Route, Switch } = ReactRouterDOM;

// eslint-disable-next-line no-undef
const { Modal, Button } = ReactBootstrap;

const ethers = require("ethers");
import ls from "local-storage";
import { Contract } from "@ethersproject/contracts";
import config from "../config";
import clientApi from "../utils/ClientApi";
import Common from "./Common";
import Header from "./Header";
import Home from "./Home";
import Error404 from "./Error404";
import Footer from "./Footer";
import Welcome from "./Welcome";
import Token from "./Token";

export default class App extends Common {
  constructor(props) {
    super(props);
    let localStore = JSON.parse(ls("localStore") || "{}");

    this.state = {
      Store: Object.assign(
        {
          content: {},
          editing: {},
          temp: {},
          menuVisibility: false,
          config,
          width: this.getWidth(),
          pathname: window.location.pathname,
        },
        localStore
      ),
    };

    this.bindMany([
      "handleClose",
      "handleShow",
      "setStore",
      "getContract",
      "updateDimensions",
      "showModal",
      "setWallet",
      "connect",
    ]);
  }

  getWidth() {
    // let width = 2 * (window.innerWidth - 100) / 6
    // if (window.innerWidth < 800) {
    //   width = window.innerWidth - 50
    // }
    return window.innerWidth;
  }

  updateDimensions() {
    this.setStore({
      width: this.getWidth(),
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  async componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
    if (this.state.Store.connectedBefore) {
      await this.connect(true);
    }
  }

  async setWallet() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const chainId = (await provider.getNetwork()).chainId;
      const connectedWallet = await signer.getAddress();

      const { contract, connectedNetwork, networkNotSupported } =
        this.getContract(config, chainId, provider);

      this.setStore({
        provider,
        signer,
        connectedWallet,
        chainId,
        contract,
        connectedNetwork,
        networkNotSupported,
      });
      this.setStore(
        {
          connectedBefore: true,
        },
        true
      );
      clientApi.setConnectedWallet(connectedWallet, chainId);
    } catch (e) {
      // console.log(e)
      window.location.reload();
    }
  }

  async connect(dontShowError) {
    if (typeof window.ethereum !== "undefined") {
      if (await window.ethereum.request({ method: "eth_requestAccounts" })) {
        window.ethereum.on("accountsChanged", () => window.location.reload());
        window.ethereum.on("chainChanged", () => window.location.reload());
        window.ethereum.on("disconnect", () => window.location.reload());

        this.setWallet();
      }
    } else {
      // if (!dontShowError) {
      //   this.showModal(
      //     'No wallet extention found',
      //     'Please, activate your wallet and reload the page',
      //     'Ok'
      //   )
      // }
    }
  }

  showModal(modalTitle, modalBody, modalClose, secondButton, modalAction) {
    this.setStore({
      modalTitle,
      modalBody,
      modalClose,
      secondButton,
      modalAction,
      showModal: true,
    });
  }

  getContract(config, chainId, web3Provider) {
    let contract;
    let networkNotSupported = false;
    let connectedNetwork = null;

    if (config.address[chainId]) {
      contract = new Contract(
        config.address[chainId],
        config.abi,
        web3Provider
      );
      for (let name in config.supported) {
        if (config.supported[name] === chainId) {
          connectedNetwork = name;
        }
      }
    } else {
      networkNotSupported = true;
    }
    return {
      contract,
      connectedNetwork,
      networkNotSupported,
    };
  }

  setStore(newProps, storeItLocally) {
    let store = this.state.Store;
    let localStore = JSON.parse(ls("localStore") || "{}");
    let saveLocalStore = false;
    for (let i in newProps) {
      if (newProps[i] === null) {
        if (storeItLocally) {
          delete localStore[i];
          saveLocalStore = true;
        }
        delete store[i];
      } else {
        if (storeItLocally) {
          localStore[i] = newProps[i];
          saveLocalStore = true;
        }
        store[i] = newProps[i];
      }
    }
    this.setState({
      Store: store,
    });
    if (saveLocalStore) {
      ls("localStore", JSON.stringify(localStore));
    }
  }

  render() {
    const Store = this.state.Store;

    return (
      <BrowserRouter>
        <Header Store={Store} setStore={this.setStore} connect={this.connect} />
        <main>
          <Switch>
            <Route exact path="/">
              <Home Store={Store} setStore={this.setStore} />
            </Route>
            <Route exact path="/welcome">
              <Welcome Store={Store} setStore={this.setStore} />
            </Route>
            <Route exact path="/token">
              <Token Store={Store} setStore={this.setStore} />
            </Route>
            <Route exact path="*">
              <Error404 Store={Store} setStore={this.setStore} />
            </Route>
          </Switch>
          <Footer />
        </main>
        {Store.showModal ? (
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Title>{Store.modalTitle}</Modal.Title>
            </Modal.Header>

            <Modal.Body>{Store.modalBody}</Modal.Body>

            <Modal.Footer>
              <Button
                onClick={() => {
                  this.setStore({ showModal: false });
                }}
              >
                {Store.modalClose || "Close"}
              </Button>
              {this.state.secondButton ? (
                <Button
                  onClick={() => {
                    Store.modalAction();
                    this.setStore({ showModal: false });
                  }}
                  bsStyle="primary"
                >
                  {Store.secondButton}
                </Button>
              ) : null}
            </Modal.Footer>
          </Modal.Dialog>
        ) : null}
      </BrowserRouter>
    );
  }
}
