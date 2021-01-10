// trail chaser app - javascript for index.html
// VARIABLES
var apiID = "200970639-981a2550ac3c48f2579397ecf3a9b65e";
var queryURL;
var formEl = $(".section");
var resultsEl = $("#results");
var buttonsEl = $("#buttons");
var hikesReturned;
var userHikeSelected;
var locationInput;
var radiusInput;
var lengthInput;
var starInput;
var lat;
var lon;
let startIndex;
let loopIndexMax;

var savedCriteria = JSON.parse(localStorage.getItem("savedCriteria")) || [];

function init() {
  startIndex = 0;
  loopIndexMax = 0;

  // show saved criteria if stored
  if (formEl.css("display") === "none"){
    formEl.css("display", "block");
  }

  if (savedCriteria != []) {
    $("#location").val(savedCriteria.location);
    $("#length").val(savedCriteria.length);
    $("#radius").val(savedCriteria.radius);
    $("#ratingInput").val(savedCriteria.ratingInput);
  }
}

// handleUserInfo - get user inputs after user clicks Find Your Search
function handleUserInfo() {
    // clear results section for each new search
    resultsEl.empty(); // clear results section

    // get inputs
    locationInput = $("#location").val();
    radiusInput = $("#radius").val();
    lengthInput = $("#length").val();
    starInput = $("#ratingInput").val();
    let checkSaveCriteria = document.getElementById('checkboxChecker').checked;

    // make ajax call
    handleCity();

    // IF the user doesnt input a city/location name
    if (locationInput === ""){
        $("#results").empty();
        // modal for input error messages
        $('#inputModal').modal('show')
        //return; 
    }
    
    else if (checkSaveCriteria === true) {
        
        var userData = {
            location: locationInput, 
            radius: radiusInput, 
            length: lengthInput, 
            ratingInput: starInput
        };

        localStorage.setItem("savedCriteria", JSON.stringify(userData));
        //function that appends info into form
        
    }
    else {
        localStorage.clear("savedCriteria");
    };

}

