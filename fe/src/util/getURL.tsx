export default function getURL(path?: string) {
    const host = process.env.REACT_APP_LOCAL_PATH || 'http://localhost:8080'
    const base = `${host}/api` 

    const urlPath = path ?  `/${path}` : '' 
    return encodeURI(base+urlPath)
}