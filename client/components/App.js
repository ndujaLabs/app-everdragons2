// eslint-disable-next-line no-undef
const { BrowserRouter, Route, Switch } = ReactRouterDOM;

import PopUp from "./PopUp";

const ethers = require("ethers");
import ls from "local-storage";
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

    let globalFuncs = ["showPopUp"];

    this.bindMany(
      globalFuncs.concat([
        "handleClose",
        "setStore",
        "getContracts",
        "updateDimensions",
        "setWallet",
        "connect",
      ])
    );

    const globals = {};
    for (let f of globalFuncs) {
      globals[f] = this[f];
    }

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
          globals,
        },
        localStore
      ),
    };
  }

  handleClose(event) {
    this.setState({
      modals: {},
    });
    delete this.changes;
  }

  onChanges(value) {
    this.changes = value;
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

      const { contracts, connectedNetwork, networkNotSupported } =
        this.getContracts(config, chainId, provider);

      this.setStore({
        provider,
        signer,
        connectedWallet,
        chainId,
        contracts,
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
      console.error(e);
      // window.location.reload();
    }
  }

  async connect(dontShowError) {
    if (typeof window.ethereum !== "undefined") {
      if (await window.ethereum.request({ method: "eth_requestAccounts" })) {
        window.ethereum.on("accountsChanged", () => window.location.reload());
        window.ethereum.on("chainChanged", () => window.location.reload());
        window.ethereum.on("disconnect", () => window.location.reload());

        await this.setWallet();
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

  showPopUp(params) {
    this.setState({
      modals: Object.assign(params, {
        show: true,
        handleClose: this.handleClose,
        noSave: true,
        closeLabel: "Ok",
      }),
    });
  }

  getContracts(config, chainId, web3Provider) {
    let contracts = {};
    let networkNotSupported = false;
    let connectedNetwork = null;
    let addresses = config.contracts[chainId];
    if (addresses && config.supportedId[chainId]) {
      connectedNetwork = config.supportedId[chainId].chainName;
      for (let contractName in addresses) {
        contracts[contractName] = new ethers.Contract(
          addresses[contractName],
          config.abi[contractName],
          web3Provider
        );
      }
    } else {
      networkNotSupported = true;
    }
    return {
      contracts,
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

  isMobile() {
    return window.innerWidth < 990;
  }

  render() {
    const { modals, Store } = this.state;
    const { show } = modals || {};
    return (
      <BrowserRouter>
        {this.isMobile() ? null : (
          <Header
            Store={Store}
            setStore={this.setStore}
            connect={this.connect}
          />
        )}
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
        {show ? <PopUp modals={modals} /> : null}
      </BrowserRouter>
    );
  }
}