// handleSearch - make ajax call and get response info for hikes to appear
function handleSearch() {
  queryURL = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=${radiusInput}&minLength=${lengthInput}&minStars=${starInput}&maxResults=20&key=${apiID}`;
  // Perfoming an AJAX GET request to our queryURL
  $.ajax({
    url: queryURL,
    method: "GET",
  })
    // After the data from the AJAX request comes back
    .then(function (response) {
      handleResults(response);
    });
}

// handleResults - display results of first 5 results in card form
function handleResults(response) {
  // create a page that on buttons clicks would change which part of the array is shown. If array length is shorter than page showings append prev button and if the array length is longer than append a next button.
  hikesReturned = response.trails; // store for use when user clicks selection
  resultsEl.empty(); // clear results section

  let numResults = response.trails.length; // if there are results, there will always be at least one
  let numPages = Math.ceil(numResults/5); // 5 results per page
  
  if (numResults === 0){
    $('#inputModal').modal('show');
    loopIndexMax = 0; // prevent loop from starting
  } else if(numResults > 0 && numResults <6) {
    formEl.css("display", "none");
    loopIndexMax = numResults;
  } else { // more than 5 results so more than 1 page of results
    formEl.css("display", "none");
    // resultsEl.empty(); // clear results section
    loopIndexMax = 5;
  }

  displayResults(startIndex, loopIndexMax);

}

// create a page that on button clicks would change which part of the array is shown, If array length is shorter than page showings append prv button and if the array length is longer than append a next button.
// (from TM)
const handlePageNumbers = (start, end) => {
  const searchAgainBtn = `<button type="button" class="btn btn-primary" id="again">New Search</button>`;  
  const nextBtn = `<button type="button" class="btn btn-primary" id="next">More <i class="fas fa-angle-double-right"></i></button>`;
  const prevBtn = `<button type="button" class="btn btn-primary" id="prev-btn"><i class="fas fa-angle-double-left"></i> Previous</button>`;

  if (hikesReturned.length > 5) {
    buttonsEl.append(searchAgainBtn);
    buttonsEl.append(nextBtn)
  }
  if (start >= 5) {
    buttonsEl.empty()
    buttonsEl.append(prevBtn)
    buttonsEl.append(searchAgainBtn);
    buttonsEl.append(nextBtn)
  }
  if (hikesReturned.length === end) {
    buttonsEl.empty()
    buttonsEl.append(prevBtn)
    buttonsEl.append(searchAgainBtn);
  }
}

// display 5 result hikes per page
function displayResults(startIndex, loopIndexMax) {

  handlePageNumbers(startIndex, loopIndexMax);

  for (let i = startIndex; i < loopIndexMax; i++) {
    // get difficulty and assign color class
    var difficultyText;
    var difficultyClass;
    switch (hikesReturned[i].difficulty.trim()){
      case("blackBlack"):
      difficultyText = "Very Difficult";
      difficultyClass = "dBlack";
      break;
      case("black"):
      difficultyText = "Difficult";
      difficultyClass = "dBlack";
      break;
      case("blueBlack"):
      difficultyText = "Intermediate/Difficult";
      difficultyClass = "dBlueBlack";
      break;
      case("blue"):
      difficultyText = "Intermediate";
      difficultyClass = "dBlue";
      break;
      case("greenBlue"):
      difficultyText = "Easy/Intermediate";
      difficultyClass = "dGreen";
      break;
      case("green"):
      difficultyText = "Easy";
      difficultyClass = "dGreen";
      break;
    }
    // create a card with info
    var card = `    
    <div class="card" id="${i}">
      <div class="card-body">
          <div class="media">
                  <figure class="figure-img img-fluid is-48x48 mr-3">
                  <img src="${hikesReturned[i].imgSqSmall}" alt="Trail image">
                  </figure>
              <div class="media-body">
                  <h5 class="mt-0">${hikesReturned[i].name}</h5>
                  ${hikesReturned[i].stars}<i class="fas fa-star"></i><br>
                  Location: ${hikesReturned[i].location}<br>
                  <span class="index-difficulty">Difficulty: <span class="${difficultyClass}">${difficultyText}</span></span>
              </div> 
          </div> 
      </div> 
    </div>`;
    resultsEl.append(card);
    $(".index-difficulty").css("textTransform", "capitalize");
  }
}

function handleCity() {
  const googleAPI = "AIzaSyBhOGyxS_RiEneLIpqf6mUUIL2HI2sEms4";
  // First we need to turn the geolocation of the user into a valid address for Google to use.
  const geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationInput}&key=${googleAPI}`;

  $.ajax({
    url: geocodeURL,
    method: "GET",
  }).then(function (response) {
    if (response.status == "OK") {
      lat = response.results[0].geometry.location.lat;
      lon = response.results[0].geometry.location.lng;
      handleSearch();
    } else if (response.status == "ZERO_RESULTS") {
      $("#results").empty();
      $('#inputModal').modal('show')
    }
  });
}

init();

// user clicks "find your trails", search for hikes based on user inputs
$("#findBtn").on("click", handleUserInfo);

// listen for hike result to be clicked on
$("#results").on("click", ".card", function () {
  userHikeSelected = hikesReturned[$(this).attr("id")];
  localStorage.setItem("hikeSelected", JSON.stringify(userHikeSelected));
  window.location.href = "results.html";
});

// listen for next button to show next page of results (input from TM)
$('#buttons').on("click", "#next", function () {
  buttonsEl.empty();
  resultsEl.empty(); // clear results section
  displayResults(startIndex +=5, loopIndexMax += 5);
})

// Listen for previous button (input from TM)
$('#buttons').on("click", "#prev-btn", function () {
  buttonsEl.empty();
  resultsEl.empty(); // clear results section
  displayResults(startIndex -= 5, loopIndexMax -=5);
})

// listen for search again to be clicked
$('#buttons').on("click", "#again", function() {
  buttonsEl.empty();
  resultsEl.empty();
  init();
})