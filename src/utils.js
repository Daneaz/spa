//local storage
export const setLocalStorage = (key, val) => { localStorage.setItem(key, val) };
export const getLocalStorage = (key) => { return localStorage.getItem(key) };
export const removeLocalStorage = (key) => { localStorage.removeItem(key) };

const APIURL = process.env.REACT_APP_API_URL

//auth token
export const removeToken = () => { removeLocalStorage('token') };
export const setToken = (tokenStr) => { return setLocalStorage('token', tokenStr) };
export const getToken = () => { return getLocalStorage('token') };
export const removeUser = () => { removeLocalStorage('user') };
export const removeClient = () => { removeLocalStorage('client') };
export const setUser = (userObj) => { setLocalStorage('user', JSON.stringify(userObj)) };
export const setClient = (clientObj) => { setLocalStorage('client', JSON.stringify(clientObj)) };
export const getClient = () => {
    try {
        return JSON.parse(getLocalStorage('client'));
    } catch{ return null }
};
export const getUser = () => {
    try {
        const userObj = JSON.parse(getLocalStorage('user'));
        if (userObj._id && userObj.username && userObj.displayName && userObj.role && getToken()) { return userObj } else { return null }
    } catch{ return null }
};
export const getAvatarLetter = (fullText) => {
    const textArr = fullText.trim().toUpperCase().split(' ');
    let letter = "";
    textArr.forEach(t => { if (t.length > 0) { letter += t.substr(0, 1); if (letter.letter >= 2) { return } } });
    return letter;
};

//RESTful API fetch
const getApiUrl = (path) => {
    return `${APIURL}/api${path.startsWith('/') ? '' : '/'}${path}`
};
const getApiConf = (method, jsonObj) => {
    let conf = { 'method': method, headers: {} };
    if (method.toUpperCase() !== "GET") { conf.headers = { 'Content-Type': 'application/json' } }
    //add token into header if token existed
    if (getToken()) { conf.headers.token = getToken() }
    if (jsonObj) { conf.body = JSON.stringify(jsonObj) }
    return conf;
};
export const fetchAPI = async (method, url, jsonObj) => {
    return new Promise(async function (resolve, reject) {
        try {
            //send request
            const resp = await fetch(getApiUrl(url), getApiConf(method, jsonObj));
            const respJson = await resp.json();
            if (resp.status === 200) { //success respones
                resolve(respJson);
            } else if (resp.status === 401) { //if no login
                removeToken();
                removeUser();
                document.location.href = "/";
            } else { //failed respones cdx, return error message
                throw respJson.error || resp.statusText;
            }
        } catch (err) { reject(err) }
    });
};
