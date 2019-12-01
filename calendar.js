function loadCalendar(){
  // call to get data from the server. Once the data is received,
  // hand it off to a display function
  // If we can't load JSON, it's likely an authentication failure
  // Reload the whole page to get logged in again.
  console.log("Reloading Calendar Data!");
  $.getJSON("calendar.php", "", displayData).fail(function() {console.log("Failed to load calendar. Reloading Page!"); location.reload() });
}

function displayData(data){
  console.log("Got calendar data. Clearing and displaying new events");
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
  let nextDay = new Date(tomorrow);
  
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
    nextDay = new Date(calendarEvent.startDate); // Start from the starting date
    nextDay.setHours(0, 0, 0, 0); // Set back to midnight
    nextDay.setDate(nextDay.getDate()+1); // Add one day

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
    nextDay = new Date(calendarEvent.startDate); // Start from the starting date
    nextDay.setHours(0, 0, 0, 0); // Set back to midnight
    nextDay.setDate(nextDay.getDate()+1); // Add one day

    do{
      console.log("nextDay.getTime() = " + nextDay.getTime() + "calendarEvent.endDate.getTime() = " + calendarEvent.endDate.getTime());
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
      eventString += "<< ";
    }
    eventString += calendarEvent.summary;
    if (calendarEvent.endsAfterDate){
      eventString += " >>";
    }
  }else{
    // do the specific time format instead
    let ampm = "";
    let h = "";
    if (calendarEvent.startsBeforeDate){
      eventString += "<< - ";
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
      eventString += h + ":" + calendarEvent.startDate.getMinutes().toString().padStart(2, "0") + ampm + " - ";
    }
    if (calendarEvent.endsAfterDate){
      eventString += ">> ";
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
