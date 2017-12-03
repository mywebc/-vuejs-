import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

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

// 进一步优化，不能每次currentsong发生变化时，都要调用他
  getLyric () {
    // 如果有歌词就直接返回歌词，注意是promise对象
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          // eslint-disable-next-line
          reject('no lyric')
        }
      })
    })
  }
}

// 这个函数拿到原始数据后，详细的罗列整理属性
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
export function filterSinger (singer) {
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
