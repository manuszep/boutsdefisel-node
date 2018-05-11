import Manager from "./Manager";
import UserModel from "./UserModel";

/**
 * UserManager provides helpers to access model and database
 *
 * @extends Manager
 */
class UserManager extends Manager {
  // Database table name
  protected tableName = "users";
  // Stores data from last query
  private data;

  /**
   * Provide a UserModel
   *
   * @param data {}
   * @returns UserModel
   */
  getModel(data?:{ [key: string]: any }):UserModel {
    return new UserModel(data);
  }

  /**
   * Fetch all users from database
   *
   * @returns Promise<{}[]>
   */
  findAll():Promise<{}[]> {
    return this.query(`SELECT * FROM ${this.tableName}`, null)
    .then(result => {
      this.data = result;
      return this.data;
    });
  }

  /**
   * Find a user from database based on ID then hydrate as object
   *
   * @param id number
   * @returns Promise<UserModel>
   */
  findOne(id:number):Promise<UserModel> {
    return this.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id])
    .then(result => {
      this.data = result;

      // If there's no result, throw a NOT_FOUND
      if (!result.length) {
        throw {code: "NOT_FOUND"};
      }

      // Hydrate model
      const user = new UserModel(this.data[0]);
      // Set model as clean since all values are dirty after hydration
      user.setClean();
      return user;
    });
  }

  /**
   * Find a user from database based on username then hydrate as object
   *
   * @param username string
   * @returns Promise<UserModel>
   */
  findOneByUsername(username:string):Promise<UserModel> {
    const user = new UserModel({username: username});
    return this.query(`SELECT * FROM ${this.tableName} WHERE usernameCanonical = ?`, [user.usernameCanonical])
      .then(result => {
        this.data = result;

        // If there's no result, throw a NOT_FOUND
        if (!result.length) {
          throw {code: "NOT_FOUND"};
        }

        // Hydrate model
        user.unserialize(this.data[0]);
        // Set model as clean since all values are dirty after hydration
        user.setClean();
        return user;
      });
  }

  /**
   * Loop over mySQL rows and hydrate as UserModel
   *
   * @param rows {}][] list of mySQL rows
   * @returns UserModel[]
   */
  hydrateObjects(rows:{}[]):UserModel[] {
    this.data = [];
    rows.forEach( (row) => {
      this.data.push(new UserModel(row));
    });

    return this.data;
  }
}

export default new UserManager();
