var photoList = [
  {"file": "IMG_20191019_082126988.jpg", "id": "pic01"},
  {"file": "IMG_20191021_191908189.jpg", "id": "pic02"},
  {"file": "IMG_8808.jpg", "id": "pic03"},
  {"file": "IMG_9180.jpg", "id": "pic04"},
  {"file": "IMG_9534.jpg", "id": "pic05"},
  {"file": "IMG_9717.jpg", "id": "pic06"},
  {"file": "IMG_9750.jpg", "id": "pic07"},
  {"file": "IMG_9856.jpg", "id": "pic08"},
  {"file": "IMG_9858.jpg", "id": "pic09"},
  {"file": "IMG_9883.jpg", "id": "pic10"}];
var imageIndex = 0;
var photoDelay = 30000;
var previousPhoto;
var currentPhoto;

function loadPhoto(){
  currentPhoto = photoList[imageIndex];
  $(".photos").append("<img style='display: none' id='"+currentPhoto.id+"' src='"+currentPhoto.file+"'></img>");
  reveal();
}

function nextPhoto(){
  $(".photos").append("<img style='display: none' id='"+currentPhoto.id+"' src='"+currentPhoto.file+"'></img>");
  $("#"+previousPhoto.id).fadeOut("slow", reveal);
}

function reveal(){
  if(previousPhoto){
    $("#"+previousPhoto.id).remove();
  }
  $("#"+currentPhoto.id).fadeIn("slow");
  imageIndex++;
  if (imageIndex == photoList.length){
    imageIndex = 0;
  }
  previousPhoto = currentPhoto;
  currentPhoto = photoList[imageIndex];
  setTimeout(nextPhoto, photoDelay);
}
