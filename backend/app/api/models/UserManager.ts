import Manager from './Manager';
import UserModel from './UserModel';

/**
 * UserManager provides helpers to access model and database
 *
 * @extends Manager
 */
class UserManager extends Manager {
  protected model = UserModel;
  // Database table name
  protected tableName = 'users';

  /**
   * Find a user from database based on username then hydrate as object
   *
   * @param username string
   * @returns Promise<UserModel>
   */
  findOneByUsername (username:string):Promise<UserModel> {
    const user = new UserModel({ username });
    return this.query(`SELECT * FROM ${this.tableName} WHERE usernameCanonical = ?`, [user.usernameCanonical])
      .then(result => {
        return this.handleSingleResult(result, user);
      });
  }
}

export default new UserManager();
