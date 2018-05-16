import Manager from './Manager';
import ServiceModel from './ServiceModel';

/**
 * ServiceManager provides helpers to access model and database
 *
 * @extends Manager
 */
class ServiceManager extends Manager {
  protected model = ServiceModel;
  // Database table name
  protected tableName = 'services';

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
