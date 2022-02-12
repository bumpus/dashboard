function loadCovid(){
  $.getJSON("covid.php", displayCovid);
}

function displayCovid(data){
  $("#covid").empty();
  $("#covid").append(`<div id ='level'>Transmission Level: ${data.level[0].toUpperCase() + data.level.substring(1)}</div>`)
  $("#covid").append(`<div id='positivity'>Positivity: ${data.positivity}%</div>`);
  $("#covid").append(`<div id='cases'>Cases/100k: ${data.cases}</div>`);
  $("#covid").removeClass();
  $("#covid").addClass(data.level);
}
