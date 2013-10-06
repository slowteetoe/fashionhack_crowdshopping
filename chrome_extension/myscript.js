// alert("loaded extension");



var all_images = {};
var backendServerUrl = "http://fashionhack.com:4000";

/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
 * 
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 * 
 * @param {string} key ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash 
 */

function murmurhash3_32_gc(key, seed) {
	var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

	remainder = key.length & 3; // key.length % 4
	bytes = key.length - remainder;
	h1 = seed;
	c1 = 0xcc9e2d51;
	c2 = 0x1b873593;
	i = 0;

	while (i < bytes) {
	  	k1 = 
	  	  ((key.charCodeAt(i) & 0xff)) |
	  	  ((key.charCodeAt(++i) & 0xff) << 8) |
	  	  ((key.charCodeAt(++i) & 0xff) << 16) |
	  	  ((key.charCodeAt(++i) & 0xff) << 24);
		++i;

		k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

		h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
		h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
		h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
	}

	k1 = 0;

	switch (remainder) {
		case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
		case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
		case 1: k1 ^= (key.charCodeAt(i) & 0xff);

		k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
		h1 ^= k1;
	}

	h1 ^= key.length;

	h1 ^= h1 >>> 16;
	h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
	h1 ^= h1 >>> 13;
	h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
	h1 ^= h1 >>> 16;

	return h1 >>> 0;
}
var manifest = [];

function add_to_manifest(imgObj, src, height, width){
	if( height > 20 && width > 20){
		var key = src;
		var hashed_key = murmurhash3_32_gc(key,666);	// cuz it's evil
		console.log("hash is " + hashed_key)
		manifest.push(hashed_key);
		all_images[hashed_key] = imgObj;
	}
}
function buildManifest() {
     var images = document.images;
     for (var i=0; i<images.length; i++){
     	var x = images[i];
     	add_to_manifest(x, x.src, x.height, x.width );
     }
     console.log( manifest );
}
function queryBackend() {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", backendServerUrl + "/getData" , true);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {

	    var resp = JSON.parse(xhr.responseText);

	    // alert("Response from server was: " + JSON.stringify(resp));
	    
	    for (var k in resp){
	    	alert( k + " => " + resp[k]);
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
	xhr.send(JSON.stringify(manifest));
}

buildManifest();

// console.log(all_images );

queryBackend();



