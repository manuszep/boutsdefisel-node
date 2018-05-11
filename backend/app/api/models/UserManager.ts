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

  findOne(id:number):Promise<UserModel> {
    return this.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id], result => {
      this.data = result;

      if (!result.length) {
        throw {code: "NOT_FOUND"};
      }

      const user = new UserModel(this.data[0]);
      user.setClean();
      return user;
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
