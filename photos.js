var photoList;
var imageIndex = 0;
var photoDelay = 30000;
var previousPhoto;
var currentPhoto;

function loadPhoto(){
  console.log("Loading Photo Album Data!");
  $.getJSON("photos.php", "", startList).fail(function() {console.log("Failed to load photo album. Return to Login Page!"); location.href = '/config.php'});  
}

function startList(data){
  //copy the received JSON data into the photoList array
  photoList = [];
  $.each(data, function (index, value) {
    photoList.push({url:value['url'] + "=w640-h640", id:value['id']});
  });
  currentPhoto = photoList[imageIndex];
  $(".photos").append("<img style='display: none' id='"+currentPhoto.id+"' src='"+currentPhoto.url+"'></img>");
  reveal();
}

function nextPhoto(){
  $(".photos").append("<img style='display: none' id='"+currentPhoto.id+"' src='"+currentPhoto.url+"'></img>");
  $("#"+previousPhoto.id).fadeOut("slow", reveal);
}

function reveal(){
  if(previousPhoto){
    $("#"+previousPhoto.id).remove();
  }
  $("#"+currentPhoto.id).fadeIn("slow");
  imageIndex++;
  previousPhoto = currentPhoto;
  if (imageIndex != photoList.length){
    currentPhoto = photoList[imageIndex];
    setTimeout(nextPhoto, photoDelay);
  }else{
    imageIndex = 0;
    setTimeout(loadPhoto, photoDelay);
  }
}
