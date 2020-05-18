import storage from 'good-storage'


const SEARCH_KEY = 'history';
const MAX_LENGTH = 12;
const LAST_KEY = 'last'
const FAVOURATE_KEY = 'favourate'
const LOVETAG = 'lovetag'

export function saveSearch(query) { //将搜索词写入到数组里 并缓存到本地
    let history = storage.get(SEARCH_KEY, []);
    let index = history.findIndex((item) => {
        return item == query
    })
    if(index == 0) {
        return history
    }
    if(index > 0) {
        history.splice(index,1)
    }
    history.unshift(query);
    if(history.length > MAX_LENGTH) {
        history.pop()
    }
    storage.set(SEARCH_KEY, history)
    return history
}

export function loadSearch() {
    return storage.get(SEARCH_KEY,[])
}

export function deleteSearch(query) {
    let history = storage.get(SEARCH_KEY, []);
    let index = history.findIndex((item) => {
        return item == query
    })
    history.splice(index,1);
    storage.set(SEARCH_KEY, history);
    return history
}

export function clearSearch() {
    storage.remove(SEARCH_KEY);
    return []
}


//封装
export function saveStorage(key, val) {
    let Storage = storage.get(key, []);
    
    let index = Storage.findIndex((item) => {
        return item.id == val.id
    })
    if(index == 0) {
        return Storage
    }
    if(index > 0) {
        Storage.splice(index,1)
    }
    Storage.unshift(val);
    if(Storage.length > MAX_LENGTH) {
        Storage.pop()
    }
    storage.set(key, Storage)
    return Storage
}
export function loadStorage(key) {
    return storage.get(key,[])
}

export function deleteStorage(key,val) {
    let Storage = storage.get(key, []);
    let index = Storage.findIndex((item) => {
        return item.id == val.id
    })
    Storage.splice(index,1);
    storage.set(key, Storage);
    return Storage
}

export function clearStorage(key) {
    storage.remove(key);
    return []
}
