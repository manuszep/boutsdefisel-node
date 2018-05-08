import connection from "../../lib/db";

abstract class Model {
    protected tableName;
    protected _inDb:boolean = false;
    protected _dirty:{ [s: string]: boolean; } = {};
    protected _id:number;

    set id(id:number) {
      this._id = id;
    }

    get id():number {
      return this._id;
    }

    protected setDirty(key) {
        this._dirty[key] = true;
    }

    protected setClean() {
        this._dirty = {};
    }

    persist():Promise<any> {
      return new Promise((resolve, reject) => {
        if (this._inDb) {
          this.update();
        } else {
          this.create()
          .then(id => {
            resolve(id);
          })
          .catch(err => {
            reject(err);
          });
        }
      });

    }

    abstract serialize():{ [s: string]: any; };

    abstract update():void;

    abstract create():Promise<number>;
}

export default Model;
