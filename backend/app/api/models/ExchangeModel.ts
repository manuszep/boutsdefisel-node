import Model from './Model';
import UserModel from './UserModel';

/**
 * ExchangeModel
 *
 * @extends Model
 */
class ExchangeModel extends Model {
  // Name of the database table
  public tableName = 'exchanges';

  protected _fields:{
    title?:string,
    creditUser?:UserModel,
    debitUser?:UserModel,
    message?:string,
    amount?:number,
    hidden?:boolean
  } = {};

  /**
   * Initialize object
   *
   * @param data {} Map of key-values to initialize entity
   */
  constructor (data?:{ [key: string]: any }) {
    super();

    this.hidden = false;
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
  set amount (amount:number) { this.setPersistableValue('amount', parseFloat(amount)); }

  get hidden ():boolean { return this._fields.hidden; }
  set hidden (hidden:boolean) { this.setPersistableValue('hidden', hidden); }

  /**
   * Extend update method to update users balance
   */
  protected update ():Promise<any> {
    const oldAmount = this._dirty.amount || 0;
    const diffAmount = this.amount - oldAmount;

    return super.update()
    .then(() => {
      this.updateUsers(diffAmount);
    });
  }

  /**
   * Extend create method to update users balance
   */
  protected create ():Promise<any> {
    return super.create()
    .then(() => {
      this.updateUsers(this.amount);
    });
  }

  /**
   * Extend delete method to update users balance
   */
  delete ():Promise<any> {
    const diffAmount = -this.amount;

    return super.delete()
    .then(() => {
      return this.updateUsers(diffAmount);
    });
  }

  private updateUsers(amount:number):Promise<any> {
    this.debitUser.debit(amount);
    this.creditUser.credit(amount);

    return this.debitUser.persist()
    .then(() => {
      return this.creditUser.persist();
    }).catch(err => {
      throw err;
    });
  }
}

export default ExchangeModel;
