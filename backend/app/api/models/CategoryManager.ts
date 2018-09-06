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

  getChildren (parentId: number, parentKey?: number): Promise<{[key:string]: {}}> {
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

  findAll(): Promise<CategoryModel[]> {
    const levels = {};
    const data = [];

    return this.query(`SELECT * FROM ${this.tableName} ORDER BY lvl DESC`)
      .then(result => {
        // Loop over results which are ordered by level DESC
        for (let row of result) {
          const childLevel = row.lvl + 1; // Get the level of children
          const category = new CategoryModel(row);

          // Check if there's something stored in child level for the current category id
          if (typeof levels[childLevel] !== "undefined" && typeof levels[childLevel][row.id] !== "undefined") {
            // If so, add as children
            category.children = levels[childLevel][row.id];
          }
          // If the current level is not root, store for later assignation to parent
          if (row.lvl > 0) {
            // Create new level key if it does not exist
            levels[row.lvl] = levels[row.lvl] || {};
            // Create array for parent if it does not exist
            levels[row.lvl][row.parent] = levels[row.lvl][row.parent] || [];

            // Add current category to level/parent object for later use
            levels[row.lvl][row.parent].push(category);
          } else {
            // If we're at root, category has all it's children and should go to final data object
            data.push(category);
          }
        };

        return data;
      })
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
   * @param rows {}[] list of mySQL rows
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
