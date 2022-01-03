class CreateInitialTables extends require("../Migration") {
  async body(index, database) {
    let done = false;
    let sql = await this.sql();

    console.info();

    if (!(await sql.schema.hasTable("whitelist"))) {
      await sql.schema.createTable("whitelist", (t) => {
        t.increments("id").primary();
        t.text("discord_user").notNullable();
        t.string("discord_user_id").notNullable().unique();
        t.string("redeemer").notNullable().unique();
        t.timestamp("created_at").defaultTo(sql.fn.now());
      });
      done = true;
      console.info('Table "whitelist" created.');
    }

    if (!(await sql.schema.hasColumn("whitelist", "discord_user_username"))) {
      await sql.schema.alterTable("whitelist", (t) => {
        t.string("discord_user_username");
        t.string("discord_user_discriminator");
      });
      done = true;
      console.info('Add discord username and discriminator to "whitelist".');
    }

    if (!done) {
      console.info("No change required for this migration");
    }
  }
}

module.exports = CreateInitialTables;
