var photoList;
var imageIndex = 0;
var photoDelay = 30000;
var retryDelay = 10000;
var fadeDelay = 1200;
var previousPhotoID;
var currentPhoto;

function sortList(){
  for (var i = 0; i < photoList.length; i++){
    if ('used' in photoList[i]){
      continue;
    }
    var aspectRatio = photoList[i].width/photoList[i].height;
    if (aspectRatio >= 1.0){
    }else{
      var j;
      for (j = ( i + 1); j < photoList.length; j++){
        var a2 = photoList[j].width/photoList[j].height;
        if (a2 < 1.0){
          photoList[i].partner = j;
          photoList[j].used = true;
          break;
        }
      }
    }
  }
}

function loadPhoto(){
  console.log("Loading Photo Album Data!");
  $.getJSON("photos.php", "", startList)
    .fail(
      function(xhr, textStatus, errorThrown) {
        console.log(xhr);
        console.log(textStatus);
        console.log(errorThrown);
        console.log(xhr.status);
        if (403 == xhr.status){
          console.log("Login failed. Redirect to config screen");
          location.href = '/config.php';
        }else{
          console.log("Fetching photo album data failed.");
          setTimeout(loadPhoto, retryDelay);
        }
      }
    );
}

function generateHtml(){
  var myhtml;
  if (currentPhoto.partner){
    myhtml =  "<div id='"+currentPhoto.id+"' style=\"display: none;\" >";
    myhtml += "<div  class='l' style=\"background-image : url('"+currentPhoto.url+"=w960')\"></div>";
    myhtml += "<div  class='r' style=\"background-image : url('"+photoList[currentPhoto.partner].url+"=w960')\"></div>";
    myhtml += "</div>";
  }else{
    var suffix;
    if ((currentPhoto.width / currentPhoto.height) > (1920/1080))
    {
      suffix = "=h1080";
    }
    else
    {
      suffix = "=w1920";
    }
    myhtml = "<div id='"+currentPhoto.id+"' style=\"display: none; background-image : url('"+currentPhoto.url+suffix+"')\"></div>";

  }
  return myhtml;
}

function startList(data){
  //copy the received JSON data into the photoList array
  photoList = [];
  $.each(data, function (index, value) {
    photoList.push({url:value['url'], id:value['id'], width:value['width'], height:value['height']});
  });
  //Sort out portrait mode pictures
  sortList();

  //Initialize the current photo index
  currentPhoto = photoList[imageIndex];
  nextPhoto();
}

function photoTransition(pID, cID){
  setTimeout(function(){$("#"+cID).fadeIn("slow");}, fadeDelay);
  setTimeout(function(){$("#"+pID).fadeOut("slow");}, fadeDelay);
  setTimeout(function(){$("#"+pID).remove();}, 2*fadeDelay);
}

function nextPhoto(){
  var myhtml = generateHtml();
  $(".photos").append(myhtml);

  if(previousPhotoID){
    photoTransition(previousPhotoID, currentPhoto.id);
  }else{
    $("#"+currentPhoto.id).fadeIn("fast");
  }

  imageIndex++;
  previousPhotoID = currentPhoto.id;

  /* Skip used images until finding a fresh one or reaching the end */
  while((imageIndex != photoList.length) && photoList[imageIndex].used){
    imageIndex++;
  }

  /* use the current image, or go back to the beginning */
  if (imageIndex != photoList.length){
    currentPhoto = photoList[imageIndex];
    setTimeout(nextPhoto, photoDelay);
  }else{
    imageIndex = 0;
    setTimeout(loadPhoto, photoDelay);
  }
}

