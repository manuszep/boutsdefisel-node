import connection from "../../lib/db";

class UserModel {
  private _inDb:boolean = false;
  private _dirty:{ [s: string]: boolean; } = {};
  private _id:number;

  get id():number {
    return this._id;
  }
  
  private _username:string;

  get username():string {
    return this._username;
  }

  set username(username:string) {
    this._dirty["username"] = true;
    this._username = username;
  }
  
  private _email:string;

  get email():string {
    return this._email;
  }

  set email(email:string) {
    this._dirty["email"] = true;
    this._email = email;
  }

  toKeyValue() {
    return {
      "username": this.username,
      "email": this.email
    }
  }
  
  persist() {
    if (this._inDb) {
      return this.update();
    }

    return this.create();
  }

  create() {
    connection.query('INSERT INTO users SET ?', this.toKeyValue(), (err, res) => {
      if(err) throw err;

      this._id = res.insertId;
      this._dirty = {};
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
    
    connection.query(
      `UPDATE users SET${setters.replace(/,\s*$/, "")} Where ID = ${this.id}`,
      values,
      (err, result) => {
        if (err) throw err;
    
        this._dirty = {};
      }
    );
  }

  delete() {
    connection.query(
      'DELETE FROM users WHERE id = ?', [this.id], (err, result) => {
        if (err) throw err;
      }
    );
  }
}

export default UserModel;
