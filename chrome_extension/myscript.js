// alert("loaded extension");

var all_images = {};
var backendServerUrl = "http://fashionhack.com:4000/getData";

function add_to_manifest(imgObj, src, height, width){
	if( height > 20 && width > 20){
		var key = src + "_" + height + "_" + width;
		all_images[key] = imgObj;
	}
}
function buildManifest() {
     var images = document.images;
     for (var i=0; i<images.length; i++){
     	var x = images[i];
     	add_to_manifest(x, x.src, x.height, x.width );
     }
}
function queryBackend() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", backendServerUrl , true);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {

	    var resp = JSON.parse(xhr.responseText);

	    // alert("Response from server was: " + JSON.stringify(resp));
	    
	    for (var k in resp){
	    	// alert( k + " => " + resp[k]);
	    	var img = all_images[k];
	    	if( img ){
				img.addEventListener("click", function() {
					var url = resp[k];
  					var win=window.open(url, '_blank');
  					win.focus();
				}, false);
				img.addEventListener("mouseover", function(){
					img.style.filter       = "alpha(opacity=50)";
					img.style.opacity      = 0.5;
				}, false);
				img.addEventListener("mouseout", function(){
					img.style.filter       = "alpha(opacity=100)";
					img.style.opacity      = 1.0;
				}, false);
			}
	    }
	  }
	}
	xhr.send();
}

buildManifest();

// console.log(all_images );

queryBackend();


