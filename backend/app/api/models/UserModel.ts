class UserModel {
  private _username:string;

  get username():string {
    return this._username;
  }

  set username(username:string) {
    this._username = username;
  }
}

export default UserModel;
