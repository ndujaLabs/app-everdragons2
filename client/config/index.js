let isDev;
if (typeof window !== "undefined") {
  isDev = /localhost/.test(window.location.host);
} else if (typeof process !== undefined && process.env) {
  isDev = process.env.NODE_ENV === "development";
}

const contracts = Object.assign(
  require("./deployed.json"),
  require("./deployedProduction.json")
);

const config = {
  constants: {
    "Localhost 8545": isDev ? 1337 : undefined,
    MUMBAI: 80001,
    MATIC: 137,
  },
  supported: {
    "Localhost 8545": isDev ? 1337 : undefined,
    "Mumbai Matic Testnet": 80001,
    "Matic Network": 137,
  },
  supportedId: {
    137: {
      chainId: "0x" + Number(137).toString(16),
      chainName: "Polygon PoS (ex-Matic)",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: ["https://polygon-rpc.com"],
      blockExplorerUrls: ["https://polygonscan.com"],
    },
    80001: {
      chainId: "0x" + Number(80001).toString(16),
      chainName: "Mumbai Polygon Testnet",
      rpcUrls: ["https://rpc-mumbai.matic.today"],
      blockExplorerUrls: ["https://mumbai-explorer.matic.today"],
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
    },
    1337: isDev
      ? {
          chainId: "0x" + Number(1337).toString(16),
          chainName: "Localhost 8545",
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: ["http://localhost:8545"],
          blockExplorerUrls: [],
        }
      : undefined,
  },
  openSeaLink: {
    80001:
      "https://testnets.opensea.io/collection/everdragons2-genesis-token-ip1kxjwrjn",
    137: "",
  },
  contracts,
  abi: require("./ABIs.json").contracts,
};

module.exports = config;
