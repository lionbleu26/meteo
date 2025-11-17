//afficher la date et le mois en cours
afficherDateEtHeure();
let btn = document.querySelector("button");
btn.addEventListener("click", () => {
  recupMeteo();
});

async function recupMeteo(nomDeVille) {
  let latitude;
  let longitude;

   // ✅ CORRECTION : Gestion d'erreur pour l'API key
  let cleAPI = "2a9dd7b2922af41a39f1637eb94fe9d5";
  // try {
  //   const responseKey = await fetch("/api/key");

  //   // Vérifier si la requête a réussi
  //   if (!responseKey.ok) {
  //     throw new Error(`Erreur API key: ${responseKey.status}`);
  //   }

  //   const dataKey = await responseKey.json();
  //   cleAPI = dataKey.key;

  //   console.log("✅ Clé API récupérée");
  // } catch (error) {
  //   console.error("❌ Impossible de récupérer la clé API:", error);
  //   alert("Erreur de configuration. Veuillez réessayer plus tard.");
  //   return;
  // }

  try {
    let input = document.querySelector("input");
    let valeurInput = input.value;

    if (!valeurInput) {
      alert("Veuillez entrer un nom de ville.");
      console.error("Veuillez entrer un nom de ville.");
      return;
    }

    // ⚠️ ATTENTION : Change http en https !
    const responseCoordonnerGps = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${valeurInput}&appid=${cleAPI}`
    );

    if (!responseCoordonnerGps.ok) {
      throw new Error("Erreur lors de l'appel à l'API");
    }

    const dataGPS = await responseCoordonnerGps.json();
    console.log(dataGPS);

    if (dataGPS.length === 0) {
      alert("Oups la ville n'existe pas :(");
      console.error("Oups la ville n'existe pas :(");
      return;
    }

    latitude = dataGPS[0].lat;
    longitude = dataGPS[0].lon;

    reponseMeteo(latitude, longitude, cleAPI);
  } catch (error) {
    console.error("Une erreur s'est produite :", error.message);
  }
}

// fonction async pour afficher la meteo avec en recuperant la longitude et la la latitude
async function reponseMeteo(latitude, longitude, cleAPI) {
  // fetch pour avoir une promesse de reponse pour avoir la méteo
  const responseMeteo = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${cleAPI}&units=metric&lang=fr`
  );

  // afficher cet promesse en format json
  const dataMeteo = await responseMeteo.json();
  console.log(dataMeteo);
  //fonction qui va afficher les information meteo
  afficherMeteo(dataMeteo);

  // fonction qui va afficher
  ProchainJours(latitude, longitude, cleAPI);
}

function afficherDateEtHeure() {
  let newDate = new Date();
  let parentDay = document.querySelector("#jourAujourdhui");
  let parentDateAjd = document.querySelector("#dateAjd");
  let parentMoisEnCours = document.querySelector("#moisEnCours");
  // tableau avec les jours
  const tableJour = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  //tableau qui stock les mois de l'annees
  const tableMois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  // afficher le jour d'aujourd'hui
  let newDay = tableJour[newDate.getDay()];
  let day = `${newDay}`;
  parentDay.innerHTML = day;

  // afficher la date d'aujourd'hui

  let date = newDate.getDate();
  let dateAjd = `${date}`;
  parentDateAjd.innerHTML = dateAjd;

  //afficher le mois
  let mois = tableMois[newDate.getMonth()];
  moisEnCours = `${mois}`;
  parentMoisEnCours.innerHTML = moisEnCours;
}

