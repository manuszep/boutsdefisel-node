import Model from "./Model";
import { ROLE_USER, ROLE_EDITOR, ROLE_ADMIN, ROLE_COCO } from "../../lib/roles";
import { phoneTransform, phoneReverseTransform } from "../../dataValidation/phoneValidation";

class UserModel extends Model {
  protected tableName = "users";
  private _username:string;
  private _usernameCanonical:string;
  private _email:string;
  private _emailCanonical:string;
  private _enabled:boolean;
  private _locked:boolean;
  private _salt:string;
  private _password:string;
  private _plainPassword:string; // For validation. Do not persist
  private _lastLogin:Date;
  private _confirmationToken:string;
  private _passwordRequestedAt:Date;
  private _role:string;
  private _street:string;
  private _streetNumber:string;
  private _streetBox:string;
  private _city:string;
  private _zip:number;
  private _phone:string;
  private _mobile:string;
  private _mobile2:string;
  private _balance:number;
  private _picture:string;
  private _createdAt:Date;
  private _updatedAt:Date;
  private _deletedAt:Date;

  constructor(data?:{ [key: string]: any }) {
    super();
    this._enabled = false;
    this._locked = false;
    this._role = ROLE_USER;

    this.unserialize(data);
  }

  toString():string {
    return this.username;
  }

  get username():string {return this._username;}
  set username(username:string) {
    if (!this.setPersistableValue("username", username)) return;
    this.usernameCanonical = username.toLowerCase();
  }

  get usernameCanonical():string {return this._usernameCanonical;}
  set usernameCanonical(usernameCanonical:string) {this.setPersistableValue("usernameCanonical", usernameCanonical);}

  get email():string {return this._email;}
  set email(email:string) {
    if (!this.setPersistableValue("email", email)) return;
    this.emailCanonical = email.toLowerCase();
  }

  get emailCanonical():string {return this._emailCanonical;}
  set emailCanonical(emailCanonical:string) {this.setPersistableValue("emailCanonical", emailCanonical);}

  get enabled():boolean {return this._enabled;}
  set enabled(enabled:boolean) {this.setPersistableValue("enabled", enabled);}

  get locked():boolean {return this._locked;}
  set locked(locked:boolean) {this.setPersistableValue("locked", locked);}

  get salt():string {return this._salt;}
  set salt(salt:string) {this.setPersistableValue("salt", salt);}

  get password():string {return this._password;}
  set password(password:string) {this.setPersistableValue("password", password);}

  get plainPassword():string {return this._plainPassword;}
  set plainPassword(plainPassword:string) {
    if (plainPassword === this.plainPassword) return;
    this._plainPassword = plainPassword;
  }

  get lastLogin():Date {return this._lastLogin;}
  set lastLogin(lastLogin:Date) {this.setPersistableValue("lastLogin", lastLogin);}

  get confirmationToken():string {return this._confirmationToken;}
  set confirmationToken(confirmationToken:string) {this.setPersistableValue("confirmationToken", confirmationToken);}

  get passwordRequestedAt():Date {return this._passwordRequestedAt ;}
  set passwordRequestedAt(passwordRequestedAt:Date) {this.setPersistableValue("passwordRequestedAt", passwordRequestedAt);}

  get role():string {return this._role;}
  set role(role:string) {this.setPersistableValue("role", (typeof role !== "undefined") ? role : ROLE_USER);}

  get street():string {return this._street;}
  set street(street:string) {this.setPersistableValue("street", street);}

  get streetNumber():string {return this._streetNumber;}
  set streetNumber(streetNumber:string) {this.setPersistableValue("streetNumber", streetNumber);}

  get streetBox():string {return this._streetBox;}
  set streetBox(streetBox:string) {this.setPersistableValue("streetBox", streetBox);}

  get city():string {return this._city;}
  set city(city:string) {this.setPersistableValue("city", city);}

  get zip():number {return this._zip;}
  set zip(zip:number) {this.setPersistableValue("zip", zip);}

  get phone():string {return phoneTransform(this._phone);}
  set phone(phone:string) {this.setPersistableValue("phone", phoneReverseTransform(phone));}

  get mobile():string {return phoneTransform(this._mobile);}
  set mobile(mobile:string) {this.setPersistableValue("mobile", phoneReverseTransform(mobile));}

  get mobile2():string {return phoneTransform(this._mobile2);}
  set mobile2(mobile2:string) {this.setPersistableValue("mobile2", phoneReverseTransform(mobile2));}

  get balance():number {return this._balance;}
  set balance(balance:number) {this.setPersistableValue("balance", balance);}

