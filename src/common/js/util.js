//洗牌函数
export function shuffle(arr) {
    let tArr = arr.slice();
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