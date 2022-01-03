const isLocal = process.platform === "darwin";
const env = process.env;

let pgConf;
let pgConfMaster;

if (process.env.POSTGRES_PORT_5432_TCP_ADDR) {
  // docker environment
  pgConf = pgConfMaster = {
    host: process.env.POSTGRES_PORT_5432_TCP_ADDR,
    port: process.env.POSTGRES_PORT_5432_TCP_PORT,
  };
} else {
  pgConf = pgConfMaster = {
    host: "127.0.0.1",
    port: 5432,
  };
}

const isProduction = env.NODE_ENV === "production";

const pgData = {
  host: process.env.RDS_WRITER_ENDPOINT || pgConfMaster.host,
  port: pgConfMaster.port,
  user: process.env.POSTGRES_USER || process.env.POSTGRES_ENV_POSTGRES_USER,
  password:
    process.env.POSTGRES_PASSWORD || process.env.POSTGRES_ENV_POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB || "ed2arg",
};

console.log(pgData);

module.exports = {
  isLocal,
  pgConf,
  pgConfMaster,
  pgData,
  isProduction,
  coordinates: {
    0: [37.460748, -121.634391],
    1: [50.412943, 130.420468],
    2: [32.016318, 130.938638],
    3: [76.555538, -109.168444],
    4: [-24.411339, 137.408074],
    5: [6.526514, 48.867394],
    6: [11.235225, 159.724462],
    7: [36.964837, -111.308187],
    8: [-2.656187, -67.611479],
    9: [39.151746, 16.39408],
  },
};
