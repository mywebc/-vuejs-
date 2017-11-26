export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    // 抓取的数据虽然没有地址，其实他的地址都是固定的，我们只需要拼接字符串即可
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

// 在这里处理musicData中的singer
function filterSinger (singer) {
  let ret = []
  // 如果传入的singer是空，那么我们也return空
  if (!singer) {
    return ''
  }
  // 否则push name到ret里
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
