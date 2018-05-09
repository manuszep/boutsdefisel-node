import db from "../../lib/db";

abstract class Manager {
  protected tableName;

  protected query(query, data, success):Promise<any> {
    return new Promise ((resolve, reject) => {
      db.query(query, data)
        .then(result => {
          resolve(success(result));
        })
        .catch(err => {
          reject(err)
        });
    })
  }
}

export default Manager;
