//var calendarData = [{"summary":"chicken curry","start":{"date":"2019-11-11","dateTime":null,"timeZone":null},"end":{"date":"2019-11-12","dateTime":null,"timeZone":null},"backgroundColor":"#fad165","foregroundColor":"#000000"},{"summary":"Veterans Day","start":{"date":"2019-11-11","dateTime":null,"timeZone":null},"end":{"date":"2019-11-12","dateTime":null,"timeZone":null},"backgroundColor":"#16a765","foregroundColor":"#000000"},{"summary":"spice rubbed pork chops","start":{"date":"2019-11-12","dateTime":null,"timeZone":null},"end":{"date":"2019-11-13","dateTime":null,"timeZone":null},"backgroundColor":"#fad165","foregroundColor":"#000000"},{"summary":"Full moon 7:34am","start":{"date":"2019-11-12","dateTime":null,"timeZone":null},"end":{"date":"2019-11-13","dateTime":null,"timeZone":null},"backgroundColor":"#c2c2c2","foregroundColor":"#000000"},{"summary":"Troop 33 Meeting - Coolidge Elementary","start":{"date":null,"dateTime":"2019-11-11T19:00:00-06:00","timeZone":null},"end":{"date":null,"dateTime":"2019-11-11T20:30:00-06:00","timeZone":null},"backgroundColor":"#42d692","foregroundColor":"#000000"},{"summary":"Chamber orchestra","start":{"date":null,"dateTime":"2019-11-12T07:00:00-06:00","timeZone":"America\/Chicago"},"end":{"date":null,"dateTime":"2019-11-12T07:30:00-06:00","timeZone":"America\/Chicago"},"backgroundColor":"#42d692","foregroundColor":"#000000"},{"summary":"Hawaiian Pulled Pork","start":{"date":"2019-11-13","dateTime":null,"timeZone":null},"end":{"date":"2019-11-14","dateTime":null,"timeZone":null},"backgroundColor":"#fad165","foregroundColor":"#000000"},{"summary":"FSEA","start":{"date":null,"dateTime":"2019-11-13T15:00:00-06:00","timeZone":"America\/Chicago"},"end":{"date":null,"dateTime":"2019-11-13T16:00:00-06:00","timeZone":"America\/Chicago"},"backgroundColor":"#42d692","foregroundColor":"#000000"},{"summary":"Bulls Basketball Practice","start":{"date":null,"dateTime":"2019-11-13T17:30:00-06:00","timeZone":"America\/Chicago"},"end":{"date":null,"dateTime":"2019-11-13T18:30:00-06:00","timeZone":"America\/Chicago"},"backgroundColor":"#42d692","foregroundColor":"#000000"},{"summary":"Roast","start":{"date":"2019-11-14","dateTime":null,"timeZone":null},"end":{"date":"2019-11-15","dateTime":null,"timeZone":null},"backgroundColor":"#fad165","foregroundColor":"#000000"},{"summary":"Chamber Orchestra","start":{"date":null,"dateTime":"2019-11-14T15:00:00-06:00","timeZone":"America\/Chicago"},"end":{"date":null,"dateTime":"2019-11-14T15:30:00-06:00","timeZone":"America\/Chicago"},"backgroundColor":"#42d692","foregroundColor":"#000000"},{"summary":"Wires on Fire rehearsal","start":{"date":null,"dateTime":"2019-11-15T07:05:00-06:00","timeZone":"America\/Chicago"},"end":{"date":null,"dateTime":"2019-11-15T08:05:00-06:00","timeZone":"America\/Chicago"},"backgroundColor":"#9a9cff","foregroundColor":"#000000"},{"summary":"Megan lesson","start":{"date":null,"dateTime":"2019-11-15T13:45:00-06:00","timeZone":"America\/Chicago"},"end":{"date":null,"dateTime":"2019-11-15T14:45:00-06:00","timeZone":"America\/Chicago"},"backgroundColor":"#9a9cff","foregroundColor":"#000000"},{"summary":"Benton v. Bulls","start":{"date":null,"dateTime":"2019-11-15T17:30:00-06:00","timeZone":null},"end":{"date":null,"dateTime":"2019-11-15T18:30:00-06:00","timeZone":null},"backgroundColor":"#42d692","foregroundColor":"#000000"},{"summary":"Troop 33 Campout - Pictured Rocks\/Camp Courageous","start":{"date":null,"dateTime":"2019-11-15T18:00:00-06:00","timeZone":null},"end":{"date":null,"dateTime":"2019-11-17T11:00:00-06:00","timeZone":null},"backgroundColor":"#42d692","foregroundColor":"#000000"}];

function loadCalendar(){
  // Do something here to get the calendar data.
  // for now, it is added statically
  // displayData() should be a callback from loading
  // for now, just call directly
  //displayData(calendarData);
  $.getJSON("calendar.php", "", displayData)
}

