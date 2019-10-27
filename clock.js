function updateClock(){
  var d = new Date();
  var h = d.getHours();
  var ampm = "";
  var month = months[d.getMonth()];
  var dateString;
  if (d.getDate() == 1)
    dateString = "1st";
  else if (d.getDate() == 2)
    dateString = "2nd";
  else if (d.getDate() == 3)
    dateString = "3rd";
  else
    dateString = d.getDate() + "th";

  // Sort out the AM/PM/noon/midnight thing
  if(h >= 12){
    ampm = "PM";
    if (h > 12){
      h = h-12;
    }
  }else{
    ampm = "AM";
    if (h == 0){
      h = 12;
    }
  }

  $("#clock").html("<div id='clockweekday'>"+days[d.getDay()]+"</div>"+
    "<div id='clocktime'>"+h+":"+d.getMinutes().toString().padStart(2, '0')+":"+d.getSeconds().toString().padStart(2, '0')+" "+ampm+"</div>"+
    "<div id='clockdate'>"+month+" "+dateString+", "+d.getFullYear()+"</div>");
}

