import Manager from './Manager';
import CategoryModel from './CategoryModel';

/**
 * CategoryManager provides helpers to access model and database
 *
 * @extends Manager
 */
class CategoryManager extends Manager {
  // Database table name
  protected tableName = 'categories';
  // Stores data from last query
  private data;

  /**
   * Provide a CategoryModel
   *
   * @param data {}
   * @returns CategoryModel
   */
  getModel (data?:{ [key: string]: any }):CategoryModel {
    return new CategoryModel(data);
  }

  getChildren (parentId:number, parentKey?:number):Promise<{[key:string]:number|{}[]}> {
    return new Promise((resolve, reject) => {
      this.query(`SELECT * FROM ${this.tableName} WHERE parent = ?`, parentId)
        .then(result => {
          if (typeof parentKey !== 'undefined') {
            resolve({ key: parentKey, data: result });
          }

          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Fetch all categories from database
   *
   * @returns Promise<{}[]>
   */
  findAll ():Promise<{}[]> {
    return this.query(`SELECT * FROM ${this.tableName} WHERE lvl = ?`, 0)
      .then(result => {
        const promisesArray:Array<any> = [];

        result.forEach((row, index) => {
          promisesArray.push(this.getChildren(row.id, index));
        });

        return Promise.all(promisesArray).then(subResult => {
          subResult.forEach(row => {
            result[row.key].children = row.data;
          });

          return result;
        });
      })
      .then(result => this.hydrateObjects(result));
  }

  /**
   * Find a category from database based on ID then hydrate as object
   *
   * @param id number
   * @returns Promise<UserModel>
   */
  findOne (id:number):Promise<CategoryModel> {
    return this.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id])
      .then(result => {
        this.data = result;

        // If there's no result, throw a NOT_FOUND
        if (!result.length) {
          throw { code: 'NOT_FOUND' };
        }

        // Hydrate model
        const category = new CategoryModel(this.data[0]);
        // Set model as clean since all values are dirty after hydration
        category.setClean();
        return category;
      });
  }

  /**
   * Find a user from database based on username then hydrate as object
   *
   * @param username string
   * @returns Promise<UserModel>
   */
  findOneBySlug (slug:string):Promise<CategoryModel> {
    const category = new CategoryModel({ slug });
    return this.query(`SELECT * FROM ${this.tableName} WHERE slug = ?`, [category.slug])
      .then(result => {
        this.data = result;

        // If there's no result, throw a NOT_FOUND
        if (!result.length) {
          throw { code: 'NOT_FOUND' };
        }

        // Hydrate model
        category.unserialize(this.data[0]);
        // Set model as clean since all values are dirty after hydration
        category.setClean();
        return category;
      });
  }

  /**
   * Loop over mySQL rows and hydrate as CategoryModel
   *
   * @param rows {}][] list of mySQL rows
   * @returns UserModel[]
   */
  hydrateObjects (rows:{[key:string]:any}[]):CategoryModel[] {
    const data = [];
    rows.forEach(row => {
      if (typeof row.children !== 'undefined' && row.children !== null) {
        row.children = this.hydrateObjects(row.children);
      }

      data.push(new CategoryModel(row));
    });

    return data;
  }
}

export default new CategoryManager();