function displayData(data){
  $('#Calendar').empty();
  data.forEach(processStartEnd);
}

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

// The API guarantees us that it will not send events that end prior to now
// However, we do need to handle events that are ongoing and may even have
// started days before now. This function will determine start and end dates
// and times for the events and add them to the calendar display for each
// date upon which they occur.
function processStartEnd(calendarEvent){
  // Setup some variables to hold today and tomorrow's dates.
  let today = new Date(); //Set to right now
  today.setHours(0, 0, 0, 0); //Reset to beginning of local day

  let tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  let nextDay = tomorrow;
  
  // Initialize to false. Will set true if needed later.
  calendarEvent.startsBeforeDate = false;

  if(null!=calendarEvent.start.date){
    //split the date into parts. This way the local timezone gets used instead of UTC
    let parts = calendarEvent.end.date.split('-');
    calendarEvent.endDate = new Date(parts[0], parts[1]-1, parts[2]);
    parts = calendarEvent.start.date.split('-');
    calendarEvent.startDate = new Date(parts[0], parts[1]-1, parts[2]);

    //Does the all day event start before today? If it does, stuff today's date as the beginning
    if(today.getTime() > calendarEvent.startDate.getTime()){
      calendarEvent.startDate = today;
      calendarEvent.startsBeforeDate = true;
    }

    // Starting date is established. Keep track of what the following day is.
    nextDay.setDate(calendarEvent.startDate.getDate()+1);

    do{
      calendarEvent.endsAfterDate = (nextDay.getTime() < calendarEvent.endDate.getTime());
      loadEvent(calendarEvent);
      //Move the start date to the next day
      calendarEvent.startDate.setDate(calendarEvent.startDate.getDate()+1);
      calendarEvent.startsBeforeDate = true;

      nextDay.setDate(calendarEvent.startDate.getDate()+1);
    }while (calendarEvent.startDate < calendarEvent.endDate); //quit if the start and end match now
  }else{
    //Google provides a timezone as part of the dateTimeString
    calendarEvent.startDate = new Date(calendarEvent.start.dateTime);
    calendarEvent.endDate = new Date(calendarEvent.end.dateTime);

    if (today.getTime() > calendarEvent.startDate.getTime()){
      calendarEvent.startDate = today;
      calendarEvent.startsBeforeDate = true;
    }
    
    // Starting date is established. Keep track of what the following day is.
    nextDay.setDate(calendarEvent.startDate.getDate()+1);

    do{
      calendarEvent.endsAfterDate = (nextDay.getTime() < calendarEvent.endDate.getTime());
      loadEvent(calendarEvent);
      //Advance to next date
      calendarEvent.startDate.setDate(calendarEvent.startDate.getDate()+1);
      //Set time to midnight on the dot
      calendarEvent.startDate.setHours(0, 0, 0, 0);
      calendarEvent.startsBeforeDate = true;
      nextDay.setDate(calendarEvent.startDate.getDate()+1);
    }while(calendarEvent.startDate < calendarEvent.endDate); 
  }
}

function loadEvent(calendarEvent){
  let dayName = days[calendarEvent.startDate.getDay()] + ", " + months[calendarEvent.startDate.getMonth()] + " " + getOrdinal(calendarEvent.startDate.getDate());
  let dayID = calendarEvent.startDate.getFullYear() + "-" + (calendarEvent.startDate.getMonth() + 1) + "-" + calendarEvent.startDate.getDate();
  // If there isn't already a div for this date, add it
  if (0==$('#Calendar > #' + dayID).length){
    $('#Calendar').append("<div class='day' id='" + dayID + "'>" + dayName + "</div>");
  }

  //For sure, the div this this date exists now, put the event in it.
  let eventString = "<div class='event' style='background-color : "+calendarEvent.backgroundColor+"; color : "+calendarEvent.foregroundColor+";'>";
  //First Style for the all day events
  if (null != calendarEvent.start.date){
    if (calendarEvent.startsBeforeDate){
      eventString += "« ";
    }
    eventString += calendarEvent.summary;
    if (calendarEvent.endsAfterDate){
      eventString += " »";
    }
  }else{
    // do the specific time format instead
    let ampm = "";
    let h = "";
    if (calendarEvent.startsBeforeDate){
      eventString += "« ";
    }else{
      h = calendarEvent.startDate.getHours()

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
      eventString += h + ":" + calendarEvent.startDate.getMinutes().toString().padStart(2, "0") + ampm + " ";
    }
    if (calendarEvent.endsAfterDate){
      eventString += "» ";
    }else{
      h = calendarEvent.endDate.getHours()

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
      eventString += h + ":" + calendarEvent.endDate.getMinutes().toString().padStart(2, "0") + ampm + " ";
    }

    eventString += calendarEvent.summary;
  }

  eventString += "</div>";
  $('#Calendar > #'+dayID).append(eventString);

}
