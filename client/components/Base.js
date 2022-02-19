import PropTypes from "prop-types";

import Common from "./Common";
import clientApi from "../utils/ClientApi";

class Base extends Common {
  constructor(props) {
    super(props);
    this.bindMany(["setStore", "request", "setTimeout", "endTimeout"]);
    this.Store = this.props.Store;
  }

  request(api, method, params = {}, query = {}) {
    return clientApi.request(api, method, params, query);
  }

  setStore(...params) {
    this.props.setStore(...params);
  }

  componentWillUnmount() {
    if (this.timerId !== undefined) {
      clearTimeout(this.timerId);
      this.timerId = undefined;
    }
  }

  async waitForWeb3() {
    while (!this.Store.connectedWallet && !this.Store.notConnected) {
      await this.sleep(100);
    }
  }

  async waitForContracts() {
    await this.waitForWeb3();
    while (!this.Store.contracts) {
      await this.sleep(100);
    }
  }

  isMobile() {
    return window.innerWidth < 990;
  }

  setTimeout(func, time) {
    this.timerId = setTimeout(() => this.endTimeout(func), time);
  }

  endTimeout(func, time) {
    clearTimeout(this.timerId);
    this.timerId = null;
    try {
      func();
    } catch (e) {
      // probably component has been dismounted
    }
  }

  async sleep(millis) {
    // eslint-disable-next-line no-undef
    return new Promise((resolve) => setTimeout(resolve, millis));
  }

  render() {
    return <div />;
  }
}

Base.propTypes = {
  Store: PropTypes.object,
  setStore: PropTypes.func,
};

export default Base;
