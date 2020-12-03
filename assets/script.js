// Global Variables
const hikeSelected = JSON.parse(localStorage.getItem('hikeSelected'))
const date = moment()
const $infoEl = $('#info-section')
const $weatherEl = $('#weather-section')
const $mapEl = $('#map-section')
const $directionsEl = $('#directions-section')

// Upon document being READY launches these functions.
$(document).ready(handleWeatherInfo)
$(document).ready(handleNameAndDescription)
$('#myModal').modal('show')
// This button events apply to the modal and what happens when each of the buttons are clicked.
$('#closeBtn').on('click', handleGeoLocation)
$('nav').on('click', '.custom-btn', handleSections)
$('#map-btns').on('click', initMap)

// Initialize and add the map
function initMap() {

  // The location of hikeLocation
  const hikeLocation = { lat: hikeSelected.latitude, lng: hikeSelected.longitude };
  // The map, centered at hikeLocation
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: hikeLocation,
  });

  // The marker, positioned at hikeLocation
  const marker = new google.maps.Marker({
    position: hikeLocation,
    map: map,
  });

}

function handleGeoLocation() {
  // On btn click the modal closes.
  $('.modal').removeClass('is-active')
  // THEN we pull the geo location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleUserAddress)
  }
  else {
    return;
  }
}

function handleUserAddress(position) {
  const googleAPI = 'AIzaSyBhOGyxS_RiEneLIpqf6mUUIL2HI2sEms4'

  // LET these variables be equal to the user's latitude and longitude
  let userLatitude = position.coords.latitude
  let userLongitude = position.coords.longitude

  // First we need to turn the geolocation of the user into a valid address for Google to use.
  const reverseGeoURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLatitude},${userLongitude}&key=${googleAPI}`

  $.ajax({
    url: reverseGeoURL,
    method: 'GET'
  }).then(function (response) {
    let userAddress = response.results[0].formatted_address
    calcRoute(userAddress)
  })
}

function calcRoute(userAddress) {

  // LET the destination be EQUAL to this new Latitude and Longitude.
  let destination = new google.maps.LatLng(hikeSelected.latitude, hikeSelected.longitude);
  // Variables that will create new directions and renderer them to the map for us.
  let directionsService = new google.maps.DirectionsService();
  let directionsRenderer = new google.maps.DirectionsRenderer();

  // THEN we are going to create a new map so that we can get our route displayed out of the scope of the initMap function.
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: destination,
  });

  let request = {
    origin: userAddress,
    destination: destination,
    travelMode: "DRIVING"
  }

  directionsService.route(request, function (result, status) {

    if (status == 'OK') {
      directionsRenderer.setMap(map)
      directionsRenderer.setDirections(result);
      directionsRenderer.setPanel(document.getElementById("bottom-panel"));
    }
  });
}

function handleWeatherInfo() {

  var APIKey = "52aa85fe9180c06fe869a1a3e7d7de19"
  var lat = hikeSelected.latitude
  var long = hikeSelected.longitude

  var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&appid=" + APIKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    appendWeatherInfo(response)
  })
}

function appendWeatherInfo(response) {

  for (let i = 0; i <= 7; i++) {

    var weatherAppend = $(`#weatherinfo${i}`);
    var tempF = (response.daily[i].temp.day - 273.15) * 1.80 + 32

    $(`#weatherday${i}`).text(moment().add(i, "d").format("l"));

    $(`#weathericon${i}`).attr('src', `https://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}@2x.png`);

    $("<p>").text('Temp: ' + tempF.toFixed(2) + "°F").appendTo(weatherAppend).addClass('is-size-5');

  }
}

function handleNameAndDescription() {

  // For the title on the tab of the browser
  $('title').text('Trail Chasers: ' + hikeSelected.name)

  // For the modal.
  $("#hike-modal").text(hikeSelected.name)

  // For the Hike Info Tab
  $('#hikeImage').attr('src', hikeSelected.imgMedium)
  $("#hikeName").text(hikeSelected.name)
  $("#difficulty").text('Difficulty: ' + hikeSelected.difficulty).css('textTransform', 'capitalize')
  $("#description").text(hikeSelected.summary)

}

function handleSections(event) {
  event.preventDefault();

  if ($(this).data('section') == 'info') {
    // $aboutMeEl.addClass('trans')
    // $projectsEl.addClass('trans')
    // setTimeout(() => {
    $weatherEl.addClass('hide')
    $mapEl.addClass('hide')
    $directionsEl.addClass('hide')
    $infoEl.removeClass('hide')
    // }, 1000)
    // setTimeout(() => $homeEl.removeClass('trans'), 1050)
  }

  if ($(this).data('section') == 'weather') {
    // $aboutMeEl.addClass('trans')
    // $projectsEl.addClass('trans')
    // setTimeout(() => {
    $infoEl.addClass('hide')
    $mapEl.addClass('hide')
    $directionsEl.addClass('hide')
    $weatherEl.removeClass('hide')
    // }, 1000)
    // setTimeout(() => $homeEl.removeClass('trans'), 1050)
  }

  if ($(this).data('section') == 'map') {
    // $aboutMeEl.addClass('trans')
    // $projectsEl.addClass('trans')
    // setTimeout(() => {
    $infoEl.addClass('hide')
    $weatherEl.addClass('hide')
    $directionsEl.addClass('hide')
    $mapEl.removeClass('hide')
    // }, 1000)
    // setTimeout(() => $homeEl.removeClass('trans'), 1050)
  }

  if ($(this).data('section') == 'directions') {
    // $aboutMeEl.addClass('trans')
    // $projectsEl.addClass('trans')
    // setTimeout(() => {
    $infoEl.addClass('hide')
    $weatherEl.addClass('hide')
    $mapEl.addClass('hide')
    $directionsEl.removeClass('hide')
    // }, 1000)
    // setTimeout(() => $homeEl.removeClass('trans'), 1050)
  }

};
