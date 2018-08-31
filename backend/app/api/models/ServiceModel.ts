import Model from './Model';
import CategoryModel from './CategoryModel';
import UserModel from './UserModel';
import { slugify } from '../../lib/utils';

export type ServiceType = {
  title?: string,
  slug?: string,
  body?: string,
  user?: UserModel,
  type?: number,
  domain?: number,
  category?: CategoryModel,
  picture?: string,
  expiresAt?: Date
}
/**
 * ServiceModel
 *
 * @extends Model
 */
class ServiceModel extends Model {
  // Name of the database table
  public tableName = 'services';

  protected _fields:ServiceType = {};

  /**
   * Initialize object
   *
   * @param data {} Map of key-values to initialize entity
   */
  constructor (data?:{ [key: string]: any }) {
    super();

    this.unserialize(data);
  }

  get title ():string { return this._fields.title; }
  set title (title:string) {
    if (this.setPersistableValue('title', title)) {
      this.generateSlug();
    }
  }

  get slug ():string { return this._fields.slug; }
  set slug (slug:string) { this.setPersistableValue('slug', slug.substring(0, 255)); }

  get body ():string { return this._fields.body; }
  set body (body:string) { this.setPersistableValue('body', body); }

  get user ():UserModel { return this._fields.user; }
  set user (user:UserModel) {
    if (this.setPersistableValue('user', user)) {
      this.generateSlug();
    }
  }

  get type ():number { return this._fields.type; }
  set type (type:number) { this.setPersistableValue('type', type); }

  get domain ():number { return this._fields.domain; }
  set domain (domain:number) { this.setPersistableValue('domain', domain); }

  get category ():CategoryModel { return this._fields.category; }
  set category (category:CategoryModel) { this.setPersistableValue('category', category); }

  get picture ():string { return this._fields.picture; }
  set picture (picture:string) { this.setPersistableValue('picture', picture); }

  get expiresAt ():Date { return this._fields.expiresAt; }
  set expiresAt (expiresAt:Date) { this.setPersistableValue('expiresAt', expiresAt); }

  generateSlug () {
    if (typeof this.title !== 'undefined' && this.title !== null && this.title.length &&
        typeof this.user !== 'undefined' && this.user !== null && this.user.username) {
      this.slug = slugify(`${this.user.username} ${this.title}`);
    }
  }
}

export default ServiceModel;
