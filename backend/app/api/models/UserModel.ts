import Model from "./Model";

class UserModel extends Model {
  protected tableName = "users";

  constructor(data?:{ [key: string]: any }) {
    super();

    if (typeof data !== "undefined") {
      this.id = data.id;
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
    return this.query(
      `INSERT INTO ${this.tableName} SET ?`,
      this.serialize(),
      result => {
        this.id = result.insertId;
        this.setClean();
        return this.id;
    });
  }

  update() {
    let setters = "";
    let values = [];

    for (let key in this._dirty) {
      let value = this._dirty[key];
      setters += ` ${key} = ?,`;
      values.push(this[key]);
    }

    return this.query(
      `UPDATE ${this.tableName} SET${setters.replace(/,\s*$/, "")} Where ID = ${this.id}`,
      values,
      result => {
        this.id = result.insertId;
        this.setClean();
        return this.id;
    });
  }

  delete() {
    return this.query(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [this.id],
      result => {
        return true;
    });
  }
}

export default UserModel;
