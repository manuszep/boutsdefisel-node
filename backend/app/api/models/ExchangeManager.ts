import Manager from './Manager';
import ExchangeModel from './ExchangeModel';

/**
 * ExchangeManager provides helpers to access model and database
 *
 * @extends Manager
 */
class ExchangeManager extends Manager {
  protected model = ExchangeModel;
  // Database table name
  public tableName = 'exchanges';
}

export default new ExchangeManager();
