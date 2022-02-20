let isDev;
if (typeof window !== "undefined") {
  isDev =
    /localhost/.test(window.location.host) ||
    /stage/.test(window.location.search);
} else if (typeof process !== undefined && process.env) {
  isDev = true;
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
    1: {
      chainId: "0x1",
      chainName: "Ethereum",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: [""],
      blockExplorerUrls: [""],
    },
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
    80001: isDev
      ? {
          chainId: "0x" + Number(80001).toString(16),
          chainName: "Mumbai Polygon Testnet",
          rpcUrls: ["https://rpc-mumbai.matic.today"],
          blockExplorerUrls: ["https://mumbai-explorer.matic.today"],
          nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,
          },
        }
      : null,
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
    42: isDev
      ? {
          chainId: "0x" + Number(42).toString(16),
          chainName: "Kovan",
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: ["https://kovan.etherscan.io"],
          blockExplorerUrls: [],
        }
      : undefined,
  },
  openSeaLink: {
    80001:
      "https://testnets.opensea.io/collection/everdragons2-genesis-token-ip1kxjwrjn",
    137: "https://opensea.io/collection/everdragons2-genesis-token",
  },
  contracts,
  abi: require("./ABIs.json").contracts,
};

module.exports = config;
