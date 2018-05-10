import db from "../../lib/db";

abstract class Model {
    protected tableName;
    protected _inDb:boolean = false;
    protected _dirty:{ [s: string]: boolean; } = {};
    protected _id:number;

    set id(id:number) {
      if (typeof id === "undefined") return;
      this._inDb = true;
      this._id = id;
    }

    get id():number {
      return this._id;
    }

    protected setDirty(key) {
        this._dirty[key] = true;
    }

    public setClean() {
        this._dirty = {};
    }

    protected query(query, data):Promise<any> {
      return new Promise ((resolve, reject) => {
        db.query(query, data)
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    }

    protected setPersistableValue(name:string, value:any):boolean {
      if (typeof value === "undefined" || value === this[name]) return false;
      this.setDirty(name);
      this[`_${name}`] = value;
      return true;
    }

    persist():Promise<any> {
      return new Promise((resolve, reject) => {
        if (this._inDb) {
          this.update()
          .then((result) => {
            this.setClean();
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
        } else {
          this.create()
          .then(id => {
            this.setClean();
            resolve(id);
          })
          .catch(err => {
            reject(err);
          });
        }
      });
    }

    abstract serialize():{ [s: string]: any; };

    abstract update():Promise<any>;

    abstract create():Promise<number>;
}

export default Model;
