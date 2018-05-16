import Manager from './Manager';
import CategoryModel from './CategoryModel';

/**
 * CategoryManager provides helpers to access model and database
 *
 * @extends Manager
 */
class CategoryManager extends Manager {
  protected model = CategoryModel;
  // Database table name
  public tableName = 'categories';

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
    let data;

    return this.query(`SELECT * FROM ${this.tableName} WHERE lvl = ?`, 0)
      .then(result => {
        const promisesArray:Array<any> = [];

        result.forEach((row, index) => {
          promisesArray.push(this.getChildren(row.id, index));
        });

        data = result;

        return Promise.all(promisesArray);
      })
      .then(result => {
        result.forEach(row => {
          data[row.key].children = row.data;
        });

        return data;
      })
      .then(result => this.hydrateObjects(result))
      .catch(err => { throw err });
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
        return this.handleSingleResult(result, category);
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
