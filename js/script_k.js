'use strict';

function changeImg(i) {
if(i.src== "https://robohash.org/robo"||i.src=="https://robohash.org/robo4"){
    i.src = i.bln ? "https://robohash.org/robo" : "https://robohash.org/robo4";
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

