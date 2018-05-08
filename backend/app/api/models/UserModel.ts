import Model from "./Model";
import connection from "../../lib/db";

class UserModel extends Model {
  protected tableName = "users";

  constructor(data?:{ [key: string]: any }) {
    super();

    if (typeof data !== "undefined") {
      this.username = data.username;
      this.email = data.email;
    }
  }

  private _username:string;

  get username():string {
    return this._username;
  }

  set username(username:string) {
    this.setDirty("username");
    this._username = username;
  }

  private _email:string;

  get email():string {
    return this._email;
  }

  set email(email:string) {
    this.setDirty("email");
    this._email = email;
  }

  serialize() {
    return {
      "id": this.id,
      "username": this.username,
      "email": this.email
    }
  }

  create():Promise<number> {
    return new Promise ((resolve, reject) => {
      connection.query(`INSERT INTO ${this.tableName} SET ?`, this.serialize())
        .then(result => {
          this.id = result.insertId;
          this.setClean();
          resolve(this.id)
        })
        .catch(function(err) {
          reject(err)
        });
      })
  }

  update() {
    let setters = "";
    let values = [];

    for (let key in this._dirty) {
      let value = this._dirty[key];
      setters += ` ${key} = ?,`;
      values.push(this[key]);
    }

    connection.query(`UPDATE ${this.tableName} SET${setters.replace(/,\s*$/, "")} Where ID = ${this.id}`,values)
      .then(result => {
        this.setClean();
      })
      .catch(err => {
        throw err;
      });
  }

  delete() {
    connection.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [this.id])
      .then(result => {
        return true;
      })
      .catch(err => {
        throw err;
      });
  }
}

export default UserModel;
