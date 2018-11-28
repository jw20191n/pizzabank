var markers = [];
var results = [];

function processResult(JsonResult){
  var items = JsonResult.query.results.Result;
  console.log(items);

  for (var i=0; i<items.length; i++) {

    var lati = items[i].Latitude;
    var long = items[i].Longitude;
    var locations = new google.maps.LatLng(lati,long);
    var title = items[i].Title;
    var info = items[i].Title + "<br>" + items[i].Address + ", " + items[i].City;

    markers[i] = new google.maps.Marker({
      position: locations,
      map: displayMap,
      title: title,
      animation: google.maps.Animation.DROP
    });

    results[i] = new google.maps.InfoWindow({
      content: info
    });


    google.maps.event.addListener(markers[i], 'mouseover', (function(marker,i) {
      return function() {
        results[i].open(displayMap,markers[i]);
      }
    })(markers[i],i));

    google.maps.event.addListener(markers[i], 'mouseout', (function(marker,i) {
      return function(){
        results[i].close();
      }

    })(markers[i],i));

  }
}



var userLati, userLong;

function searchNow(){
  var searchTypeInput = document.getElementById("searchType").value;
  var URL1 = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20local.search(0%2C20)%20where%20query%3D%22";
  var URL2=searchTypeInput;
  var URL3="%22%20and%20longitude%3D%22";
  var URL4 = userLong;
  var URL5="%22%20and%20latitude%3D%22";
  var URL6 = userLati;
  var URL7="%22&format=json&diagnostics=true&callback=processResult";
  var searchURL=URL1+URL2+URL3+URL4+URL5+URL6+URL7;
  var newOutput = document.createElement('script');
  newOutput.src=searchURL;
  document.getElementById('outputDiv').appendChild(newOutput);
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(savePosition, displayError);
}

function savePosition(position){
  userLati = position.coords.latitude;
  userLong = position.coords.longitude;

  var mapOptions = {
    zoom: 13,
    center: new google.maps.LatLng(userLati, userLong),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  displayMap = new google.maps.Map(document.getElementById("outputDiv"),mapOptions);
}

function displayError(error){
  alert('ERROR(' + error.code + '): ' + error.message);
}
