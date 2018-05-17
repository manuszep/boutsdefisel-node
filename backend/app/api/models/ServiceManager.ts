import Manager from './Manager';
import ServiceModel from './ServiceModel';
import UserManager from './UserManager';

/**
 * ServiceManager provides helpers to access model and database
 *
 * @extends Manager
 */
class ServiceManager extends Manager {
  protected model = ServiceModel;
  // Database table name
  public tableName = 'services';

  findAll ():Promise<{}[]> {
    let services;
    // Run the standard findAll query
    return super.findAll()
      .then(result => {
        // Store the results for later
        services = result;
        // Get a list of all users id from the services rows
        const usersList = result.map(row => row.user);

        // Search the database for those user id's
        return this.query(`select * from users where id in (${usersList.join(',')})`);
      })
      .then(result => {
        const users = {};

        // Loop over users to store them with their id's as object key for quick retreival
        for (let i = 0; i < result.length; i += 1) {
          users[result[i].id] = result[i];
        }

        // Replace the user value in service object with the actual user data
        return this.hydrateObjects(services.map(row => {
          const uid = row.user;
          row.user = users[uid];
          return row;
        }), {user: UserManager});
      })
      .catch(err => {
        throw err;
      });
  }

  /**
   * Find a service from database based on slug then hydrate as object
   *
   * @param slug string
   * @returns Promise<ServiceModel>
   */
  findOneBySlug (slug:string):Promise<ServiceModel> {
    const service = new ServiceModel({ slug });
    return this.query(`SELECT * FROM ${this.tableName} WHERE slug = ?`, [service.slug])
      .then(result => {
        return this.handleSingleResult(result, service);
      });
  }
}

export default new ServiceManager();
