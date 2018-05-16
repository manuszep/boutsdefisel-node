import Model from './Model';
import UserModel from './UserModel';

/**
 * ExchangeModel
 *
 * @extends Model
 */
class ExchangeModel extends Model {
  // Name of the database table
  protected tableName = 'exchanges';

  protected _fields:{
    title?:string,
    creditUser?:UserModel,
    debitUser?:UserModel,
    message?:string,
    amount?:number,
    hide?:boolean
  };

  /**
   * Initialize object
   *
   * @param data {} Map of key-values to initialize entity
   */
  constructor (data?:{ [key: string]: any }) {
    super();

    this.unserialize(data);
  }

  get title ():string { return this._fields.title; }
  set title (title:string) { this.setPersistableValue('title', title); }

  get creditUser ():UserModel { return this._fields.creditUser; }
  set creditUser (creditUser:UserModel) { this.setPersistableValue('creditUser', creditUser); }

  get debitUser ():UserModel { return this._fields.debitUser; }
  set debitUser (debitUser:UserModel) { this.setPersistableValue('debitUser', debitUser); }

  get message ():string { return this._fields.message; }
  set message (message:string) { this.setPersistableValue('message', message); }

  get amount ():number { return this._fields.amount; }
  set amount (amount:number) { this.setPersistableValue('amount', amount); }

  get hide ():boolean { return this._fields.hide; }
  set hide (hide:boolean) { this.setPersistableValue('hide', hide); }
}

export default ExchangeModel;