function conditionMeteo(dataMeteo) {
  let body = document.querySelector("body");
  let divCouleur = document.querySelector(".titre");

  // lance le fondu / zoom
  body.classList.add("bg-transition");

  // délai pour laisser le temps de commencer le fondu avant de changer l'image
  setTimeout(() => {
    switch (dataMeteo.weather[0].main) {
      case "Mist":
        body.style.backgroundImage = "url('fond_ecran/brume.jpg')";
        divCouleur.style.backgroundColor = "rgb(79, 108, 148)";
        break;
      case "Rain":
        body.style.backgroundImage = "url('fond_ecran/pluie.jpg')";
        divCouleur.style.backgroundColor = "rgb(29, 37, 37)";
        break;
      case "Clouds":
        body.style.backgroundImage = "url('fond_ecran/nuageux.jpg')";
        divCouleur.style.backgroundColor = "rgb(0, 63, 93)";
        break;
      case "Snow":
        body.style.backgroundImage = "url('fond_ecran/neige.jpg')";
        divCouleur.style.backgroundColor = "rgb(82, 112, 140)";
        break;
      case "Clear":
        body.style.backgroundImage = "url('fond_ecran/soleil.jpg')";
        divCouleur.style.backgroundColor = "rgb(131, 179, 202)";
        break;
      case "Thunderstorm":
        body.style.backgroundImage = "url('fond_ecran/orage.jpg')";
        divCouleur.style.backgroundColor = "rgb(140, 85, 139)";
        break;
    }

    // retire la classe pour faire réapparaître en fondu
    body.classList.remove("bg-transition");
  }, 300); // tu peux ajuster ce délai (ms) si tu veux
}

function afficherMeteo(dataMeteo) {
  // Temperature //
  let parentTemperature = document.querySelector("#temperature");
  let temperature = `${Math.trunc(dataMeteo.main.temp)}° `;
  parentTemperature.innerHTML = temperature;

  // Nom de la ville//
  let parentnomDeVille = document.querySelector("#nomDeVille");
  let nomDeVille = `${dataMeteo.name} <br>  ${dataMeteo.sys.country} `;
  parentnomDeVille.innerHTML = nomDeVille;

  // température min//
  let resulTemperatureMin = document.querySelector("#resulTemperatureMin");
  let temperatureMin = `${Math.trunc(dataMeteo.main.temp_min)}°`;

  resulTemperatureMin.innerHTML = temperatureMin;
  // température max//
  let resulTemperatureMax = document.querySelector("#resulTemperatureMax");
  let temperatureMax = `${Math.trunc(dataMeteo.main.temp_max)}°`;
  resulTemperatureMax.innerHTML = temperatureMax;

  // température ressentie//
  let Parentressentie = document.querySelector("#ressentie");
  let ressentie = `${Math.trunc(dataMeteo.main.feels_like)}°`;
  Parentressentie.innerHTML = ressentie;

  // Humiditer//
  let ParentHumidite = document.querySelector("#humidite");
  let humidite = `${dataMeteo.main.humidity}%`;
  ParentHumidite.innerHTML = humidite;

  // visibilité//
  let Parentvisibilite = document.querySelector("#visibilite");
  let visibilite = `${dataMeteo.visibility / 1000}km`;
  Parentvisibilite.innerHTML = visibilite;

  // vent//
  let Parentvent = document.querySelector("#vent");
  let vent = `${Math.trunc(dataMeteo.wind.speed)}km/h`;
  Parentvent.innerHTML = vent;

  // variable qui stocke l'image de la météo pour l'afficher à l'ércan
  let icon =
    "https://openweathermap.org/img/wn/" +
    dataMeteo.weather[0].icon +
    "@2x.png";

  // icone meteo acceuil//
  let ParentimgCiel = document.querySelector("#imgCiel");
  let imgCiel = ` <img id="imgMeteo" src="${icon}"   />`;
  ParentimgCiel.innerHTML = imgCiel;

  // afficher si nuageux, soleil...etc //
  let ParenttempsDuCiel = document.querySelector("#tempsDuCiel");
  let tempsDuCiel = ` ${dataMeteo.weather[0].description} `;
  ParenttempsDuCiel.innerHTML = tempsDuCiel;
  conditionMeteo(dataMeteo);
}

