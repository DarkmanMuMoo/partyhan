import axios from 'axios';
import getURL from '../util/getURL'


type PartyRequest = {
    name: string
    size: number
}
export type PartyResponse = {
    id:number
    name: string
    size: number
    current_size:number
  is_owner:boolean
    is_join:boolean
}


export  function createPary(party: PartyRequest,jwt:string): Promise<any> {
  return  axios.post(getURL('party'), party,{
    headers: {
        Authorization: `Bearer ${jwt}` 
      }
  })
  
}




export  async function joinableParty(jwt:string): Promise<PartyResponse[]> {
    return  (await axios.get(getURL('party'),{
      headers: {
          Authorization: `Bearer ${jwt}` 
        }
    })).data
  }


  export function subscribe(id:number,jwt:string) :Promise<any> {
    return  axios.put(getURL(`party/${id}/subscribe`),null,{
      headers: {
          Authorization: `Bearer ${jwt}` 
        }
    })
  }
