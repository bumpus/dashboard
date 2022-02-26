function loadCovid(){
  $.getJSON("covid.php", displayCovid);
}

function displayCovid(data){
  $("#covid").empty();
  $("#covid").append(`<div id ='level'>Community Level: ${data.community[0].toUpperCase() + data.community.substring(1)}</div>`)
  $("#covid").append(`<div id='cases'>Cases/100k: ${data.cases}</div>`);
  $("#covid").append(`<div id='admissions'>Adm./100k: ${data.admissions}</div>`);
  $("#covid").append(`<div id='beds'>Beds Used: ${data.beds}%</div>`);
  $("#covid").removeClass();
  $("#covid").addClass(data.community);
}
