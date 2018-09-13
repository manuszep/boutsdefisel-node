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

  findAll(): Promise<CategoryModel> {
    return this.query(`SELECT * FROM ${this.tableName} ORDER BY lft ASC`)
      .then(result => {
        return this.hydrateObjects(result);
      })
      .catch(err => { throw err });
  }

  /**
   * Find a category from database based on id then hydrate as object
   *
   * @param id number
   * @returns Promise<CategoryModel>
   */
  findOne (id:number):Promise<CategoryModel> {
    return this.query(`SELECT lft, rgt INTO @plft, @prgt FROM categories where id = ? ORDER BY lft ASC; SELECT * FROM categories WHERE lft >= @plft AND rgt <= @prgt;`, [id])
      .then(result => {
        if (!result[1].length) {
          throw { code: 'NOT_FOUND' };
        }

        const data = this.hydrateObjects(result[1]);
        data.setClean();
        return data;
      });
  }

  /**
   * Loop over mySQL rows and hydrate as CategoryModel
   *
   * @param rows {}[] list of mySQL rows
   * @returns CategoryModel[]
   */
  hydrateObjects (rows:{[key:string]:any}[]):CategoryModel {
    const items:{[key:number]: CategoryModel} = {};
    let data:CategoryModel;

    for (let row of rows) {
      items[row.id] = new CategoryModel(row);

      // Rows should be sorted by lft ASC. So first item in array is root
      if (typeof data === "undefined") {
        data = items[row.id];
        continue;
      }

      if (typeof items[row.parent] !== "undefined") {
        items[row.parent].addChild(items[row.id]);
      }
    }

    return data;
  }
}

export default new CategoryManager();
