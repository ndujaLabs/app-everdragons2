const Sql = require("../db/Sql");

class DbManager extends Sql {
  // for reference
  // https://knexjs.org

  async getIWhitelisted() {
    return (
      await (await this.sql())
        .select(
          "id",
          "discord_user_id",
          "discord_user_username",
          "discord_user_discriminator",
          "redeemer",
          "created_at"
        )
        .from("investments")
    ).rows;
  }

  async getNonce(chain_id, recipient, amount, cost) {
    const sql = await this.sql();
    return sql
      .insert({
        chain_id,
        recipient,
        amount,
        cost,
      })
      .returning("id")
      .into("purchases");
  }

  async saveHashAndSignature(id, hash, signature) {
    const sql = await this.sql();
    await sql("purchases")
      .where({
        id,
      })
      .update({
        hash,
        signature,
        signed_at: sql.fn.now(),
      });
    return true;
  }

  async confirmPurchase(id) {
    const sql = await this.sql();
    await sql("purchases")
      .where({
        id,
      })
      .update({
        confirmed_at: sql.fn.now(),
      });
    return true;
  }

  async confirmMint(id, minting_tx) {
    const sql = await this.sql();
    await sql("purchases")
      .where({
        id,
      })
      .update({
        minting_tx,
        minted_at: sql.fn.now(),
      });
    return true;
  }

  async getInfo(id) {
    const sql = await this.sql();
    return (
      await sql.select("*").from("purchases").where({
        id,
      })
    )[0];
  }

  async newWhitelisted(discordUser, redeemer) {
    const sql = await this.sql();
    const exist = await sql
      .select("*")
      .from("whitelist")
      .where({
        discord_user_id: discordUser.id,
      })
      .orWhere({
        redeemer,
      });

    if (exist.length) {
      throw new Error("User/wallet has already submitted a solution");
    }
    return sql
      .insert({
        discord_user: JSON.stringify(discordUser),
        discord_user_id: discordUser.id,
        discord_user_username: discordUser.username,
        discord_user_discriminator: discordUser.discriminator,
        redeemer,
      })
      .returning("id")
      .into("whitelist");
  }
}

let dbManager;
if (!dbManager) {
  dbManager = new DbManager();
}
module.exports = dbManager;
