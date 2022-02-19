class CreatePurchases extends require("../Migration") {
  async body(index, database) {
    let done = false;
    let sql = await this.sql();

    console.info();

    if (!(await sql.schema.hasTable("purchases"))) {
      await sql.schema.createTable("purchases", (t) => {
        t.increments("id").primary();
        t.string("recipient");
        t.integer("amount");
        t.bigInteger("cost");
        t.integer("chain_id");
        t.text("hash");
        t.text("signature");
        t.text("minting_tx");
        t.text("transfer_tx");
        t.timestamp("created_at").defaultTo(sql.fn.now());
        t.timestamp("signed_at");
        t.timestamp("confirmed_at");
        t.timestamp("minted_at");
      });
      done = true;
      console.info('Table "purchases" created.');
    }

    // if (!(await sql.schema.hasColumn("purchases", "discord_user_username"))) {
    //   await sql.schema.alterTable("purchases", (t) => {
    //     t.string("discord_user_username");
    //     t.string("discord_user_discriminator");
    //   });
    //   done = true;
    //   console.info('Add discord username and discriminator to "purchases".');
    // }

    if (!done) {
      console.info("No change required for this migration");
    }
  }
}

module.exports = CreatePurchases;
