## Ryhmän tiedot
Ryhmän jäsenet: Katja, Lea ja Jonathan. Ryhmäläisten kuvat löytyy sivulta klikkaamalla robotteja.
<!-- TÄHÄN VOISI LAITTAA LINKIN SOVELLUKSEEN -->

## Sovelluksen yleiskuvaus
VisitEspoo - verkkosivusto, josta näkee Espoon nähtävyyksiä ja mitä Espoossa voisi tehdä. Tehty huumorilla, sarkastiseen kauhutyyliin. Sivu on parodia oikeasta "visitespoo.fi"-verkkosivusta. 
Paikat eivät välttämättä ole edes Espoosta, ja ehkä käyttäjän ei enää tee mieli matkustaa Espooseen tämän sivuston nähtyään... :D   
Sisältönä on nähtävyyksien esittelyä, kuvia, video, peli, kauhuelokuvien hakuominaisuus ja kartta Espoosta.  

### Käyttötarkoitus ja käyttäjät
Käyttötarkoitus: viihdesivusto (humoristinen matkailusivusto)  
Käyttäjäryhmä: nuoret aikuiset

## Video
Tavoite: tavoitteena on esitellä katsojalle humoristisesti Espoon karmaisevaa puolta kauhutyylillä.  
Kohderyhmä: nuoret aikuiset, jotka etsivät hauskoja viihdyttäviä videoita.   
Tarve: Nähdä Espoota ennen sinne matkustamista. Videon jälkeen katsoja ei ehkä enää haluakaan matkustaa Espooseen...  
Videon kuvakäsikirjoitus löytyy tästä linkistä: [kuvakäsikirjoitus](https://github.com/KatjaDa/VisitEspoo/blob/main/storyboard.pdf)  
Tästä voi ladata videon kertojaäänet erikseen ilman erikoistehosteita: [kertojaäänen 1. ääniraita](https://github.com/KatjaDa/VisitEspoo/raw/main/audio/WelcomeToEspooVoice_NoFX.wav), [kertojaäänen 2. ääniraita](https://github.com/KatjaDa/VisitEspoo/raw/main/audio/WelcomeToEspooVoice_Whisper_NoFX.wav)
   
*Disclaimer: osa videon ja sivuston kuvien paikoista eivät todellisuudessa ole edes Espoossa, eikä tavoitteen ole kuvata Espoota realistisesti.*  

## Tyylit
Käytimme sivustolla seuraavaa väripalettia: https://coolors.co/363537-fafaff-ba3f1d  
ja fonttiparia: https://www.fontpair.co/pairing/raleway-nunito-sans   

Videon CSS-koodi, jolla on saatu video koko ruudun kokoiseksi ja reponsiiviseksi:   
```css
#iframeContainer {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
}

iframe {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
```

## Peli

"Hedgehogger" peli perustuu liikkuvien HTML-elementtien väistelyyn siilihahmolla. Siili seikkailee pelissä kuvitteellisessa Espoossa. Siellä sitä vastaan tulee "nähtävyyksiä" eli esteitä, joiden yli siilen pitää hypätä. Nämä esteet ovat HTML section-elementtejä, joissa on taustakuvina sivun teemaan liittyviä piirrustuksia. Este-elementtejä luodaan DOM metodeilla pelin oikealle puolelle ja niitä siirretään pelaajaa kohti vasemmalle "setInterval()" metodin sisällä joka millisekunti. Pelaaja voi hypätä siilihahmollaan näiden esteiden yli ja saada siitä pisteitä. Jos pelaajan hahmoelementti ja este-elementti joutuvat tarpeeksi paljon toistensa päälle peli päättyy.

### Luodaan esteitä, joilla jokaisella on joku oma satunnainen kuva kolmesta eri vaihtoehdosta: 
```js
for (let i = 0; i < numberOfObstacles; i++) {
    let whichObstacle = randomIntFromInterval(1, 3)
    const obstacle = document.createElement('section')
    obstacle.classList.add('obstacle')
    obstacle.style.backgroundImage = "url('images/obstacle_" + whichObstacle + ".png')"
    obstacle.position = 1000 + i * 60
    obstacle.style.left = obstacle.position + 'px'
    obstacles.push(obstacle)
    grid.appendChild(obstacles[i])
    randomTime += 20 * i
}
```

### Liikutetaan esteitä tai lopetetaan niiden liikuttaminen kun peli loppuu:
```js
// Move obstacle according to the slide speed if the game is not over
if (!isGameOver && obstacles.length > 0) {
        obstacles[i].position -= slideSpeed
        obstacles[i].style.left = obstacles[i].position + 'px'
    } else {
        clearTimeout(timeout)
        clearInterval(timerId)
        return
    }
}
```

### Valitaan joku satunnainen hyppyääni viidestä eri vaihtoehdosta: 
```js
/* Choose randomly one of the jump audio clips to play.
Play the chosen sound if the game over sound isn't playing 
or has played long enough so that it can be interrupted. */
let randomJumpSound = randomIntFromInterval(0, 4)
if ((audioClips[5].currentTime === 0 || audioClips[5].currentTime > 0.3)){
    stopAudioClips()
    audioClips[randomJumpSound].play().catch(() => {
        // The audio clip doesn't play if the user hasn't interacted with the document yet.
    });
}
```
### Siirretään ylöspäin hypännyttä pelaajan hahmoa alaspäin joka 20 millisekunnin välein niin kauan, kunnes "clearInterval()"-metodi kutsutaan: 
```js
let downTimerId = setInterval(function () {
    gravity = gravity * 1.02
    speed = speed * gravity
    playerPosition = playerPosition - speed
    if (playerPosition > 1)
        hedgehog.style.bottom = playerPosition + 'px'
    else {
        hedgehog.style.bottom = 1 + 'px'
        clearInterval(downTimerId)
        isJumping = false
        hedgehog.style.backgroundImage = "url('images/Hedgehog_run.gif')"
    }
}, 20)
```

### Lopetetaan peli, kun pelaajan hahmo ja este päätyvät liian lähelle toisiaan: 
```js
if (obstacles[i].position > 20 && obstacles[i].position < 80 && playerPosition < 44) {
    clearInterval(timerId)
    // Show game over message based on if the user is using a touchscreen device or not
    if (isTouchDevice) {
        guideText.innerHTML = "Game Over. Tap the screen to try again!"
    } else {
        guideText.innerHTML = "Game Over. Press the spacebar to try again!"
    }
    hedgehog.style.backgroundImage = "url('images/Hedgehog.png')"
    isGameOver = true
    stopAudioClips()
    audioClips[5].play()
    clearTimeout(timeout)
    return
}
```

### Lisätään EventListener-metodit pelin näppäimistö- ja kosketusnäyttöohjaukselle:
```js
// Listeners for keyboard control
document.addEventListener('keydown', keyboardControl)
document.addEventListener('keyup', keyboardControlRelease)

// Passive listeners for touch controls.
canvas.addEventListener("touchstart", function (evt) {
    isTouchDevice = true
    /* Only try jumping if the screen is touched with one finger.
    Otherwise stop trying to jump. */
    if (evt.touches.length === 1 && isElementInViewport(hedgehog)) {
        initiateJump()
    } else {
        releaseJump()
    }
}, { passive: true })

canvas.addEventListener("touchend", function () {
    isTouchDevice = true
    releaseJump()
}, { passive: true })

canvas.addEventListener("touchcancel", function () {
    isTouchDevice = true
    releaseJump()
}, { passive: true })
```

### Peliä voi pelata, vain jos se on näkyvillä selainikkunassa: 
```js
// Check if an element is in the viewport.
function isElementInViewport(el) {
    let rect = el.getBoundingClientRect()
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
}
```

## Kuvien muuttaminen klikkaamalla
Kuvissa on käytetty robohash.org sivustoa, josta voi generoida kuvia kirjoittamalla tekstiä. Tämäkin sivusto on eräänlainen simppeli API.  
Tämän jälkeen Javascriptin funktiolla on tehty toiminnallisuus kuvien vaihtumisesta klikkauksella.  
### Javascript 
```js
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
```
## Sarjojen/leffojen haku TVMaze API:sta  
Teemaan sopivat sarjat ja leffat on haettu TVMaze API:sta hakusanalla Horror.  
Sivulle haetaan nimi, kuva, kieli sekä linkki sivustolle ja osiot on aseteltu flexboxilla.
Tässä on API:n osoite, jolla tiedot on haettu:
```js   
const apiurl = "https://api.tvmaze.com/search/shows?q=horror";
```
Haun käynnistää "Search"-napin painallus ja tuleva data käsitellään for-loopin avulla.
```js  
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
```
   
Koko edeltävä koodi löytyy gitistä: https://github.com/KatjaDa/VisitEspoo/blob/main/js/script_k.js      

## Kartta
Kartta on tehty JS Leaflet kirjaston avulla: https://leafletjs.com/   
Kartan peruskoordinaatit:    
```js
const mymap = L.map('map').setView([60.21397, 24.64900], 12);
```
Kartalle on asetettu "laatta" kerros:   
```js
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: apiKey
}).addTo(mymap);
```
Laattakerros näyttää kartan "laattakerroksina", eli se näyttää kartan verkkoselaimessa yhdistämällä saumattomasti kymmeniä yksilöllisesti pyydettyjä kuva- tai vektoritietotiedostoja. Se on suosituin tapa näyttää ja navigoida karttoja.   

Lisäksi karttaan on lisätty kuvat ja markkerit muutamalle kohdalle.    
