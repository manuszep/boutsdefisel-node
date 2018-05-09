import Manager from "./Manager";
import UserModel from "./UserModel";

class UserManager extends Manager {
  protected tableName = "users";
  private data;

  getModel(data?:{ [key: string]: any }):UserModel {
    return new UserModel(data);
  }

  findAll() {
    return this.query(`SELECT * FROM ${this.tableName}`, null, result => {
      this.data = result;
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

export default new UserManager();
