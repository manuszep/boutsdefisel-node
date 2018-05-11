import db from "../../lib/db";

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
  // Database row id
  protected _id:number;

  set id(id:number) {
    if (typeof id === "undefined") return;
    // If the entity has an id, it's in the DB
    this._inDb = true;
    this._id = id;
  }

  get id():number {
    return this._id;
  }

  /**
   * Add a field to the dirty list
   * @param key string The name of the field
   */
  protected setDirty(key:string) {
      this._dirty[key] = true;
  }

  /**
   * Clear the dirty list
   */
  public setClean() {
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
  protected query(query:string, data:Array<any>):Promise<any> {
    return new Promise ((resolve, reject) => {
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
  protected setPersistableValue(name:string, value:any):boolean {
    if (typeof value === "undefined" || value === this[name]) return false;
    this.setDirty(name);
    this[`_${name}`] = value;
    return true;
  }

  /**
   * Stores the entity in the database. Detect if a create or an update is necessary
   *
   * @returns Promise<any>
   */
  persist():Promise<any> {
    return new Promise((resolve, reject) => {
      if (this._inDb) {
        this.update()
        .then((result) => {
          this.setClean();
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
      } else {
        this.create()
        .then(id => {
          this.setClean();
          resolve(id);
        })
        .catch(err => {
          reject(err);
        });
      }
    });
  }

  /**
   * Returns the serialized representation of an entity
   *
   * @returns {} of key-values
   */
  abstract serialize():{ [s: string]: any; };

  /**
   * Turns a serialized representation into an actual entity
   *
   * @param data object An {} of key-values
   * @returns any The entity object
   */
  abstract unserialize(data:{}):any;

  /**
   * Execute an update of the entity in the database
   *
   * @returns Promise<any> mySql response
   */
  abstract update():Promise<any>;

  /**
   * Adds an entity to the database
   *
   * @returns Promise<number> the insert id
   */
  abstract create():Promise<number>;

  /**
   * Deletes an entity from the database
   *
   * @returns Promise<any> mySql response
   */
  abstract create():Promise<any>;
}

export default Model;
