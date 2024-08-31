import { pool } from "../config";

export class Model {
  private query: string = '';
  protected table: string;
  protected db = pool;

  constructor(tableName: string) {
    this.table = tableName;
  }

  select() {
    this.query = 'SELECT * FROM ' + this.table;
    return this;
  }

  get() {
    this.query += ";";
    return this.db.query(this.query);
  }
}