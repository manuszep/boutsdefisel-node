import Manager from './Manager';
import ServiceModel from './ServiceModel';
import UserModel from './UserModel';

/**
 * ServiceManager provides helpers to access model and database
 *
 * @extends Manager
 */
class ServiceManager extends Manager {
  protected model = ServiceModel;
  // Database table name
  public tableName = 'services';

  getFindAllQuery ():Promise<{[key:string]:any}> {
    // TODO: Use Join query but user data will come flat with service data.
    // Add unserialize logic to separate both.
    // return this.query(`SELECT * FROM ${this.tableName} AS s LEFT JOIN ${UserManager.tableName} as u ON u.id = s.user`, null);
    return this.query(`SELECT * FROM ${this.tableName}`, null);
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
