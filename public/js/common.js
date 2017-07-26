// Ugis Germanis
// My javascript
window.addEventListener('WebComponentsReady', function(e) {
    console.log('webcomponents are ready!!!');
    //Slider events
    music.slider = document.getElementById("slider");
    slider.addEventListener("mousedown", function(){
        music.sliderDrag = true;
    });
    slider.addEventListener("mouseup", function(){
        music.sliderDrag = false;
    });
    slider.addEventListener("change", function(e){
        var estimate = music.mainSound.durationEstimate;
        music.mainSound.setPosition((estimate/1000) * e.target.value);
        music.sliderDrag = false;
    });
    document.getElementById("menubutton").addEventListener("click", function(e){
        startDrawer.toggle();
    });
    //Sorter
    document.getElementById("startDrawer").addEventListener("change", function(e){
        if(e.target && e.target.nodeName == "PAPER-BUTTON") {
            var sorters = document.getElementsByClassName("sorter");
            for (i=0; sorters.length > i; i++){
                sorters[i].active = false;
            }
            music.selected = e.target.id.replace("post-", "");
            e.target.active = true;
            document.dispatchEvent(music.sort);
        }
    }, false);
    //Playback controls
    document.getElementById("next").addEventListener("click", function(e){
        playnext();
    });
    document.getElementById("previous").addEventListener("click", function(e){
        playprevious();
    });
    document.getElementById("playit").addEventListener("click", function(e){
        play();
    });
    document.getElementById("pauseit").addEventListener("click", function(e){
        pause();
    });
    //Sort event handler
    document.addEventListener("sort", function(e){
        music.request.open("GET", [music.url, "/api?sort=", music.selected].join(""));
        music.request.send();
    }, false);
    //Init sound object
    soundManager.setup({
        url: 'bower_components/SoundManager2/swf/soundmanager2_flash9.swf',
        flashVersion: 9,
        preferFlash: false,
        onready: function() {
            soundManager.createSound({
                id: "main",
                url: "",
                multiShot:false,
                onfinish: function() {
                    music.previous = music.current;
                    $(["#sound", music.current].join("")).attr("playing", false);
                    if (music.current == (music.playlist.length - 1)) {
                        music.current = 0;
                    } else {
                        music.current++;
                    }
                    this.unload();
                    playSong(music.current);
                    $.get(
                        [music.url, "/count"].join(""),
                        {"id" : music.playlist[music.previous].ID}
                    );
                },
                onstop: function(){
                    $(["#sound", music.previous].join("")).attr("playing", false);
                    this.unload();
                },
                whileplaying: function(){
                    if (music.sliderDrag == false){
                        music.slider.value = (this.position / this.durationEstimate) * 1000;
                    }
                },
            });
            music.mainSound = soundManager.getSoundById("main");
        }
    });
    //Default sort
    document.getElementById(music.selected).active=true;
    document.dispatchEvent(music.sort);
    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('nexttrack', function() {
            playnext();
        });
        navigator.mediaSession.setActionHandler('previoustrack', function() {
            playprevious();
        });
        navigator.mediaSession.setActionHandler('play', function() {
            play();
        });
        navigator.mediaSession.setActionHandler('pause', function() {
            pause();
        });
    }
});
//Main object
var music = {
    selected: "byartist",
    sort: new Event('sort'),
    playlist: null,
    mainSound: null,
    request: new XMLHttpRequest(),
    url: [document.location.protocol, "//", window.location.host].join(""),
    current: 0,
    previous: 0,
    slider: null,
    sliderDrag: false,
    render: function(){
        $("#playlist").empty();
        var playlist = [""];
        for (i=0; i<this.playlist.length; i++) {
            playlist.push("<li id='sound", i, "' class='song' index='",i ,"'>", this.playlist[i].Title, " - ", this.playlist[i].Artist, "</li>");
        }
        $("#playlist").append(playlist.join(""));
        document.getElementById("playlist").addEventListener('click', function(e){
            if(e.target && e.target.nodeName == "LI") {
                music.previous = music.current;
                music.current= e.target.getAttribute("index");
                playSong(music.current);
            }
        });
    },
};

music.request.onloadend = function(){
    if (this.readyState = 4 && this.status == 200) {
        music.playlist = JSON.parse(this.responseText);
        $("#playlist").attr('loading', true);
        music.render();
        $("#playlist").attr('loading', false);
    }
}
//Play song by id
function playSong(id){
    music.mainSound.stop();
    $(["#sound", id].join("")).attr("playing", true);
    music.mainSound.url = [music.url, "/stream?id=", music.playlist[id].ID].join("");
    music.mainSound.play();
    document.getElementsByTagName("body")[0].style.backgroundImage = ["url(", music.url, "/art?id=", music.playlist[id].ID, ")"].join("");
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: music.playlist[music.current].Title,
            artist: music.playlist[music.current].Artist,
            album: music.playlist[music.current].Album,
            artwork: [{ src: [music.url, "/art?id=", music.playlist[id].ID].join(""),}],
        });
    }
}

//Playback functions
function playnext(){
    music.previous = music.current;
    if (music.current == (music.playlist.length - 1)) {
        music.current = 0;
    } else {
        music.current++;
    }
    playSong(music.current);
}

function playprevious(){
    music.previous = music.current;
    if (music.current == 0) {
        music.current = music.playlist.length - 1
    } else {
        music.current--;
    }
    playSong(music.current);
}

function play(){
    if (music.mainSound.paused){
        music.mainSound.resume();
    } else {
        playSong(music.current);
    }
}

function pause(){
    music.mainSound.pause();
}