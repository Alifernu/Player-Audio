/* Music 
======================================*/

var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://localhost/playeraudio/json/lomepal.json');
xhr.onload = function() {
	console.dir(xhr);
    if (xhr.status === 200) {
        var playlist = JSON.parse(xhr.responseText);
    }
    else {
        alert('Request failed.  Returned status of ' + xhr.status);
    }
};
xhr.send();


// var playlist = [
// 	{
// 		"name"    : "House of the Rising Sun",
// 		"album_name"   : "The Animals",
// 		"artist_name"  : "The Animals",
// 		"album_picture" : "http://upload.wikimedia.org/wikipedia/en/thumb/a/a8/Rising_sun_animals_US.jpg/220px-Rising_sun_animals_US.jpg",
// 		"preview_url"     : "http://retro-disko.ru/6/music/016.mp3"
// 	},
// 	{
// 		"name"    : "Superstition",
// 		"album_name"   : "Talking Book",
// 		"artist_name"  : "Stevie Wonder",
// 		"album_picture" : "https://i.imgur.com/Py4XcBT.png",
// 		"preview_url"     : "http://vocaroo.com/media_command.php?media=s1WYNvqulYH9&command=download_mp3"
// 	},
// 	{
// 		"name"    : "I Need You Back",
// 		"album_name"   : "Premiere",
// 		"artist_name"  : "The Noisy Freaks",
// 		"album_picture" : "http://i1285.photobucket.com/albums/a583/TheGreatOzz1/Hosted-Images/Noisy-Freeks-Image_zps4kilrxml.png",
// 		"preview_url"     : "http://kirkbyo.net/Assets/The-Noisy-Freaks.mp3"
// 	},
// 	// {
// 	// 	"song"    : "Yeux disent",
// 	// 	"album"   : "FLIP (Deluxe)",
// 	// 	"artist"  : "Lomepal",
// 	// 	"artwork" : "https://s2.qwant.com/thumbr/0x0/d/f/cea0917cf81d6b364fc76cd545bf5954ff2348b7148cb87893401114b0db76/170x170bb.jpg?u=https%3A%2F%2Fis1-ssl.mzstatic.com%2Fimage%2Fthumb%2FMusic118%2Fv4%2F9a%2Ff6%2F4b%2F9af64be7-6734-5526-21c1-cb3a294526b8%2F3663729044303_cover.jpg%2F170x170bb.jpg&q=0&b=1&p=0&a=0",
// 	// 	"mp3"	  : "https://audio-ssl.itunes.apple.com/apple-assets-us-std-000001/AudioPreview128/v4/69/5a/f0/695af0ed-7814-6dd5-a977-1853c3f849cd/mzaf_6527844017270148074.plus.aac.p.m4a"
// 	// },
// 	{
// 		"name"    		: "Yeux disent",
// 		"album_name"    : "FLIP (Deluxe)",
// 		"artist_name"   : "Lomepal",
// 		"album_picture" : "https://s2.qwant.com/thumbr/0x0/d/f/cea0917cf81d6b364fc76cd545bf5954ff2348b7148cb87893401114b0db76/170x170bb.jpg?u=https%3A%2F%2Fis1-ssl.mzstatic.com%2Fimage%2Fthumb%2FMusic118%2Fv4%2F9a%2Ff6%2F4b%2F9af64be7-6734-5526-21c1-cb3a294526b8%2F3663729044303_cover.jpg%2F170x170bb.jpg&q=0&b=1&p=0&a=0",
// 		"preview_url"	: "https://audio-ssl.itunes.apple.com/apple-assets-us-std-000001/AudioPreview128/v4/69/5a/f0/695af0ed-7814-6dd5-a977-1853c3f849cd/mzaf_6527844017270148074.plus.aac.p.m4a"
// 	}
// ];

/* General Load / Variables
======================================*/
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
load();

/* Functions
======================================*/
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