  get picture():string {return this._picture;}
  set picture(picture:string) {this.setPersistableValue("picture", picture);}

  get createdAt():Date {return this._createdAt;}
  set createdAt(createdAt:Date) {this.setPersistableValue("createdAt", createdAt);}

  get updatedAt():Date {return this._updatedAt;}
  set updatedAt(updatedAt:Date) {this.setPersistableValue("updatedAt", updatedAt);}

  get deletedAt():Date {return this._deletedAt;}
  set deletedAt(deletedAt:Date) {this.setPersistableValue("deletedAt", deletedAt);}

  serialize() {
    return {
      "id": this._id,
      "username": this._username,
      "usernameCanonical": this._usernameCanonical,
      "email": this._email,
      "emailCanonical": this._emailCanonical,
      "enabled": this._enabled,
      "locked": this._locked,
      "salt": this._salt,
      "password": this._password,
      "lastLogin": this._lastLogin,
      "confirmationToken": this._confirmationToken,
      "passwordRequestedAt": this._passwordRequestedAt,
      "role": this._role,
      "street": this._street,
      "streetNumber": this._streetNumber,
      "streetBox": this._streetBox,
      "city": this._city,
      "zip": this._zip,
      "phone": this._phone,
      "mobile": this._mobile,
      "mobile2": this._mobile2,
      "balance": this._balance,
      "picture": this._picture,
      "createdAt": this._createdAt,
      "updatedAt": this._updatedAt,
      "deletedAt": this._deletedAt
    }
  }

  unserialize(data:{
    "id"?:number,
    "username"?:string,
    "usernameCanonical"?:string,
    "email"?:string,
    "emailCanonical"?:string,
    "enabled"?:boolean,
    "locked"?:boolean,
    "salt"?:string,
    "password"?:string,
    "plainPassword"?:string,
    "lastLogin"?:Date,
    "confirmationToken"?:string,
    "passwordRequestedAt"?:Date,
    "role"?:string,
    "street"?:string,
    "streetNumber"?:string,
    "streetBox"?:string,
    "city"?:string,
    "zip"?:number,
    "phone"?:string,
    "mobile"?:string,
    "mobile2"?:string,
    "balance"?:number,
    "picture"?:string,
    "createdAt"?:Date,
    "updatedAt"?:Date,
    "deletedAt"?:Date
  }) {
    if (typeof data === "undefined") return;
    this.id = data.id;
    this.username = data.username;
    this.usernameCanonical = data.usernameCanonical;
    this.email = data.email;
    this.emailCanonical = data.emailCanonical;
    this.enabled = data.enabled;
    this.locked = data.locked;
    this.salt = data.salt;
    this.password = data.password;
    this.plainPassword = data.plainPassword;
    this.lastLogin = data.lastLogin;
    this.confirmationToken = data.confirmationToken;
    this.passwordRequestedAt = data.passwordRequestedAt;
    this.role = data.role;
    this.street = data.street;
    this.streetNumber = data.streetNumber;
    this.streetBox = data.streetBox;
    this.city = data.city;
    this.zip = data.zip;
    this.phone = data.phone;
    this.mobile = data.mobile;
    this.mobile2 = data.mobile2;
    this.balance = data.balance;
    this.picture = data.picture;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }

  create():Promise<number> {
    this.createdAt = new Date();
    this.updatedAt = new Date();

    return this.query(
      `INSERT INTO ${this.tableName} SET ?`,
      this.serialize())
      .then(result => {
        this.id = result.insertId;
        return this.id;
      });
  }

  update():Promise<any> {
    let setters = "";
    let values = [];

    for (let key in this._dirty) {
      let value = this._dirty[key];
      setters += ` ${key} = ?,`;
      values.push(this[`_${key}`]);
    }

    if (!values.length) throw {code: "NO_CHANGES"};

    this.updatedAt = new Date();

    setters += ` updatedAt = ?,`;
    values.push(new Date());

    return this.query(
      `UPDATE ${this.tableName} SET${setters.replace(/,\s*$/, "")} WHERE id = ${this.id}`,
      values)
      .then(result => {
        return result;
      });
  }

  delete() {
    if (typeof this.deletedAt !== "undefined" && this.deletedAt !== null) throw {code: "ALREADY_DELETED"};
    this.deletedAt = new Date();

    return this.query(
      `UPDATE ${this.tableName} SET deletedAt = ? Where ID = ${this.id}`,
      this.deletedAt)
      .then(result => {
        return result;
      });;
  }
}

export default UserModel;
