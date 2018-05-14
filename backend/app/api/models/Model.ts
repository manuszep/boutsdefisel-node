import db from '../../lib/db';
import { camelize } from '../../lib/utils';

/**
 * Model
 *
 * Define basic model structure and common methods
 */
abstract class Model {
  // Database table name
  protected tableName;
  // Tells if the entity is already in the DB
  protected _inDb:boolean = false;
  // Stores a list of fields that are changed
  protected _dirty:{ [s: string]: boolean; } = {};
  // List of database fields
  protected _fields:{ [s: string]: any };
  // List of model properties that are not persisted directly
  protected _props:{ [s: string]: any };

  set id (id:number) {
    if (typeof id === 'undefined') return;
    // If the entity has an id, it's in the DB
    this._inDb = true;
    this._fields.id = id;
  }

  get id ():number {
    return this._fields.id;
  }

  get createdAt ():Date { return this._fields.createdAt; }
  set createdAt (createdAt:Date) { this.setPersistableValue('createdAt', createdAt); }

  get updatedAt ():Date { return this._fields.updatedAt; }
  set updatedAt (updatedAt:Date) { this.setPersistableValue('updatedAt', updatedAt); }

  get deletedAt ():Date { return this._fields.deletedAt; }
  set deletedAt (deletedAt:Date) { this.setPersistableValue('deletedAt', deletedAt); }

  /**
   * Add a field to the dirty list
   * @param key string The name of the field
   */
  protected setDirty (key:string) {
    this._dirty[key] = true;
  }

  /**
   * Clear the dirty list
   */
  public setClean () {
    this._dirty = {};
  }

  /**
   * Runs a DB query as a promise
   *
   * @param query string A mySql query
   * @param data Array<any> The values
   *
   * @returns Promise<any>
   */
  protected query (query:string, data:Array<any>|{}):Promise<any> {
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

  /**
   * Checks if the value indeed needs an update, sets the field as dirty.
   *
   * @param name string Field name to update
   * @param value any Value of the field
   *
   * @returns boolean if field is changed
   */
  protected setPersistableValue (name:string, value:any):boolean {
    if (typeof value === 'undefined' || value === this[name]) return false;
    this.setDirty(name);
    this._fields[name] = value;
    return true;
  }

  /**
   * Stores the entity in the database. Detect if a create or an update is necessary
   *
   * @returns Promise<any>
   */
  persist ():Promise<any> {
    if (this._inDb) {
      return this.update()
        .then(result => {
          this.setClean();
          return result;
        })
        .catch(err => {
          throw err;
        });
    } else {
      return this.create()
        .then(id => {
          this.setClean();
          return id;
        })
        .catch(err => {
          throw err;
        });
    }
  }

  protected buildUpdateQuery():{setters:string[],values:string[]} {
    const setters:string[] = [];
    const values:any[] = [];

    // Loop over dirty properies to generate setter string and values array
    Object.keys(this._dirty).forEach(key => {
      setters.push(`${key} = ?`);
      values.push(this._fields[key]);
    });

    // Update the updatedAt column
    this.updatedAt = new Date();

    // ... And add to setters list and values
    setters.push('updatedAt = ?');
    values.push(new Date());

    return {
      setters,
      values
    }
  }

  /**
   * Execute an update of the entity in the database
   *
   * @returns Promise<any> mySql response
   */
  protected update ():Promise<any> {
    const gettersSetters = this.buildUpdateQuery();

    // If values is empty, no change is required throw error
    if (gettersSetters.values.length <= 1) throw { code: 'NO_CHANGES' };

    // Run the query. The setters.replace is used to trim commas
    return this.query(
      `UPDATE ${this.tableName} SET ${gettersSetters.setters.join(', ')} WHERE id = ${this.id}`,
      gettersSetters.values
    )
      .then(result => result)
      .catch(err => {
        throw err;
      });
  }

  /**
   * Adds a row to the database
   *
   * @returns Promise<number> the insert id
   */
  protected create ():Promise<number> {
    this.createdAt = new Date();
    this.updatedAt = new Date();

    return this.query(
      `INSERT INTO ${this.tableName} SET ?`,
      this.serialize()
    ).then(result => {
      this.id = result.insertId;
      return this.id;
    }).catch(err => {
      throw err;
    });
  }

  /**
   * Deletes a row from the database. Actually, it just sets the deletedAt value
   *
   * @returns Promise<any> mySql response
   */
  delete ():Promise<any> {
    // If the User is already deleted, throw error
    if (typeof this.deletedAt !== 'undefined' && this.deletedAt !== null) throw { code: 'ALREADY_DELETED' };
    this.deletedAt = new Date();

    return this.query(
      `UPDATE ${this.tableName} SET deletedAt = ? Where ID = ${this.id}`,
      this.deletedAt
    )
      .then(result => result)
      .catch(err => {
        throw err;
      });
  }

  serializeCollection(data:any[]):any[] {
    const res = [];

    for (let i = 0; i < data.length; i++) {
      if (typeof data[i].serialize === 'function') {
        res.push(data[i].serialize());
      }
    }

    return res;
  }

  /**
   * Returns the serialized representation of an Entity
   *
   * @returns {} of key-values
   */
  serialize (forDb:boolean = false):{ [s: string]: any; } {
    const data = forDb ? {...this._fields} : {...this._fields, ...this._props};

    for (var propName in data) {
      if (data[propName] === null || typeof data[propName] === 'undefined') {
        delete data[propName];
      }

      if (Array.isArray(data[propName])) {
        data[propName] = this.serializeCollection(data[propName]);
      }
    }

    return data;
  }

  /**
   * Turns a serialized representation into an actual entiry
   *
   * @param data object An {} of key-values
   * @returns any The entity object
   */
  unserialize (data:{ [s: string]: any; }):void {
      if (typeof data === 'undefined') return;

      for (var propName in data) {
        if (data[propName] !== null || typeof data[propName] !== 'undefined') {
          const camelizedPropName = `set${camelize(propName, true)}`;
          if (typeof this[camelizedPropName] === 'function') {
            this[camelizedPropName](data[propName]);
          }
          this[propName] = data[propName];
        }
      }
    }
}

export default Model;
