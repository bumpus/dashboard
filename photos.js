var photoList = [{"file": "IMG_6240.JPG", "id": "pic01"},
  {"file": "IMG_6250.JPG", "id": "pic02"},
  {"file": "IMG_6258.JPG", "id": "pic03"},
  {"file": "IMG_6262.JPG", "id": "pic04"},
  {"file": "IMG_6267.JPG", "id": "pic05"},
  {"file": "IMG_6280.JPG", "id": "pic06"},
  {"file": "IMG_6298.JPG", "id": "pic07"},
  {"file": "IMG_6316.JPG", "id": "pic08"},
  {"file": "IMG_6431.JPG", "id": "pic09"},
  {"file": "IMG_6497.JPG", "id": "pic10"},
  {"file": "IMG_6504.JPG", "id": "pic11"},
  {"file": "IMG_6510.JPG", "id": "pic12"}];
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
