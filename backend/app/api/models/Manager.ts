import db from '../../lib/db';

/**
 * Manager
 *
 * Define basic manager structure and common methods
 */
abstract class Manager {
  // Database table name
  protected tableName;

  /**
   * Runs a DB query as a promise
   *
   * @param query string A mySql query
   * @param data Array<any> The values
   *
   * @returns Promise<any>
   */
  protected query (query, data):Promise<any> {
    return new Promise((resolve, reject) => {
      db.query(query, data)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public serializeCollection(data:any[]):{[key:string]:any}[] {
    const res = [];

    data.forEach(item => {
      res.push(item.serialize());
    });

    return res;
  }
}

export default Manager;
