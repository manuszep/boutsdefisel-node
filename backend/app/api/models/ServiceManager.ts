import Manager from './Manager';
import ServiceModel from './ServiceModel';

/**
 * ServiceManager provides helpers to access model and database
 *
 * @extends Manager
 */
class ServiceManager extends Manager {
  // Database table name
  protected tableName = 'services';
  // Stores data from last query
  private data;

  /**
   * Provide a ServiceModel
   *
   * @param data {}
   * @returns ServiceModel
   */
  getModel (data?:{ [key: string]: any }):ServiceModel {
    return new ServiceModel(data);
  }

  /**
   * Fetch all services from database
   *
   * @returns Promise<{}[]>
   */
  findAll ():Promise<{}[]> {
    return this.query(`SELECT * FROM ${this.tableName}`, null)
      .then(result => {
        this.data = result;
        return this.data;
      });
  }



  /**
   * Find a service from database based on id then hydrate as object
   *
   * @param id number
   * @returns Promise<ServiceModel>
   */
  findOne (id:string):Promise<ServiceModel> {
    return this.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id])
      .then(result => {
        this.data = result;

        // If there's no result, throw a NOT_FOUND
        if (!result.length) {
          throw { code: 'NOT_FOUND' };
        }

        // Hydrate model
        const service = new ServiceModel(this.data[0]);
        // Set model as clean since all values are dirty after hydration
        service.setClean();
        return service;
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
        this.data = result;

        // If there's no result, throw a NOT_FOUND
        if (!result.length) {
          throw { code: 'NOT_FOUND' };
        }

        // Hydrate model
        service.unserialize(this.data[0]);
        // Set model as clean since all values are dirty after hydration
        service.setClean();
        return service;
      });
  }

  /**
   * Loop over mySQL rows and hydrate as ServiceModel
   *
   * @param rows {}][] list of mySQL rows
   * @returns ServiceModel[]
   */
  hydrateObjects (rows:{}[]):ServiceModel[] {
    this.data = [];
    rows.forEach(row => {
      this.data.push(new ServiceModel(row));
    });

    return this.data;
  }
}

export default new ServiceManager();
