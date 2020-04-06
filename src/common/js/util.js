//洗牌函数
export function shuffle(arr) {
    // let tArr = arr.slice();
    let tArr = JSON.parse(JSON.stringify(arr))
    for(let i = 0; i<tArr.length; i++){
        let randIndex = Math.floor(Math.random()*(i+1));
        let temp = tArr[i];
        tArr[i] = tArr[randIndex];
        tArr[randIndex] = temp;
    }
    return tArr;
}
export function findIndex(list, song) {
    return list.findIndex((item) => {
       return item.song_id == song.song_id 
    })
}
//节流函数
export function debounce(func, delay) {
    let timer = null;
    return function(...args) {  // let args = arguments
        if(timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay)
    }
}