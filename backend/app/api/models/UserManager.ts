import connection from "../../lib/db";
import UserModel from "./UserModel";

class UserManager {
  private connection = connection;
  private tableName = "users";
  private data;

  findAll() {
    this.connection.query(`SELECT * FROM ${this.tableName}`, (err,rows) => {
      if(err) throw err;
      this.data = rows;
      return this.data;
    });
  }

  hydrateObjects(rows) {
    this.data = [];
    rows.forEach( (row) => {
      this.data.push(new UserModel(row));
  });
  }
}

export default UserManager;
