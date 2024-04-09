/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scrool active song into view
 * 10. Play song when click
 * 
 */


const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER' 

const heading = $('header h3')
const headingSinger = $('header h6')
const cdThumd = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')


const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    // local storage lưu dưex liệu cục bộ trên máy tính của người dùng
    // dữ liệu trả về là dạng chuỗi JSON 
    config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    
    songs : [
        {
            name: 'Thương em là điều anh không thể ngờ',
            singer : 'Trường',
            path : './asset/song/song1.mp3',
            image : './asset/image/1thuongem.jpg'
        },
        {
            name: 'Em là quá khứ không thể quên',
            singer : 'Thiên Tú',
            path : './asset/song/song2.mp3',
            image : './asset/image/2emlaqk.webp'
        },
        {
            name: 'Ai bình yên hơn ai đậm sâu hơn',
            singer : 'Dương Yến Phi',
            path : './asset/song/song3.mp3',
            image : './asset/image/3aibinhyen.webp'
        },
        {
            name: 'Tháng mấy em nhớ anh',
            singer : 'Trường',
            path : './asset/song/song4.mp3',
            image : './asset/image/4thangmay.webp'
        },
        {
            name: 'Nổi Gió Rồi',
            singer : 'Châu Thâm',
            path : './asset/song/song5.mp3',
            image : './asset/image/5noigio.webp'
        },
        {
            name: 'Luyến',
            singer : 'Kha',
            path : './asset/song/song6.mp3',
            image : './asset/image/6luyen.webp'
        },
        {
            name: 'Haru Haru',
            singer : 'Huy Lee Prod',
            path : './asset/song/song7.mp3',
            image : './asset/image/7haru.jpg'
        },
        {
            name: 'Ghé qua',
            singer : 'Dick x PC x Tofu',
            path : './asset/song/song8.mp3',
            image : './asset/image/8ghequa.webp'
        },
        {
            name: 'Chỉ còn lại tình yêu',
            singer : 'Trường',
            path : './asset/song/song9.mp3',
            image : './asset/image/9chiconlaity.jpg'
        },
        {
            name: 'Cá Lớn',
            singer : 'Châu Thâm',
            path : './asset/song/song10.mp3',
            image : './asset/image/10calon.webp'
        },
        {
            name: 'Chỉ còn lại tình yêu',
            singer : 'Dương',
            path : './asset/song/song11.mp3',
            image : './asset/image/11duong.png'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },


    // tạo thêm thuộc tính cho object
    defineProperties : function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    hendleEvent : function() {
        const _this = this
        const cdWidth = cd.offsetWidth


        // xử lí CD quay / dừng :
        const cdThumdAnimate = cdThumd.animate([
            {transform : 'rotate(360deg)'}
        ],{
            duration : 15000 , // thời gian quay hết một vòng
            iterations : Infinity // lần lặp lại : vô hạn
        })
        cdThumdAnimate.pause()

        // xử lí phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ?  newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth 
        }


        // xử lý khi click :
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            }else {
                audio.play()
            }
        } 
        // khi song được play :
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumdAnimate.play()
        }
        // khi song bij pause : 
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumdAnimate.pause()
        }

        //  khi tiến độ bài hát thay đổi : 
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = audio.currentTime / audio.duration * 100
                progress.value = progressPercent
            }
        }

        // xử lí khi tua song : 
        progress.onchange = function(e) {
            const seekTime = audio.duration * e.target.value / 100 
            audio.currentTime = seekTime
        }
        // onchange là sự kiện khi focus vào phần tử 
        // e là đại diện cho sự kiện 
        // e.target trả về DOM của phần tử được onchange 

        // khi next song:
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // khi prev song :
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render() // khi thêm active vào DOM để đổi màu bài hát đang phát thì
            // chạy lại render
            _this.scrollToActiveSong()


        }

        // bật / tắt random :
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            // lưu vào local application để nhớ trạng thái bật tắt trước khi thoát ứng dụng
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active' , _this.isRandom)
        }
        // cú pháp classList.toggle(className, force) 
        // là cú pháp xóa hoặc thêm class vào 1 element
        // force không bắt buộc
        // force là true thì thêm , force là false thì xóa 


        // xử lí khi lặp lại một song : 
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            // lưu vào local application để nhớ trạng thái bật tắt trước khi thoát ứng dụng
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active' , _this.isRepeat)
        }


        // xử lí next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            }else{
                nextBtn.click()    
            }
        }

        // lắng nghe hành vi click vào playlist:
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')) {
                // xử lí khi click vào song : 
                if(songNode) {  
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // xử lí khi ấn vào option :
                if(e.target.closest('.option')) {
                }
            }
        }

     },

     scrollToActiveSong : function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth', 
                block: 'end'
            })
        },100)
     },



    loadCurrentSong : function () {
       
        heading.textContent = this.currentSong.name
        headingSinger.textContent = `- ${this.currentSong.singer} -`
        cdThumd.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong : function() {

        this.currentIndex++
        if(this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()

    },

    prevSong : function() {

        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()

    },


    playRandomSong : function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function() {

        // gán cấu cònfig vào ứng dụng
        this.loadConfig()

        // định nghĩa các thuộc tính cho object
        this.defineProperties()

        // lắng nghe / xử lý các sự kiện ( DOM Event)
        this.hendleEvent()

        // tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // render playlist
        this.render()

        repeatBtn.classList.toggle('active' , this.isRepeat)
        randomBtn.classList.toggle('active' , this.isRandom)

    }
}
app.start()