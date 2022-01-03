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

  // EXAMPLE:
  // async updatePlayer(user_discord_id) {
  //   const sql = await this.sql();
  //   await sql("tetris_players")
  //     .where({
  //       user_discord_id,
  //     })
  //     .update({
  //       game_started_at: Date.now(),
  //     });
  // }
}

let dbManager;
if (!dbManager) {
  dbManager = new DbManager();
}
module.exports = dbManager;
