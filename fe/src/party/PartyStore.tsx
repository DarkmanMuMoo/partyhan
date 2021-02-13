import { makeObservable, observable, action ,runInAction} from "mobx"
import {joinableParty,PartyResponse}  from '../service/PartyService'

class PartyStore {
    @observable partyList: PartyResponse[] = [];

    constructor() {
        makeObservable(this);
    }
    @action
    joinableParty = async (jwt: string) => {
        const partylist = await joinableParty(jwt)
       runInAction(() => {
           this.partyList = partylist
       })
    }

}

const singleton = new PartyStore();
export default singleton