import Model from "./Model";

class UserModel extends Model {
  protected tableName = "users";

  constructor(data:{ [key: string]: any }) {
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

  toKeyValue() {
    return {
      "username": this.username,
      "email": this.email
    }
  }

  create():void {
    this.connection.query(`INSERT INTO ${this.tableName} SET ?`, this.toKeyValue(), (err, res) => {
      if(err) throw err;

      this.id = res.insertId;
      this.setClean();
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
    
    this.connection.query(
      `UPDATE ${this.tableName} SET${setters.replace(/,\s*$/, "")} Where ID = ${this.id}`,
      values,
      (err, result) => {
        if (err) throw err;
    
        this.setClean();
      }
    );
  }

  delete() {
    this.connection.query(
      `DELETE FROM ${this.tableName} WHERE id = ?`, [this.id], (err, result) => {
        if (err) throw err;
      }
    );
  }
}

export default UserModel;
