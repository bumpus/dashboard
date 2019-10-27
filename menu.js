function loadMenus(){
  menuDate = new Date();
  var now = new Date();

  //If the time is after noon, get the menu for tomorrow
  if(menuDate.getHours() > 12){
    menuDate.setDate(menuDate.getDate() + 1);
  }
  $("#jefferson").html("<span class=school>Jefferson</span>");
  var url = "https://cr.nutrislice.com/menu/api/weeks/school/jefferson/menu-type/lunch/"+menuDate.getFullYear()+"/"+(menuDate.getMonth()+1).toString().padStart(2, '0')+"/"+menuDate.getDate().toString().padStart(2, '0')+"/?format=json-p&callback=?";
  $.getJSON(url, "", function (result) {
    parseMenu('#jefferson', result);
  });
  $("#taft").html("<span class=school>Taft</span>");
  url = "https://cr.nutrislice.com/menu/api/weeks/school/taft/menu-type/lunch/"+menuDate.getFullYear()+"/"+(menuDate.getMonth()+1).toString().padStart(2, '0')+"/"+menuDate.getDate().toString().padStart(2, '0')+"/?format=json-p&callback=?";
  $.getJSON(url, "", function (result) {
    parseMenu('#taft', result);
  });

  /* set to reload the menus at 1PM on the day the menu to get the next day's info */
  setTimeout(loadMenus, new Date(menuDate.getFullYear(), menuDate.getMonth(), menuDate.getDate(), 13, 0, 0, 0) - now);
}

function parseMenu(school, result){
  $(school+">span").append(" - "+ days[menuDate.getDay()] +"<br/>");
  if(result.days[menuDate.getDay()].menu_items.length != 0){
    $.each(result.days[menuDate.getDay()].menu_items ,function(index, item){
      if (item.text != ""){
        if(item.is_station_header == true)
          $(school).append("<span class='station'>"+item.text+"</span>")
        else
          $(school).append("<span class='comment'>"+item.text+"</span>")
        if (item.no_line_break)
          $(school).append(" ");
        else
          $(school).append("<br/>");
      }
      if (item.food != null){
        $(school).append(item.food.name);
        $(school).append("<br/>");
      }
    });
  }else{
    $(school).append("No Menu Today");
  }
}
