## Ryhmän tiedot
Ryhmän jäsenet: Katja, Lea, Jonathan.    

## Sovelluksen yleiskuvaus
Visit Espoo - sovellus josta näkee Espoon nähtävyydet ja mitä voisi tehdä. Tehty huumorilla, sarkastiseen kauhutyyliin.   
Paikat eivät välttämättä ole edes Espoosta, ja ehkä käyttäjän ei enää tee mieli matkustaa Espooseen nähtyään sivuston... :D   
Sisältönä nähtävyyksien esittely ja kuvia, video, peli ja kartta Espoosta.  
TÄHÄN VOISI LAITTAA LINKIN SOVELLUKSEEN    

### Käyttötarkoitus ja käyttäjät
Käyttötarkoitus: viihdesivusto (humoristinen matkailusivusto), käyttäjäryhmä: nuoret aikuiset. 

### Video
Tavoite: tavoitteena on esitellä katsojalle Espoon karmaisevaa puolta.   
Kohderyhmä: nuoret aikuiset, jotka etsivät hauskaa sisältöä.   
Tarve: Nähdä Espoo ennen sinne matkustamista. Videon jälkeen katsoja ei ehkä enää haluakaan matkustaa Espooseen...    
*Disclaimer - Videon ja sivuston osa paikoista eivät ole todellisuudessa edes Espoosta, eikä tavoitteen ole kuvata Espoota realistisesti.*   


## Tyylit
Käytimme sivustolla väripalettia: https://coolors.co/363537-fafaff-ba3f1d   
Fonttipari: https://www.fontpair.co/pairing/raleway-nunito-sans   

Videon CSS koodi jolla saatu video koko ruudun kokoiseksi ja reponsiiviseksi.   
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
Tähän voisi kirjoittaa jotain pelistä ja laittaa koodisnipettejä?   

## Kuvien muuttaminen klikkaamalla
Kuvissa on käytetty robohash.org sivustoa, josta voi generoida kuvia kirjoittamalla tekstiä. Tämäkin sivusto on eräänlainen simppeli api.  
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
## Sarjojen/leffojen haku TVMaze apista  
Teemaan sopivat sarjat ja leffat on haettu TVMaze apista hakusanalla Horror.  
Sivulle haetaan nimi, kuva, kieli sekä linkki sivustolle ja osiot on aseteltu flexboxilla.
Apin osoite jolla tiedot on haettu:
```js   
const apiurl = "https://api.tvmaze.com/search/shows?q=horror";
```
Haun käynnistää etsi napin painallus ja tuleva data käsitellään for loopin avulla.
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
   
Koko koodi löytyy gitistä: https://github.com/KatjaDa/VisitEspoo   
kansiosta js ja tiedostosta script_k.js    

## Kartta
Tähän voisi kirjoittaa jotain kartasta ja laittaa koodisnipettejä?  