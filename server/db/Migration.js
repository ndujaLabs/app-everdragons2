const Sql = require("./Sql");

class Migration extends Sql {
  constructor(migrationIndex) {
    super();
    this.found = {};
    this.knex = null;
    this.migrationIndex = migrationIndex || 0;
  }

  async exec() {
    await this.body(this.migrationIndex, this.pgData.database);
  }

  async body() {
    // must be implemented in any extending class
  }

  async ifTableHasNot(table, column, callback) {
    let sql = await this.sql();
    if (!(await sql.schema.hasColumn(table, column))) {
      await sql.schema.alterTable(table, callback);
      return true;
    }
  }
}

module.exports = Migration;
