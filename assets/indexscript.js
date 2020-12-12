// trail chaser app - javascript for index.html
// VARIABLES
var apiID = "200970639-981a2550ac3c48f2579397ecf3a9b65e";
var queryURL;
var resultsEl = $("#results");
var formEl = $("#form-group");
var hikesReturned;
var userHikeSelected;
var locationInput;
var radiusInput;
var lengthInput;
var starInput;
var lat;
var lon;

var savedCriteria = JSON.parse(localStorage.getItem("savedCriteria")) || [];

function init() {
  // show saved criteria if stored
  if (savedCriteria != []) {
    $("#location").val(savedCriteria.location);
    $("#length").val(savedCriteria.length);
    $("#radius").val(savedCriteria.radius);
    $("#ratingInput").val(savedCriteria.ratingInput);
  };
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
  // handleSearch();

  // IF the user doesnt input a city/location name
  if (locationInput === "") {
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

    //savedCriteria.push(userData)

    localStorage.setItem("savedCriteria", JSON.stringify(userData));
    //function that appends info into form

  }
  else {
    localStorage.clear("savedCriteria");
  };

}

// handleSearch - make ajax call and get response info for hikes to appear
function handleSearch() {
  queryURL = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=${radiusInput}&minLength=${lengthInput}&minStars=${starInput}&key=${apiID}`;
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

  hikesReturned = response.trails; // store for use when user clicks selection
  console.log(response.trails); // returns 10 trails max with current query
  // resultsEl.empty(); // clear results section
  

  let numResults = response.trails.length; // if there are results, there will always be at least one
  let numPages = Math.ceil(numResults / 5); // 5 results per page
  console.log(numPages);

  let startIndex = 0;
  let loopIndexMax;
  // to do - figure out how to treat less than 5 results
  // to do - loop through up to 20 results

  if (numResults === 0) {
    $('#inputModal').modal('show');
    loopIndexMax = 0; // prevent loop from starting
  } else if (numResults > 0 && numResults < 6) {
    loopIndexMax = numResults;
  } else { // more than 5 results so more than 1 page of results
    // formEl.empty();
    resultsEl.empty(); // clear results section
    // let searchAgainBtn = `<button type="button" class="btn btn-primary" id="again">New Search</button>`;  
    // resultsEl.append(searchAgainBtn);
    // const nextBtn = `<button type="button" class="btn btn-primary" id="next">Next Results &raquo;</button>`;
    // resultsEl.append(nextBtn);
    loopIndexMax = 5;
  }

  displayResults(startIndex, loopIndexMax);

}

// create a page that on button clicks would change which part of the array is shown, If array length is shorter than page showings append prv button and if the array length is longer than append a next button.
const handlePageNumbers = (start, end) => {
  const nextBtn = `<button type="button" class="btn btn-primary" id="next">More &raquo;</button>`;
  const prevBtn = `<button type="button" class="btn btn-primary" id="prev-btn">Previous &raquo;</button>`;

  if (hikesReturned.length > 5) {
    resultsEl.append(nextBtn)
  }
  if (start >= 5) {
    resultsEl.empty()
    resultsEl.append(prevBtn)
    resultsEl.append(nextBtn)
  }
  if (hikesReturned.length === end) {
    resultsEl.empty()
    resultsEl.append(prevBtn)
  }
}

// display 5 result hikes per page
function displayResults(startIndex, loopIndexMax) {

  handlePageNumbers(startIndex ,loopIndexMax)

  for (let i = startIndex; i < loopIndexMax; i++) {
    console.log(i)
    // get difficulty and assign color class
    var difficultyText;
    var difficultyClass;
    switch (hikesReturned[i].difficulty.trim()) {
      case ("blackBlack"):
        difficultyText = "Very Difficult";
        difficultyClass = "dBlack";
        break;
      case ("black"):
        difficultyText = "Difficult";
        difficultyClass = "dBlack";
        break;
      case ("blueBlack"):
        difficultyText = "Intermediate/Difficult";
        difficultyClass = "dBlueBlack";
        break;
      case ("blue"):
        difficultyText = "Intermediate";
        difficultyClass = "dBlue";
        break;
      case ("greenBlue"):
        difficultyText = "Easy/Intermediate";
        difficultyClass = "dGreen";
        break;
      case ("green"):
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

// listen for next button to show next page of results
$('#results').on("click", "#next", () => {
  // console.log("next results please");
  // TO DO - how to get dynamic indexes?
  resultsEl.empty(); // clear results section
  displayResults(5, 10);
})

// TO DO  - Listen for previous button
// $('#results').on("click", "#next", function () {
  // console.log("prior results please");
  // displayResults(1,5);
// })

// listen for search again to be clicked
// $('#results').on("click", "#searchAgain", function() {
//   resultsEl.empty();
//   init();
// })