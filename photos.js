var photoList;
var imageIndex = 0;
var photoDelay = 30000;
var previousPhoto;
var currentPhoto;

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
        }
      }
    );
}

function startList(data){
  //copy the received JSON data into the photoList array
  photoList = [];
  $.each(data, function (index, value) {
    photoList.push({url:value['url'] + "=w1920-h1080", id:value['id']});
  });
  currentPhoto = photoList[imageIndex];
  var myhtml = "<div id='"+currentPhoto.id+"' style=\"display: none; background-image : url('"+currentPhoto.url+"')\"></div>";
  console.log("Adding html: "+myhtml);
  $(".photos").append(myhtml);
  reveal();
}

function nextPhoto(){
  var myhtml = "<div id='"+currentPhoto.id+"' style=\"display: none; background-image : url('"+currentPhoto.url+"')\"></div>";
  console.log("Adding html: "+myhtml);
  $(".photos").append(myhtml);
  setTimeout(function(){$("#"+previousPhoto.id).fadeOut("slow", reveal);}, 1200);
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