async function ProchainJours(latitude, longitude, cleAPI) {
  const responseProchainJours = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${cleAPI}&units=metric&lang=fr`
  );
  const dataProchainJour = await responseProchainJours.json();
  console.log(dataProchainJour);

  // tableau avec les jours
  const tableJour = [
    "Samedi",
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
  ];
  meteoJourSuivant1(tableJour, dataProchainJour);
  meteoJourSuivant2(tableJour, dataProchainJour);
  meteoJourSuivant3(tableJour, dataProchainJour);
}

function meteoJourSuivant1(tableJour, dataProchainJour) {
  // jour suivant 1 avec . dt pour recuperer lheure et la date
  const Recupjour1Suivant1 = dataProchainJour.list[7].dt;
  // on multiplie par 1000 pour avoir une date lisible
  const myDate = new Date(Recupjour1Suivant1 * 1000);
  afficherJourSuivant = tableJour[myDate.getDay()];

  //afficher le jour suivant
  let jour1 = document.querySelector("#jour1");
  let pJour1 = `${afficherJourSuivant}`;
  jour1.innerHTML = pJour1;

  // afficher l'icon en fonction de la météo a 12h
  let icon1 =
    "https://openweathermap.org/img/wn/" +
    dataProchainJour.list[7].weather[0].icon +
    "@2x.png";

  let iconJour1 = document.querySelector("#iconJour1");
  let PIconJour1 = `<img src="${icon1}">`;
  iconJour1.innerHTML = PIconJour1;
  console.log(PIconJour1);
  //Afficher temperature jour d'apres 1 à 12h
  let temperatureMinJour1 = document.querySelector("#temperatureMinJour1");
  let PtemperatureMinJour1 = `${Math.trunc(
    dataProchainJour.list[7].main.temp
  )}°`;
  temperatureMinJour1.innerHTML = PtemperatureMinJour1;
}

function meteoJourSuivant2(tableJour, dataProchainJour) {
  // jour suivant 1 avec . dt pour recuperer lheure et la date
  const Recupjour1Suivant2 = dataProchainJour.list[15].dt;
  // on multiplie par 1000 pour avoir une date lisible
  const myDate = new Date(Recupjour1Suivant2 * 1000);
  afficherJourSuivant = tableJour[myDate.getDay()];

  //afficher le jour suivant
  let jour2 = document.querySelector("#jour2");
  let pJour2 = `${afficherJourSuivant}`;
  jour2.innerHTML = pJour2;

  // afficher l'icon en fonction de la météo a 12h
  let icon2 =
    "https://openweathermap.org/img/wn/" +
    dataProchainJour.list[15].weather[0].icon +
    "@2x.png";

  let iconJour2 = document.querySelector("#iconJour2");
  let PIconJour2 = `<img src="${icon2}">`;
  iconJour2.innerHTML = PIconJour2;

  //Afficher temperature jour d'apres 1 à 12h
  let temperatureMinJour2 = document.querySelector("#temperatureMinJour2");
  let PtemperatureMinJour2 = `${Math.trunc(
    dataProchainJour.list[15].main.temp
  )}°`;
  temperatureMinJour2.innerHTML = PtemperatureMinJour2;
}

function meteoJourSuivant3(tableJour, dataProchainJour) {
  // jour suivant 1 avec . dt pour recuperer lheure et la date
  const Recupjour1Suivant3 = dataProchainJour.list[23].dt;
  // on multiplie par 1000 pour avoir une date lisible
  const myDate = new Date(Recupjour1Suivant3 * 1000);
  afficherJourSuivant = tableJour[myDate.getDay()];

  //afficher le jour suivant
  let jour3 = document.querySelector("#jour3");
  let pJour3 = `${afficherJourSuivant}`;
  jour3.innerHTML = pJour3;

  // afficher l'icon en fonction de la météo a 12h
  let icon3 =
    "https://openweathermap.org/img/wn/" +
    dataProchainJour.list[23].weather[0].icon +
    "@2x.png";

  let iconJour3 = document.querySelector("#iconJour3");
  let PIconJour3 = `<img src="${icon3}">`;
  iconJour3.innerHTML = PIconJour3;

  //Afficher temperature jour d'apres 1 à 12h
  let temperatureMinJour3 = document.querySelector("#temperatureMinJour3");
  let PtemperatureMinJour3 = `${Math.trunc(
    dataProchainJour.list[7].main.temp
  )}°`;
  temperatureMinJour3.innerHTML = PtemperatureMinJour3;
}
