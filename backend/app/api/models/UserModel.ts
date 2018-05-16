import security from '../../config/security';
import Model from './Model';
import { ROLE_USER } from '../../lib/roles';
import { phoneReverseTransform } from '../../dataValidation/phoneValidation';

import jsonwebtoken = require('jsonwebtoken');
import crypto = require('crypto');
/**
 * UserModel
 *
 * @extends Model
 */
class UserModel extends Model {
  // Name of the database table
  protected tableName = 'users';

  private _plainPassword:string;

  protected _fields:{
    username?:string,
    usernameCanonical?:string,
    email?:string,
    emailCanonical?:string,
    enabled:boolean,
    locked:boolean,
    salt?:string,
    password?:string,
    lastLogin?:Date,
    confirmationToken?:string,
    passwordRequestedAt?:Date,
    role:string,
    street?:string,
    streetNumber?:string,
    streetBox?:string,
    city?:string,
    zip?:number,
    phone?:string,
    mobile?:string,
    mobile2?:string,
    balance?:number,
    picture?:string,
  } = {
    enabled: false,
    locked: false,
    role: ROLE_USER
  };

  /**
   * Initialize object
   *
   * @param data {} Map of key-values to initialize entity
   */
  constructor (data?:{ [key: string]: any }) {
    super();

    this.generateSalt();
    this.unserialize(data);
  }

  get username ():string { return this._fields.username; }
  /**
   * Sets the username and the usernameCanonical values
   *
   * @param username string
   */
  set username (username:string) {
    if (!this.setPersistableValue('username', username)) return;
    this.usernameCanonical = username.toLowerCase();
  }

  get usernameCanonical ():string { return this._fields.usernameCanonical; }
  set usernameCanonical (usernameCanonical:string) {
    this.setPersistableValue('usernameCanonical', usernameCanonical);
  }

  get email ():string { return this._fields.email; }
  /**
   * Sets the email and the emailCanonical values
   *
   * @param email string
   */
  set email (email:string) {
    if (!this.setPersistableValue('email', email)) return;
    this.emailCanonical = email.toLowerCase();
  }

  get emailCanonical ():string { return this._fields.emailCanonical; }
  set emailCanonical (emailCanonical:string) {
    this.setPersistableValue('emailCanonical', emailCanonical);
  }

  get enabled ():boolean { return this._fields.enabled; }
  set enabled (enabled:boolean) { this.setPersistableValue('enabled', enabled); }

  get locked ():boolean { return this._fields.locked; }
  set locked (locked:boolean) { this.setPersistableValue('locked', locked); }

  get salt ():string { return this._fields.salt; }
  set salt (salt:string) { this.setPersistableValue('salt', salt); }

  get password ():string { return this._fields.password; }
  set password (password:string) { this.setPersistableValue('password', password); }

  get plainPassword ():string { return this._plainPassword; }
  set plainPassword (plainPassword:string) {
    if (
      (plainPassword === null && typeof plainPassword === 'undefined') ||
      plainPassword === this.plainPassword
    ) return;
    this._plainPassword = plainPassword;
    this.generateSalt();
    this.password = this.hashPassword(plainPassword);
  }

  get lastLogin ():Date { return this._fields.lastLogin; }
  set lastLogin (lastLogin:Date) { this.setPersistableValue('lastLogin', lastLogin); }

  get confirmationToken ():string { return this._fields.confirmationToken; }
  set confirmationToken (confirmationToken:string) {
    this.setPersistableValue('confirmationToken', confirmationToken);
  }

  get passwordRequestedAt ():Date { return this._fields.passwordRequestedAt; }
  set passwordRequestedAt (passwordRequestedAt:Date) {
    this.setPersistableValue('passwordRequestedAt', passwordRequestedAt);
  }

  get role ():string { return this._fields.role; }
  /**
   * Sets the role with a default value if undefined
   *
   * @param role string
   */
  set role (role:string) {
    this.setPersistableValue('role', (typeof role !== 'undefined') ? role : ROLE_USER);
  }

  get street ():string { return this._fields.street; }
  set street (street:string) { this.setPersistableValue('street', street); }

  get streetNumber ():string { return this._fields.streetNumber; }
  set streetNumber (streetNumber:string) { this.setPersistableValue('streetNumber', streetNumber); }

  get streetBox ():string { return this._fields.streetBox; }
  set streetBox (streetBox:string) { this.setPersistableValue('streetBox', streetBox); }

  get city ():string { return this._fields.city; }
  set city (city:string) { this.setPersistableValue('city', city); }

  get zip ():number { return this._fields.zip; }
  set zip (zip:number) { this.setPersistableValue('zip', zip); }

  /**
   * Get the formatted phone value
   *
   * @returns string
   */
  get phone ():string { return this._fields.phone; }
  /**
   * Sets the phone value after formatting for database
   *
   * @param phone string
   */
  set phone (phone:string) { this.setPersistableValue('phone', phoneReverseTransform(phone)); }

  /**
   * Get the formatted mobile value
   *
   * @returns string
   */
  get mobile ():string { return this._fields.mobile; }
  /**
   * Sets the mobile value after formatting for database
   *
   * @param mobile string
   */
  set mobile (mobile:string) { this.setPersistableValue('mobile', phoneReverseTransform(mobile)); }

  /**
   * Get the formatted mobile2 value
   *
   * @returns string
   */
  get mobile2 ():string { return this._fields.mobile2; }
  /**
   * Sets the mobile2 value after formatting for database
   *
   * @param mobile2 string
   */
  set mobile2 (mobile2:string) {
    this.setPersistableValue('mobile2', phoneReverseTransform(mobile2));
  }

  get balance ():number { return this._fields.balance; }
  set balance (balance:number) { this.setPersistableValue('balance', balance); }

  get picture ():string { return this._fields.picture; }
  set picture (picture:string) { this.setPersistableValue('picture', picture); }

  private generateSalt () {
    const length = 16;
    this.salt = crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex') // convert to hexadecimal format
      .slice(0, length); // return required number of characters
  }

  private hashPassword (password:string):string {
    if (password !== null && password !== 'undefined') {
      const hash = crypto.createHmac('sha512', this.salt); // Hashing algorithm sha512
      hash.update(password);

      return hash.digest('hex');
    }

    return null;
  }

  private checkPassword (password:string):boolean {
    return this.password === this.hashPassword(password);
  }

  /**
   * Authenticate a user and return a JsonwebToken
   *
   * @returns string
   */
  authenticate (password:string):string {
    if (this.hashPassword(password) !== this.password) {
      throw { code: 'NO_AUTH', message: 'Authentication failed' };
    }

    const payload = { id: this.id, role: this.role };
    const token = jsonwebtoken.sign(payload, security.secret, { expiresIn: '1d' });

    return token;
  }

  /**
   * Alter standard serialize method
   *
   * @returns {} of key-values
   */
  serialize (forDb:boolean = false):{ [s: string]: any; } {
    const data = super.serialize();
    if (!forDb) {
      delete data.password;
      delete data.salt;
    }

    return data;
  }
}

export default UserModel;
