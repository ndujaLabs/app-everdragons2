class CreateInitialTables extends require("../Migration") {
  async body(index, database) {
    let done = false;
    let sql = await this.sql();

    // let result = await sql.select('datname').from('pg_database')
    // let found
    // for (let row of result) {
    //   if (row.datname === database) {
    //     found = true
    //     break
    //   }
    // }
    // if (!found) {
    //   await sql.raw('create database ' + database)
    //   done = true
    //   console.info('Database created.')
    // }

    // await sql.schema.dropTableIfExists('codes')
    // await sql.schema.dropTableIfExists('unused_codes')
    // await sql.schema.dropTableIfExists('tetris_players')

    if (!(await sql.schema.hasTable("codes"))) {
      await sql.schema.createTable("codes", (t) => {
        t.increments("id").primary();
        t.integer("type_index");
        t.string("full_username").notNullable();
        t.string("auth_code").notNullable().index();
        t.string("redeem_code").index();
        t.timestamp("created_at").defaultTo(sql.fn.now());
        t.timestamp("redeem_code_set_at");
        t.timestamp("redeem_code_used_at");
        t.string("redeemer").index();
      });
      done = true;
      console.info('Table "codes" created.');
    }

    if (!(await sql.schema.hasTable("unused_codes"))) {
      await sql.schema.createTable("unused_codes", (t) => {
        t.integer("type_index");
        t.string("full_username").notNullable();
        t.string("auth_code").notNullable();
        t.string("redeem_code");
        t.timestamp("created_at").defaultTo(sql.fn.now());
        t.string("user_discord_id");
      });
      done = true;
      console.info('Table "unused_codes" created.');
    }

    // if (!(await sql.schema.hasTable('banned_users'))) {
    //   await sql.schema.createTable('banned_users', t => {
    //     t.string('full_username').notNullable()
    //     t.string('redeem_code')
    //     t.timestamp('created_at').defaultTo(sql.fn.now())
    //     t.string('user_discord_id').index()
    //   })
    //   done = true
    //   console.info('Table "banned_users" created.')
    // }

    // await sql.schema.dropTableIfExists('tetris_players')
    if (!(await sql.schema.hasTable("tetris_players"))) {
      await sql.schema.createTable("tetris_players", (t) => {
        t.string("user_discord_id").index();
        t.bigInteger("game_started_at");
      });
      done = true;
      console.info('Table "tetris_players" created.');
    }

    if (!(await sql.schema.hasColumn("codes", "user_discord_id"))) {
      await sql.schema.alterTable("codes", (t) => {
        t.string("user_discord_id");
      });
      done = true;
      console.info('Add "user_discord_id" to "codes".');
    }

    if (!(await sql.schema.hasColumn("codes", "digits"))) {
      await sql.schema.alterTable("codes", (t) => {
        t.string("digits");
      });
      done = true;
      console.info('Add "digits" to "codes".');
    }

    if (!(await sql.schema.hasColumn("codes", "solved"))) {
      await sql.schema.alterTable("codes", (t) => {
        t.boolean("solved");
      });
      done = true;
      console.info('Add "solved" to "codes".');
    }

    if (!(await sql.schema.hasColumn("codes", "signed_hash"))) {
      await sql.schema.alterTable("codes", (t) => {
        t.text("auth_code_bytes32");
        t.text("signed_hash");
        t.text("signature");
        t.boolean("redeemed");
      });
      done = true;
      console.info('Add columns to "codes".');
    }

    if (!(await sql.schema.hasColumn("codes", "token_id"))) {
      await sql.schema.alterTable("codes", (t) => {
        t.integer("token_id");
      });
      done = true;
      console.info('Add "token_id" to "codes".');
    }

    if (!(await sql.schema.hasColumn("unused_codes", "signed_hash"))) {
      await sql.schema.alterTable("unused_codes", (t) => {
        t.text("auth_code_bytes32");
        t.text("signed_hash");
        t.text("signature");
      });
      done = true;
      console.info('Add columns to "unused_codes".');
    }

    if (false) {
      // to be launched at the end of the season
      const currentSeason = parseInt(process.env.CURRENT_SEASON || 0) - 1;
      if (currentSeason > 0) {
        await sql.schema.raw(
          `INSERT INTO unused_codes
           (type_index, full_username, auth_code, redeem_code, created_at, user_discord_id, redeemer, auth_code_bytes32, signed_hash, signature)
           SELECT type_index, full_username, auth_code, redeem_code, created_at, user_discord_id, redeemer, auth_code_bytes32, signed_hash, signature
           FROM codes
           WHERE type_index = ${currentSeason - 1}`
        );
        await sql("codes")
          .where({
            type_index: currentSeason - 1,
            redeem_code_used_at: null,
          })
          .del();
        console.info("Archiving unused code for season", currentSeason - 1);
      }
    }

    // if (!(await sql.schema.hasTable('seasons'))) {
    //   await sql.schema.createTable('seasons', t => {
    //     t.integer('current_season')
    //     t.timestamp('season_one_at')
    //     t.timestamp('season_two_at')
    //     t.timestamp('season_three_at')
    //     t.timestamp('season_four_at')
    //   })
    //   done = true
    //   console.info('Table "seasons" created.')
    // }

    if (!done) {
      console.info("No change required for this migration");
    }
  }
}

module.exports = CreateInitialTables;
