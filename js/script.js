console.log("Let's start writing javascript");
let currentSong = new Audio();
let songs;
let currFolder;
let songNameWithExtension;

function formatTime(seconds) {
    // Calculate minutes and seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.round(seconds % 60);

    // Add leading zero if seconds is less than 10
    var formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    // Combine minutes and seconds with ':'
    var timeString = minutes + ":" + formattedSeconds;

    return timeString;
}

async function getsongs(folder) {
    currFolder = folder;
    let response = await fetch(`/${currFolder}/`)
    let htmlContent = await response.text();
    // console.log(response);
    let tempdiv = document.createElement("div")
    tempdiv.innerHTML = htmlContent;
    let anchorElements = tempdiv.getElementsByTagName("a")

    songs = []

    for (let element of anchorElements) {
        //console.log(element.href); // logout each href
        let url = new URL(element.href, `${window.location.origin}/${currFolder}/`);
        if (url.pathname.endsWith(".mp3") || url.pathname.endsWith(".m4a")) {
            songNameWithExtension = url.pathname.split("/").pop();
            songs.push(songNameWithExtension);
        }
    }

    if(songs.length > 0){
        songNameWithExtension = songs[0];
        currentSong.src = `/${currFolder}/${songNameWithExtension}`;
    }

    // for (let index = 0; index < anchorElements.length; index++) {
    //     const element = anchorElements[index];
    //     if (element.href.endsWith(".mp3")) {
    //         let alpha = element.href.split("/songs/")[1]
    //         songs.push(alpha.split(".mp3")[0])
    //     }

    // }
    // console.log(songs);

    //addding the songs/showing all the songs in the playlist
    let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0]

    songUL.innerHTML = ""

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
                            <img class="invert" src="svgs/music-note-square-02-stroke-rounded.svg" alt="music svg">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ").replace(/\.(mp3|m4a)$/,"")}</div>
                                <div>koi to hai</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="svgs/play-stroke-rounded.svg" alt="play svg">
                            </div>
        </li>`;
    }

    //playing the first song

    //get all elements with the class "songbutton"
    // let buttons = document.getElementsByClassName("songbuttons");

    //tring to use the play option when user interact with it due to the autoplay policy of browsers
    // loop through all elements and add eventListener to each
    // for (let button of buttons) {
    //     var audio = new Audio(songs[0]);
    //     // button.addEventListener("click",function(){
    //     //     audio.play();
    //     // })
    //     audio.addEventListener("loadeddata", () => {
    //         console.log(audio.duration, audio.currentSrc, audio.currentTime)
    //     });
    // }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            // const songNameWithExtension = songs.find(s=> s.startsWith(e.querySelector(".info").firstElementChild.innerHTML.replaceAll(" ","%20"))); //e.querySelector(".info").firstElementChild.innerHTML.replaceAll(" ", "%20");
            songNameWithExtension = e.querySelector(".info").firstElementChild.innerHTML.replaceAll(" ", "%20");
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            // playMusic(e.querySelector(".info").firstElementChild.innerHTML)
            // console.log(songName)
            playMusic(songNameWithExtension);
        });
    });

    // return songs

}

const playMusic = (songNameWithExtension) => {
    // Decode first if it's already encoded
    // const decodedTrack = decodeURIComponent(track);
    // Now safely encode it
    // Ensure the path matches exactly where the files are located on the server 
    currentSong.src = `/${currFolder}/${songNameWithExtension}`;
    currentSong.play().catch(e => console.error("Error playing the track:", e));
    play.src = "svgs/pause-stroke-rounded.svg"
    document.querySelector(".songinfo").innerHTML = songNameWithExtension.replaceAll("%20", " ").replace(/\.(mp3|m4a)$/, "");
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function DisplayAlbums() {
    let response = await fetch(`/songsFolder/`)
    let htmlContent = await response.text();
    // console.log(response);
    let tempdiv = document.createElement("div")
    tempdiv.innerHTML = htmlContent;
    let allanchors = tempdiv.getElementsByTagName("a");
    // console.log(allanchors);
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(allanchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songsFolder") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // get the metadata of the folder
            let b = await fetch(`/songsFolder/${folder}/info.json`)
            let responseb = await b.json();
            // console.log(b);
            // console.log(responseb);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"
                    color="#000000" fill="black">
                    <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154L18.8906 12.846C19.0365 11.7084 19.0365 12.2916 18.8906 12.846L18.8906 12.846Z" />
                </svg>
            </div>
            <img src="/songsFolder/${folder}/cover.jpeg" alt="">
            <h4>${responseb.title}</h4>
            <p>${responseb.description}</p>
        </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            // console.log(item.currentTarget)
            await getsongs(`songsFolder/${item.currentTarget.dataset.folder}`)
            // console.log(songs)
            currentSong.src = `/${currFolder}/${songNameWithExtension}`;
            playMusic(songs[0]);

        })
    })

}

async function main() {
    await getsongs("songsFolder/ncs")
    // console.log(songs)

    // Set the src of currentSong to the URL of the first song
    if (songs.length > 0) {

        // Decode first songsrc to avoid double encoding
        // const firstSongDecoded = decodeURIComponent(songs[0]);

        currentSong.src = `/${currFolder}/${songNameWithExtension}`;
        // console.log(currentSong.src);
        // currentSong.play().catch(e => console.error("Error playing the track:", e));
        document.querySelector(".songinfo").innerHTML = `${songs[0]}`.replaceAll("%20", " ");
        document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    }

    // Display all the albums on the page
    DisplayAlbums();

    // Attach an event listener to play,next and previous

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svgs/pause-stroke-rounded.svg"
        }
        else {
            currentSong.pause();
            play.src = "svgs/play-stroke-rounded.svg"
        }
    })

    // Listen for timeupdate function

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event Listener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        // console.log(e.offsetX,e.target.getBoundingClientRect().width);
        let percent_time = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        // console.log(percent_time);
        document.querySelector(".circle").style.left = percent_time + "%";
        currentSong.currentTime = (currentSong.duration) * percent_time / 100;
    })

    // Add an Event Listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an Event Listener to close the menu
    document.querySelector(".closeimg").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

    // Add an event listener to previous and next
    previous.addEventListener("click", () => {
        console.log("previous clicked")
        // const currentSrcDecoded = decodeURIComponent(currentSong.src.split("/").pop().replace(".mp3",""));
        // console.log(currentSrcDecoded);
        console.log(currentSong.src.split("/").pop().replace(/\.(mp3|m4a)$/,""));
        console.log(songs);
        let index = songs.indexOf(currentSong.src.split("/").pop());
        console.log(index)
        if ((index - 1) >= 0) {
            playMusic(`${currFolder}`[index - 1])
        }
    })

    next.addEventListener("click", () => {
        console.log("next clicked")
        // const currentSrcDecoded = decodeURIComponent(currentSong.src.split("/").pop().replace(".mp3",""));
        // console.log(currentSrcDecoded);
        console.log(currentSong.src.split("/").pop().replace(/\.(mp3|m4a)$/,""));
        console.log(songs);
        // const songIndex = songs.findIndex(song => decodeURIComponent(song.trim()) === currentSrcDecoded.trim());
        // console.log("Index of current song is : ", songIndex);
        let index = songs.indexOf(currentSong.src.split("/").pop());
        console.log(index)
        if ((index + 1) < songs.length) {
            playMusic(`${currFolder}`[index + 1])
        }
    })

    // Add an Event Listener to volume
    let earlierRange;
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e, e.target, e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100;
        earlierRange = parseInt(e.target.value);
        if (currentSong.volume > 0){
            document.querySelectorAll('img[alt="volume"]').src = "svgs/volume-high-stroke-rounded.svg";
        }
    })

    // Add event listener to mute the track
    let trackMuted = false;
    let earliearVolume = currentSong.volume;
    document.querySelector('img[alt="volume"]').addEventListener("click",()=>{
        if(!trackMuted){

            document.querySelector('img[alt="volume"]').src = "svgs/volume-off-stroke-rounded.svg"
            trackMuted = true;
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            document.querySelector('img[alt="volume"]').src = "svgs/volume-high-stroke-rounded.svg"
            trackMuted = false;
            currentSong.volume = earliearVolume;
            document.querySelector(".range").getElementsByTagName("input")[0].value = earlierRange; 
        }
    })


}

main()

