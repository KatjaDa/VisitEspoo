'use strict';

// function to change images by clicking and toggle betweeen 2 pictures by clicking
function changeImg(i) {
if(i.src== "https://robohash.org/robo"||i.src=='https://users.metropolia.fi/~katjadah/mediakurssin-palautukset/kat.jpg'){
    i.src = i.bln ? "https://robohash.org/robo" : 'https://users.metropolia.fi/~katjadah/mediakurssin-palautukset/kat.jpg';
    i.bln = !i.bln; 
} if (i.src== "https://robohash.org/robo2"||i.src=="https://robohash.org/robo5"){
    i.src = i.bln ? "https://robohash.org/robo2" : "https://robohash.org/robo5";
    i.bln = !i.bln; 
}

if(i.src== "https://robohash.org/robo3"||i.src=="https://robohash.org/robo6"){
    i.src = i.bln ? "https://robohash.org/robo3" : "https://robohash.org/robo6";
    i.bln = !i.bln;
}
}

// Here starts api fetch for movies
// constant to api url
const apiurl = "https://api.tvmaze.com/search/shows?q=horror";

const searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', getData);

//function for fetching data
function getData() {
    console.log("Sent query" + apiurl);
    doSearch(apiurl);
}

function doSearch(apiurl) {
    // function for fetching information
    fetch(apiurl).then(function (response) {
        return response.json();
    }).then(function (json) {
        showAnswer(json);				// processing data
    }).catch(function (error) {           // If there is an error
        console.log(error);             // it will be logged to console
    });
}

let showAnswer = (jsonData) => {
    //loggin answer table to console
    console.log("JSON table:");
    console.log(jsonData);

    const section = document.getElementById("searchResults");
    //emptying main before adding search results, if user makes several searches.
    section.innerHTML = "";
    let imgAdd;
//looping through array, started from 3rd search result
    for (let i = 2; i < jsonData.length; i++) {
        // if image picture is not found, image will be changed
        try {
            imgAdd = jsonData[i].show.image.medium;
        } catch(error){
            imgAdd="images/tunnel_monster.jpg";
        }

        section.innerHTML += `<article id="horrorShows">
        <h3>${jsonData[i].show.name}</h3>
        <img src=${imgAdd} alt="title" width="300px;" height="auto">
        <p>Language: ${jsonData[i].show.language}</p>
        <a href=${jsonData[i].show.url} target="_blank">More info from TVMAZE</a>
        </article>`
    }

}