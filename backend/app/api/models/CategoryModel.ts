import Model from './Model';
import ServiceModel from './ServiceModel';
import { slugify } from '../../lib/utils';

export type CategoryType = {
  id?:number,
  title?: string,
  parent?: CategoryModel | number
}

/**
 * CategoryModel
 *
 * @extends Model
 */
class CategoryModel extends Model {
  // Name of the database table
  public tableName = 'categories';

  protected _fields: CategoryType = {};

  protected _props:{
    services: ServiceModel[],
    children: CategoryModel[]
  } = {services: [], children: []};

  /**
   * Initialize object
   *
   * @param data {} Map of key-values to initialize entity
   */
  constructor (data?: { [key: string]: any }) {
    super();
    this.unserialize(data);
  }

  get title (): string { return this._fields.title; }
  set title (title: string) { this.setPersistableValue('title', title); }

  get parent (): CategoryModel | number { return this._fields.parent; }
  set parent (parent: CategoryModel | number) { this.setPersistableValue('parent', parent); }

  get services (): ServiceModel[] { return this._props.services; }
  set services (services: ServiceModel[]) {
    if (typeof services === 'undefined' || !services.length || services === null) return;
    this._props.services = services;
  }

  get children (): CategoryModel[] { return this._props.children; }
  set children (children: CategoryModel[]) {
    if (typeof children === 'undefined' || !children.length || children === null) return;
    this._props.children = children;
  }

  // Disable deletedAt field
  get deletedAt ():null { return null; }
  set deletedAt (val:null) { return; }

  public addService (service: ServiceModel) {
    if (typeof service === 'undefined' || service === null) return;
    this._props.services.push(service);
  }

  public addChild (child: CategoryModel) {
    if (typeof child === 'undefined' || child === null) return;
    this._props.children.push(child);
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

    let params = [];
    let query = "";

    if (typeof this._dirty.title !== "undefined") {
      query = `UPDATE ${this.tableName} SET title = ?, updatedAt = ? WHERE id = ?;`;
      params.push(this.title);
      params.push(new Date());
      params.push(this.id);
    }

    if (typeof this._dirty.parent !== "undefined") {
      query = query + `CALL r_tree_traversal('move', ?, ?, NULL, NULL, NULL);`;
      params.push(this.id);
      params.push(this.parent);
    }

    // Run the query. The setters.replace is used to trim commas
    return this.query(
      query,
      params
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

    if (typeof this.parent === "undefined") {
      this.parent = 1;
    }

    const parentId = (typeof this.parent === "number") ? this.parent : this.parent.id;

    return this.query(
      `CALL r_tree_traversal('insert', NULL, ?, ?, ?, ?)`,
      [
        parentId,
        this.title,
        this.createdAt,
        this.updatedAt
      ]
    ).then(result => {
      this.id = result[0][0].insertId; // The stored procedure returns a nested response
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
    return this.query(
      `CALL r_tree_traversal('delete', ?, NULL, NULL, NULL, NULL)`,
      [this.id])
      .then(result => result)
      .catch(err => {
        throw err;
      });
  }
}

export default CategoryModel;
