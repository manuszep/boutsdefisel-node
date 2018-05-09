import Model from "./Model";

class UserModel extends Model {
  protected tableName = "users";
  private _username:string;
  private _usernameCanonical:string;
  private _email:string;
  private _emailCanonical:string;
  private _enabled:boolean;
  private _salt:string;
  private _password:string;
  private _plainPassword:string; // For validation. Do not persist
  private _lastLogin:Date;
  private _confirmationToken:string;
  private _passwordRequestedAt:Date;
  private _groups:number[];
  private _createdAt:Date;
  private _updatedAt:Date;
  private _deletedAt:Date;

  constructor(data?:{ [key: string]: any }) {
    super();

    this.enabled = false;

    this.unserialize(data);
  }

  toString():string {
    return this.username;
  }

  get username():string {
    return this._username;
  }

  set username(username:string) {
    if (username === this.username) return;
    this.setDirty("username");
    this._username = username;
    this.usernameCanonical = username.toLowerCase();
  }

  get usernameCanonical():string {
    return this._usernameCanonical;
  }

  set usernameCanonical(usernameCanonical:string) {
    if (usernameCanonical === this.usernameCanonical) return;
    this.setDirty("usernameCanonical");
    this._usernameCanonical = usernameCanonical;
  }

  get email():string {
    return this._email;
  }

  set email(email:string) {
    if (email === this.email) return;
    this.setDirty("email");
    this._email = email;
    this.emailCanonical = email.toLowerCase();
  }

  get emailCanonical():string {
    return this._emailCanonical;
  }

  set emailCanonical(emailCanonical:string) {
    if (emailCanonical === this.emailCanonical) return;
    this.setDirty("emailCanonical");
    this._emailCanonical = emailCanonical;
  }

  get enabled():boolean {
    return this._enabled;
  }

  set enabled(enabled:boolean) {
    if (enabled === this.enabled) return;
    this.setDirty("enabled");
    this._enabled = enabled;
  }

  get salt():string {
    return this._salt;
  }

  set salt(salt:string) {
    if (salt === this.salt) return;
    this.setDirty("salt");
    this._salt = salt;
  }

  get password():string {
    return this._password;
  }

  set password(password:string) {
    if (password === this.password) return;
    this.setDirty("password");
    this._password = password;
  }

  get plainPassword():string {
    return this._plainPassword;
  }

  set plainPassword(plainPassword:string) {
    if (plainPassword === this.plainPassword) return;
    this._plainPassword = plainPassword;
  }

  get lastLogin():Date {
    return this._lastLogin;
  }

  set lastLogin(lastLogin:Date) {
    if (lastLogin === this.lastLogin) return;
    this.setDirty("lastLogin");
    this._lastLogin = lastLogin;
  }

  get confirmationToken():string {
    return this._confirmationToken;
  }

  set confirmationToken(confirmationToken:string) {
    if (confirmationToken === this.confirmationToken) return;
    this.setDirty("confirmationToken");
    this._confirmationToken = confirmationToken;
  }

  get passwordRequestedAt():Date {
    return this._passwordRequestedAt ;
  }

  set passwordRequestedAt(passwordRequestedAt:Date) {
    if (passwordRequestedAt === this.passwordRequestedAt) return;
    this.setDirty("passwordRequestedAt");
    this._passwordRequestedAt = passwordRequestedAt;
  }

  get groups():number[] {
    return this._groups;
  }

  set groups(groups:number[]) {
    if (groups === this.groups) return;
    this.setDirty("groups");
    this._groups = groups;
  }

  get createdAt():Date {
    return this._createdAt;
  }

  set createdAt(createdAt:Date) {
    if (createdAt === this.createdAt) return;
    this._createdAt = createdAt;
  }

  get updatedAt():Date {
    return this._updatedAt;
  }

  set updatedAt(updatedAt:Date) {
    if (updatedAt === this.updatedAt) return;
    this.setDirty("updatedAt");
    this._updatedAt = updatedAt;
  }

  get deletedAt():Date {
    return this._deletedAt;
  }

  set deletedAt(deletedAt:Date) {
    if (deletedAt === this.deletedAt) return;
    this.setDirty("deletedAt")
    this._deletedAt = deletedAt;
  }

  serialize() {
    return {
      "id": this.id,
      "username": this.username,
      "usernameCanonical": this.usernameCanonical,
      "email": this.email,
      "emailCanonical": this.emailCanonical,
      "enabled": this.enabled,
      "salt": this.salt,
      "password": this.password,
      "lastLogin": this.lastLogin,
      "confirmationToken": this.confirmationToken,
      "passwordRequestedAt": this.passwordRequestedAt,
      "groups": this.groups,
      "createdAt": this.createdAt,
      "updatedAt": this.updatedAt,
      "deletedAt": this.deletedAt
    }
  }

  unserialize(data:{
    "id"?:number,
    "username"?:string,
    "usernameCanonical"?:string,
    "email"?:string,
    "emailCanonical"?:string,
    "enabled"?:boolean,
    "salt"?:string,
    "password"?:string,
    "plainPassword"?:string,
    "lastLogin"?:Date,
    "confirmationToken"?:string,
    "passwordRequestedAt"?:Date,
    "groups"?:number[],
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
      this.salt = data.salt;
      this.password = data.password;
      this.plainPassword = data.plainPassword;
      this.lastLogin = data.lastLogin;
      this.confirmationToken = data.confirmationToken;
      this.passwordRequestedAt = data.passwordRequestedAt;
      this.groups = data.groups;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
      this.deletedAt = data.deletedAt;
  }

  create():Promise<number> {
    this.createdAt = new Date();
    this.updatedAt = new Date();

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
    this.updatedAt = new Date();
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
    this.deletedAt = new Date();

    return this.query(
      `UPDATE ${this.tableName} SET deletedAt Where ID = ${this.id}`,
      this.deletedAt,
      result => {
        return true;
    });
  }
}

export default UserModel;
