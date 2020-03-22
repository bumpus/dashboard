function getOrdinal(number){
    if (((number % 10) == 1) && (number != 11))
      return number + "st";
    else if (((number % 10) == 2) && (number != 12))
      return number + "nd";
    else if (((number % 10) == 3) && (number != 13))
      return number + "rd";
    else
      return number + "th";
}

function updateClock(){
  var d = new Date();
  var h = d.getHours();
  var ampm = "";
  var month = months[d.getMonth()];
  var dateString = getOrdinal(d.getDate());

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
    "<div id='clocktime'>"+h+":"+d.getMinutes().toString().padStart(2, '0')+"<span class='seconds'>:"+d.getSeconds().toString().padStart(2, '0')+"</span> "+ampm+"</div>"+
    "<div id='clockdate'>"+month+" "+dateString+", "+d.getFullYear()+"</div>");
}

