import axios from 'axios';
import getURL from '../util/getURL'
import JWTStore from '../user/JWTStore'
type LoginRequest = {
    email: string
    password: string
}
type LoginResponse = {
    token: string
}

type RegisterRequest = {
    email: string
    password: string
}


export async function login(loginRequest: LoginRequest): Promise<LoginResponse> {
        let { token } = (await axios.post(getURL('authentication/login'), loginRequest)).data
        JWTStore.setJWT(token)
        return token
}


export  function register(registerRequest:RegisterRequest): Promise<any> {
   return axios.post(getURL('authentication/signup'), registerRequest)
}

export async function logout(){
    JWTStore.clear()
}

