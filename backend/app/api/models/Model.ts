import connection from "../../lib/db";

abstract class Model {
    protected connection = connection;
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
  
    persist():void {
      if (this._inDb) {
        this.update();
      }
  
      this.create();
    }

    abstract toKeyValue():{ [s: string]: any; };

    abstract update():void;

    abstract create():void;
}

export default Model;