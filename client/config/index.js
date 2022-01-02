const Everdragons2 = require("./EverDragons2.json");

let isDev;
if (typeof window !== "undefined") {
  isDev = /localhost/.test(window.location.host);
} else if (typeof process !== undefined && process.env) {
  isDev = process.env.NODE_ENV === "development";
}

const config = {
  constants: {
    // GOERLI: 5,
    MAINNET: 1,
    GANACHE: 1337,
    MUMBAI: 80001,
    MATIC: 137,
  },
  supported: {
    Ganache: 1337,
    // 'Goerli Testnet': 5,
    Ethereum: 1,
    // 'Mumbai Matic Testnet': 80001,
    // 'Matic Network': 137
  },
  supportedId: {
    1337: isDev,
    // 5: true,
    137: true,
    // 80001: true
  },
  address: {
    1337: "0x32EEce76C2C2e8758584A83Ee2F522D4788feA0f",
    5: "0x7b647966E070623C9CC96C3d7f635E47dAAEaBaF",
    1: "0xEEB9931Fad89cDa0d40289da0CA13a92ef54D31A",
    80001: "0x9F0F2fC519F3169C51081d54D9f8E484BDeC36F7",
    137: "0x9F0F2fC519F3169C51081d54D9f8E484BDeC36F7",
  },
  abi: Everdragons2.abi,
};

module.exports = config;
