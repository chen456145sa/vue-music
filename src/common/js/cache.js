import storage from 'good-storage'


const SEARCH_KEY = 'history';
const MAX_LENGTH = 10;
export function saveSearch(query) { //将搜索词写入到数组里 并缓存到本地
    let history = storage.get(SEARCH_KEY, []);
    let index = history.findIndex((item) => {
        return item == query
    })
    if(index == 0) {
        return
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
