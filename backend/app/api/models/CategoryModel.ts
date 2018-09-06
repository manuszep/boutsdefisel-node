import Model from './Model';
import ServiceModel from './ServiceModel';
import { slugify } from '../../lib/utils';

export type CategoryType = {
  title?: string,
  lvl?: number,
  parent?: CategoryModel,
  slug?: string
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
  set title (title: string) {
    this.setPersistableValue('title', title);
    this.slug = slugify(title);
  }

  get lvl (): number { return this._fields.lvl; }
  set lvl (lvl: number) { this.setPersistableValue('lvl', lvl); }

  get parent (): CategoryModel { return this._fields.parent; }
  set parent (parent: CategoryModel) { this.setPersistableValue('parent', parent); }

  get slug (): string { return this._fields.slug; }
  set slug (slug: string) { this.setPersistableValue('slug', slug); }

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

  public setParent (parent: CategoryModel) {
    if (typeof parent === 'undefined' || parent === null) return;

    this.parent = parent;
    if (this.parent instanceof CategoryModel) this.lvl = parent.lvl + 1;
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
