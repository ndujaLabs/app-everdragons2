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
  database: process.env.POSTGRES_DATABASE,
};

module.exports = {
  isLocal,
  pgConf,
  pgConfMaster,
  pgData,
  isProduction,
};
