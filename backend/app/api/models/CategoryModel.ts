import Model from './Model';
import { slugify } from '../../lib/utils';

/**
 * CategoryModel
 *
 * @extends Model
 */
class CategoryModel extends Model {
  // Name of the database table
  protected tableName = 'categories';

  protected _fields:{
    title?:string;
    lvl?:number;
    parent?:number;
    slug?:string;
  } = {};

  protected _props:{
    services?:number[],
    children?:any
  } = {};

  /**
   * Initialize object
   *
   * @param data {} Map of key-values to initialize entity
   */
  constructor (data?:{ [key: string]: any }) {
    super();

    this.unserialize(data);
  }

  get title():string { return this._fields.title; }
  set title(title:string) {
    this.setPersistableValue('title', title);
    this.slug = slugify(title);
  }

  get lvl():number { return this._fields.lvl; }
  set lvl(lvl:number) { this.setPersistableValue('lvl', lvl); }

  get parent():number { return this._fields.parent; }
  set parent(parent:number) { this.setPersistableValue('parent', parent); }

  get slug():string { return this._fields.slug; }
  set slug(slug:string) { this.setPersistableValue('slug', slug); }

  get services():number[] { return this._props.services; }
  set services(services:number[]) {
    if (typeof services === 'undefined' || !services.length || services === null) return;
    this._props.services = services;
  }

  get children():number[]|CategoryModel[] { return this._props.children; }
  set children(children:number[]|CategoryModel[]) {
    if (typeof children === 'undefined' || !children.length || children === null) return;
    this._props.children = children;
  }

  public setParent(parent:CategoryModel|number) {
    if (typeof parent === 'undefined' || parent === null) return;
    if (typeof parent === 'number') {
      this.parent = parent;
    } else {
      this.parent = parent.id;
      this.lvl = parent.lvl + 1;
    }
  }

  public addService(service:number) {
    if (typeof service === 'undefined' || service === null) return;
    this._props.services.push(service);
  }

  public addChild(child:number|CategoryModel) {
    if (typeof child === 'undefined' || child === null) return;
    this._props.children.push(child);
  }
}

export default CategoryModel;
