/* General Load / Variables
======================================*/
var playlist;
var duration;
var playPercent;
var bufferPercent;
var currentSong = 0;
var next = document.getElementById("next");
var song = document.getElementById("name");
var timer = document.getElementById("timer");
var music = document.getElementById("music");
var album = document.getElementById("album_name");
var artist = document.getElementById("artist_name");
var volume = document.getElementById("volume");
var playButton = document.getElementById("play");
var timeline = document.getElementById("slider");
var playhead = document.getElementById("elapsed");
var previous = document.getElementById("previous");
var pauseButton = document.getElementById("pause");
var bufferhead = document.getElementById("buffered");
var artwork = document.getElementsByClassName("album_picture")[0];
var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
var visablevolume = document.getElementsByClassName("volume")[0];

 
music.addEventListener("ended", _next, false);
music.addEventListener("timeupdate", timeUpdate, false);
music.addEventListener("progress", 	bufferUpdate, false);

/* Functions
======================================*/
function CreateTableFromJSON() {
	var col = [];
	for (var i = 0; i < playlist.length; i++) {
		for (var key in playlist[i]) {
			if(col.indexOf(key) === -1) {
				col.push(key);
			}
		}
	}
	
	var table = document.createElement("table");
	
	var tr = table.insertRow(-1);
	
	
	for (var i = 0; i < playlist.length; i++) {
	
		tr = table.insertRow(-1);
	
		for (var j = 0; j < 3; j++) {
			var tabCell = tr.insertCell(-1);
			tabCell.innerHTML = playlist[i][col[j]];
		}
	}
	
	var divContainer = document.getElementById("showData");
			divContainer.innerHTML = "";
			divContainer.appendChild(table);
	}

function load(){
	pauseButton.style.visibility = "hidden";
	song.innerHTML = playlist[currentSong]['name'];
	song.title = playlist[currentSong]['name'];
	album.innerHTML = playlist[currentSong]['album_name'];
	album.title = playlist[currentSong]['album_name'];
	artist.innerHTML = playlist[currentSong]['artist_name'];
	artist.title = playlist[currentSong]['artist_name'];
	artwork.setAttribute("style", "background:url('"+playlist[currentSong]['album_picture']+"'), center no-repeat;");
	music.innerHTML = '<source src="'+playlist[currentSong]['preview_url']+'" type="audio/mp3">';
	music.load();
	CreateTableFromJSON();
}
function reset(){ 
	fireEvent(pauseButton, 'click');
	playhead.style.width = "0px";
	bufferhead.style.width = "0px";
	timer.innerHTML = "0:00";
	music.innerHTML = "";
	currentSong = 0; // set to first song, to stay on last song: currentSong = playlist.length - 1;
	song.innerHTML = playlist[currentSong]['name'];
	song.title = playlist[currentSong]['name'];
	album.innerHTML = playlist[currentSong]['album_name'];
	album.title = playlist[currentSong]['album_name'];
	artist.innerHTML = playlist[currentSong]['artist_name'];
	artist.title = playlist[currentSong]['artist_name'];
	artwork.setAttribute("style", "background:url('"+playlist[currentSong]['album_picture']+"'), center no-repeat;");
	music.innerHTML = '<source src="'+playlist[currentSong]['preview_url']+'" type="audio/mp3">';
	music.load();
}	

function formatSecondsAsTime(secs, format) {
  var hr  = Math.floor(secs / 3600);
  var min = Math.floor((secs - (hr * 3600))/60);
  var sec = Math.floor(secs - (hr * 3600) -  (min * 60));
  if (sec < 10){ 
    sec  = "0" + sec;
  }
  return min + ':' + sec;
}
function timeUpdate() {
	bufferUpdate();
	playPercent = timelineWidth * (music.currentTime / duration);
	playhead.style.width = playPercent + "px";
	timer.innerHTML = formatSecondsAsTime(music.currentTime.toString());
}
function bufferUpdate() {
	bufferPercent = timelineWidth * (music.buffered.end(0) / duration);
	bufferhead.style.width = bufferPercent + "px";
}

