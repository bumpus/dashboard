var calendarData = [{"summary":"Multi-day Event","start":{"date":null,"dateTime":"2019-11-07T10:00:00-06:00","timeZone":null},"end":{"date":null,"dateTime":"2019-11-10T10:30:00-06:00","timeZone":null},"backgroundColor":"#9fe1e7","foregroundColor":"#000000"},{"summary":"Weekend","start":{"date":"2019-11-08","dateTime":null,"timeZone":null},"end":{"date":"2019-11-11","dateTime":null,"timeZone":null},"backgroundColor":"#9fe1e7","foregroundColor":"#000000"},{"summary":"Roasted Pork with Apples and Potatoes","start":{"date":"2019-11-09","dateTime":null,"timeZone":null},"end":{"date":"2019-11-10","dateTime":null,"timeZone":null},"backgroundColor":"#fad165","foregroundColor":"#000000"},{"summary":"Scouting for Food Bag Pickup","start":{"date":null,"dateTime":"2019-11-09T09:00:00-06:00","timeZone":null},"end":{"date":null,"dateTime":"2019-11-09T13:00:00-06:00","timeZone":null},"backgroundColor":"#42d692","foregroundColor":"#000000"},{"summary":"Hawkeyes @ Badgers","start":{"date":null,"dateTime":"2019-11-09T15:00:00-06:00","timeZone":null},"end":{"date":null,"dateTime":"2019-11-09T18:00:00-06:00","timeZone":null},"backgroundColor":"#ffad46","foregroundColor":"#000000"},{"summary":"Overnight Event","start":{"date":null,"dateTime":"2019-11-09T20:00:00-06:00","timeZone":null},"end":{"date":null,"dateTime":"2019-11-10T08:30:00-06:00","timeZone":null},"backgroundColor":"#9fe1e7","foregroundColor":"#000000"},{"summary":"Pasta w\/ Italian Sausage","start":{"date":"2019-11-10","dateTime":null,"timeZone":null},"end":{"date":"2019-11-11","dateTime":null,"timeZone":null},"backgroundColor":"#fad165","foregroundColor":"#000000"},{"summary":"\ud83c\udfc1 Bluegreen Vacations 500","start":{"date":null,"dateTime":"2019-11-10T13:30:00-06:00","timeZone":"America\/New_York"},"end":{"date":null,"dateTime":"2019-11-10T17:30:00-06:00","timeZone":"America\/New_York"},"backgroundColor":"#cd74e6","foregroundColor":"#000000"},{"summary":"Discovery Chorus","start":{"date":null,"dateTime":"2019-11-10T14:30:00-06:00","timeZone":"America\/Chicago"},"end":{"date":null,"dateTime":"2019-11-10T16:00:00-06:00","timeZone":"America\/Chicago"},"backgroundColor":"#42d692","foregroundColor":"#000000"},{"summary":"Nutcracker Practice","start":{"date":null,"dateTime":"2019-11-10T16:00:00-06:00","timeZone":"America\/Chicago"},"end":{"date":null,"dateTime":"2019-11-10T16:30:00-06:00","timeZone":"America\/Chicago"},"backgroundColor":"#42d692","foregroundColor":"#000000"},{"summary":"Friends of Troop 33 Committee Mtg at Soukup House","start":{"date":null,"dateTime":"2019-11-10T18:00:00-06:00","timeZone":null},"end":{"date":null,"dateTime":"2019-11-10T19:00:00-06:00","timeZone":null},"backgroundColor":"#42d692","foregroundColor":"#000000"},{"summary":"Friends of Troop 33 Mtg - at Soukup House","start":{"date":null,"dateTime":"2019-11-10T19:00:00-06:00","timeZone":null},"end":{"date":null,"dateTime":"2019-11-10T20:30:00-06:00","timeZone":null},"backgroundColor":"#42d692","foregroundColor":"#000000"},{"summary":"chicken curry","start":{"date":"2019-11-11","dateTime":null,"timeZone":null},"end":{"date":"2019-11-12","dateTime":null,"timeZone":null},"backgroundColor":"#fad165","foregroundColor":"#000000"},{"summary":"Veterans Day","start":{"date":"2019-11-11","dateTime":null,"timeZone":null},"end":{"date":"2019-11-12","dateTime":null,"timeZone":null},"backgroundColor":"#16a765","foregroundColor":"#000000"},{"summary":"Cello Lesson","start":{"date":null,"dateTime":"2019-11-11T16:30:00-06:00","timeZone":"America\/Chicago"},"end":{"date":null,"dateTime":"2019-11-11T17:00:00-06:00","timeZone":"America\/Chicago"},"backgroundColor":"#42d692","foregroundColor":"#000000"}];


function loadCalendar(){
  // Do something here to get the calendar data.
  // for now, it is added statically
  // displayData() should be a callback from loading
  // for now, just call directly
  displayData(calendarData);
}
function displayData(data){
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
    console.log(today.getTime());
    console.log(calendarEvent.startDate.getTime());
    if(today.getTime() > calendarEvent.startDate.getTime()){
      calendarEvent.startDate = today;
      calendarEvent.startsBeforeDate = true;
    }

    // Starting date is established. Keep track of what the following day is.
    nextDay.setDate(calendarEvent.startDate.getDate()+1);

    do{
      calendarEvent.endsAfterDate = (nextDay.getTime() < calendarEvent.endDate.getTime());
      console.log("endsAfterDate: " + calendarEvent.endsAfterDate + " nextDay: " + nextDay.getTime() + " endDate: " + calendarEvent.endDate.getTime());
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
      console.log("endsAfterDate: " + calendarEvent.endsAfterDate + " nextDay: " + nextDay.getTime() + " endDate: " + calendarEvent.endDate.getTime());
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
