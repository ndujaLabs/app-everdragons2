const knex = require("knex");
const Spinner = require("cli-spinner").Spinner;
const _ = require("lodash");

async function sleep(millis) {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setTimeout(resolve, millis));
}

const { pgData } = require("../config");

class Sql {
  constructor() {
    this.pgData = pgData;
  }

  async sql() {
    if (!this.client) {
      const spinner = new Spinner("Waiting for Postgres %s ");
      spinner.setSpinnerString("|/-\\");
      let started = false;
      for (;;) {
        try {
          this.client = knex({
            client: "pg",
            connection: pgData,
          });
          await this.client.raw("select 1+1 as result");
          spinner.stop();
          break;
        } catch (err) {
          if (/database ".*" does not exist/.test(err)) {
            const pgData0 = _.clone(pgData);
            const newDb = pgData0.database;
            delete pgData0.database;
            let tmpClient = knex({
              client: "pg",
              connection: pgData0,
            });
            await tmpClient.raw("create database " + newDb);
          } else {
            // console.error(err);
          }
        }
        await sleep(1000);
        if (!started) {
          spinner.start();
          started = true;
        }
      }
    }
    return this.client;
  }
}

module.exports = Sql;
