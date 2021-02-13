import { makeObservable, observable, action } from "mobx"
class JWTStore {
  @observable jwt: string | any = null;

  constructor() {
    if (localStorage['jwt']) {
      this.jwt = localStorage['jwt']
    }
    makeObservable(this);
  }
  @action
  setJWT = (jwt: string) => {
    localStorage['jwt'] = jwt;
    this.jwt = jwt
  }
  @action
  clear = () => {
    localStorage.removeItem('jwt');
    this.jwt = null
  };

}

const singleton = new JWTStore();
export default singleton