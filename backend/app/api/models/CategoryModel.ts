import Model from './Model';
import ServiceModel from './ServiceModel';
import { slugify } from '../../lib/utils';

export type CategoryType = {
  title?: string,
  parent?: CategoryModel
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
 //TODO: For insert, delete and parent change, the right stored procedure should be called
  get title (): string { return this._fields.title; }
  set title (title: string) { this.setPersistableValue('title', title); }

  get parent (): CategoryModel { return this._fields.parent; }
  set parent (parent: CategoryModel) { this.setPersistableValue('parent', parent); } //TODO: When parent changes, the update should call the stored procedure

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

    return this.query(
      `CALL r_tree_traversal('insert', NULL, ?, ?, ?, ?)`,
      [
        this.parent,
        this.title,
        this.createdAt,
        this.updatedAt
      ]
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
    return this.query(
      `CALL r_tree_traversal('delete', ?, NULL, NULL, NULL, NULL)`,
      [this.id])
      .then(result => result)
      .catch(err => {
        throw err;
      });
  }

  /**
   * Extend getDeleteQuery in order to cascade to children
   *
   * @returns Promise<any> mySql response
   */
  protected getDeleteQuery ():Promise<any> {
    return this.query(
      `UPDATE ${this.tableName} SET deletedAt = ? Where id = ${this.id} or parent = ${this.id}`,
      this.deletedAt
    );
  }
}

export default CategoryModel;
