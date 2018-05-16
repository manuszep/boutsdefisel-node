import db from '../../lib/db';

/**
 * Manager
 *
 * Define basic manager structure and common methods
 */
abstract class Manager {
  protected model;
  // Database table name
  protected tableName;
  // Stores data from last query
  protected data;

  /**
   * Provide a Model
   *
   * @param data {}
   * @returns Model
   */
  getModel (data?:{ [key: string]: any }):any {
    return new this.model(data);
  }

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

  public serializeCollection (data:any[]):{[key:string]:any}[] {
    const res = [];

    data.forEach(item => {
      if (typeof item.serialize === 'function') {
        res.push(item.serialize(false));
      } else {
        res.push(item);
      }
    });

    return res;
  }

  handleSingleResult (result, item?) {
    this.data = result;
      // If there's no result, throw a NOT_FOUND
      if (!result.length) {
        throw { code: 'NOT_FOUND' };
      }

      if (typeof item === 'undefined') {
        const item = new this.model();
      }

      // Hydrate model
      item.unserialize(this.data[0]);
      // Set model as clean since all values are dirty after hydration
      item.setClean();
      return item;
  }

  getFindAllQuery ():Promise<{[key:string]:any}> {
    return this.query(`SELECT * FROM ${this.tableName}`, null);
  }

  /**
   * Fetch all items from database
   *
   * @returns Promise<{}[]>
   */
  findAll ():Promise<{}[]> {
    return this.getFindAllQuery()
      .then(result => {
        this.data = result;
        return this.data;
      });
  }

  getFindOneQuery (id:number):Promise<{[key:string]:any}> {
    return this.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  /**
   * Find an item from database based on id then hydrate as object
   *
   * @param id number
   * @returns Promise<ServiceModel>
   */
  findOne (id:number):Promise<any> {
    return this.getFindOneQuery(id)
      .then(result => {
        this.data = result;

        // If there's no result, throw a NOT_FOUND
        if (!result.length) {
          throw { code: 'NOT_FOUND' };
        }

        // Hydrate model
        const item = new this.model(this.data[0]);
        // Set model as clean since all values are dirty after hydration
        item.setClean();
        return item;
      });
  }

  /**
   * Loop over mySQL rows and hydrate as Model
   *
   * @param rows {}][] list of mySQL rows
   * @returns Model[]
   */
  hydrateObjects (rows:{}[]):any[] {
    this.data = [];
    rows.forEach(row => {
      this.data.push(new this.model(row));
    });

    return this.data;
  }
}

export default Manager;
