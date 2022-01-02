const _ = require("lodash");
const fs = require("fs-extra");
const chalk = require("chalk");

async function migrate() {
  let migrations = _.filter(await fs.readdir(__dirname), (e) =>
    /^\d+_/.test(e)
  ).sort((a, b) => {
    let A = parseInt(a.split("_")[0]);
    let B = parseInt(b.split("_")[0]);
    return A > B ? 1 : A < B ? -1 : 0;
  });
  for (let i = 0; i < migrations.length; i++) {
    console.info(
      chalk.grey(
        `Migration #${migrations[i].split(".js")[0].split("_").join("/")}:`
      )
    );
    try {
      const Klass = require(`./${migrations[i]}`);
      let klass = new Klass(i + 1);
      await klass.exec();
    } catch (e) {
      console.error(`Error migrating ${migrations[i]}`);
      console.error(e);
    }
  }
  console.info(chalk.grey("End migrations."));
}

module.exports = migrate;