function fireEvent(el, etype){
	if (el.fireEvent) {
		el.fireEvent('on' + etype);
	} else {
		var evObj = document.createEvent('Events');
		evObj.initEvent(etype, true, false);
		el.dispatchEvent(evObj);
	}
}
function _next(){
	if(currentSong == playlist.length - 1){
		reset();
	} else {
		fireEvent(next, 'click');
	}
}
playButton.onclick = function() {
	music.play();
}
pauseButton.onclick = function() {
	music.pause();
}
music.addEventListener("play", function () {
	playButton.style.visibility = "hidden";
	pause.style.visibility = "visible";
}, false);
music.addEventListener("pause", function () {
	playButton.style.visibility = "visible";
	pause.style.visibility = "hidden";
}, false);

next.onclick = function(){
	playhead.style.width = "0px";
	bufferhead.style.width = "0px";
	timer.innerHTML = "0:00";
	music.innerHTML = "";
	if((currentSong + 1) == playlist.length){
		currentSong = 0;
		music.innerHTML = '<source src="'+playlist[currentSong]['preview_url']+'" type="audio/mp3">';
	} else {
		currentSong++;
		music.innerHTML = '<source src="'+playlist[currentSong]['preview_url']+'" type="audio/mp3">';
	}
	song.innerHTML = playlist[currentSong]['name'];
	song.title = playlist[currentSong]['name'];
	album.innerHTML = playlist[currentSong]['album_name'];
	album.title = playlist[currentSong]['album_name'];
	artist.innerHTML = playlist[currentSong]['artist_name'];
	artist.title = playlist[currentSong]['artist_name'];
	artwork.setAttribute("style", "background:url('"+playlist[currentSong]['album_picture']+"'), center no-repeat;");
	music.load();
	duration = music.duration;
	music.play();
}
	previous.onclick = function(){
		playhead.style.width = "0px";
	bufferhead.style.width = "0px";
	timer.innerHTML = "0:00";
	music.innerHTML = "";
	if((currentSong - 1) == -1){
		currentSong = playlist.length - 1;
		music.innerHTML = '<source src="'+playlist[currentSong]['preview_url']+'" type="audio/mp3">';
	} else {
		currentSong--;
		music.innerHTML = '<source src="'+playlist[currentSong]['preview_url']+'" type="audio/mp3">';
	}
	song.innerHTML = playlist[currentSong]['name'];
	song.title = playlist[currentSong]['name'];
	album.innerHTML = playlist[currentSong]['album_name'];
	album.title = playlist[currentSong]['album_name'];
	artist.innerHTML = playlist[currentSong]['artist_name'];
	artist.title = playlist[currentSong]['artist_name'];
	artwork.setAttribute("style", "background:url('"+playlist[currentSong]['album_picture']+"'), center no-repeat;");
	music.load();
	duration = music.duration;
	music.play();
}
volume.oninput = function(){
	music.volume = volume.value;
	visablevolume.style.width = (80 - 11) * volume.value + "px";
}
music.addEventListener("canplay", function () {
	duration = music.duration;
}, false);


// var element = document.getElementById("wrapper");


// element.appendChild(table);

// var element = document.getElementById("wrapper");

// var ul = document.createElement("ul");
// element.appendChild(ul);


// var li = document.createElement("li");
// ul.appendChild(li);

// var text = document.createTextNode(playlist);
// li.appendChild(text);






var xhr = new XMLHttpRequest();
xhr.onload = function() {
    if (xhr.status === 200) {
		playlist = JSON.parse(xhr.responseText);
		load();
		
    }
    else {
        alert('Request failed.  Returned status of ' + xhr.status);
    }
};
xhr.open('GET', 'http://localhost/playeraudio/json/lomepal.json');
xhr.send();