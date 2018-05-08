import Model from "./Model";

class UserModel extends Model {
  private _username:string;
  protected tableName = "users";

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
    this.connection.query('INSERT INTO users SET ?', this.toKeyValue(), (err, res) => {
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
      `UPDATE users SET${setters.replace(/,\s*$/, "")} Where ID = ${this.id}`,
      values,
      (err, result) => {
        if (err) throw err;
    
        this.setClean();
      }
    );
  }

  delete() {
    this.connection.query(
      'DELETE FROM users WHERE id = ?', [this.id], (err, result) => {
        if (err) throw err;
      }
    );
  }
}

export default UserModel;
