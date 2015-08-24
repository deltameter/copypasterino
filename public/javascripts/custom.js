//@Michael Luo Dec 31 2014. Bootstrap, jQuery, Express.js, Node.js, Mongoose/MongoDB. Hipster af. 
//Copyright Michael Luo, so pls no copypasterino.
//needs LOTs of refactoring. will get back to it whenever(lmao never). 
window.onerror = function(message) { alert(message); return true; };

var localFavs = JSON.parse(localStorage.getItem("favouritePastas"));

var requestOptions = {pastatype:"all", category:"hot", id: 1};

//load the title asap 
if ($(window).width() > 1000){
	$("#titletext").text("ᕙ༼ຈل͜ຈ༽ᕗ Copypasterino.me ᕙ༼ຈل͜ຈ༽ᕗ");
	$("#titletext").addClass("desktop-title");
	$("#navlist").addClass("nav-justified");
}else{
	$("#titletext").text("Copypasterino.me");
	$("#titletext").addClass("mobile-title");
	$("#navlist").addClass("navbar-nav");
	$("#titlesubtext").hide();
	$("#ayylmao").hide();
}
var hasFlash = false;
try {
  var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
  if (fo) {
    hasFlash = true;
  }
} catch (e) {
  if (navigator.mimeTypes
        && navigator.mimeTypes['application/x-shockwave-flash'] != undefined
        && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
    hasFlash = true;
  }
}
if (hasFlash){
	var cpinfoMessage = "Press the copy button to automatically copy!";
	$("#cpinfo").text(cpinfoMessage);
}else{
	var cpinfoMessage = "Highlight the copypastas by clicking on them!";
	$("#cpinfo").text(cpinfoMessage);
}

jQuery.fn.selectText = function(){
   var doc = document;
   var element = this[0];
   //console.log(this, element);
   if (doc.body.createTextRange) {
       var range = document.body.createTextRange();
       range.moveToElementText(element);
       range.setEndBefore(element.children[0]);
       range.select();
   } else if (window.getSelection) {
       var selection = window.getSelection();      
       var range = document.createRange();
       range.selectNodeContents(element);
       selection.removeAllRanges();
       range.setEndBefore(element.children[0]);
       selection.addRange(range);
   }
};

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function removeJSONArray(array, property, value) {
   $.each(array, function(index, result) {
      if(result[property] == value) {
          //Remove from array
          array.splice(index, 1);
          return false;
      }    
   });
}

function loadLocalPastas(){
	try{
		if(typeof(Storage) !== "undefined") {
			if (localStorage.getItem("favouritePastas") !== null){
			}else{
				localFavs = []; //create an empty array for the user to be able to add pastas onto
				localStorage.setItem("favouritePastas", JSON.stringify(localFavs));
			}
		} else {
	    //ayy lmao what is this 2005
		}
	}
	catch (err){
		alert("Hi, this website saves your favourited copypastas to local memory so you can access them easily. Running in private mode doesn't allow us to do this, and it spits up an error so it won't load. Try running it in non-private mode. Thanks");
	}
}
function addCopyMovie(copybutton, pasta){
	var client = new ZeroClipboard(copybutton);
	client.on('ready', function(event) {
        //console.log('movie is loaded');
        client.on('copy', function(event) {
            //target is defined in data-clipboard-target while creating button
            event.clipboardData.setData('text/plain', pasta);//instead of value, innerText works as well
        });
        // callback triggered on successful copying
        client.on('aftercopy', function(event) {
            //console.log("Text copied to clipboard: \n" + event.data['text/plain']);
          	if (copybutton.parent().children(".popover").length < 1)
          	{
            	copybutton.popover('show');
          	}
        
        });
    });
}
function clearPastas(){
	$.each($("#pastapot").children(".row"), function(){
		$(this).remove();
	});
}
//finish later
function loadFavPastas(){
	clearPastas();
	if (localFavs.length === 0){
		$("#cpinfo").text("Press the heart button to save copypastas to your favorites! This way, you don't have to keep searching for them every time!");
	}
	$.each(localFavs, function(index){
		var id = this["id"];
		var pasta = this["pasta"];
		var pastawell = $('<div class = "well col-md-6 col-sm-8 col-xs-10">' + pasta + '<br>' + '</div>');
		var trashbutton = $('<button class = "btn trash pull-left btn-lg"><span class="glyphicon glyphicon-trash" aria-hidden="true" style = "vertical-align:middle"></span></button>');
		var row = $('<div class = "row"><div class = "col-md-3 col-sm-2 col-xs-1"></div></div>');
		if (hasFlash){
			var copybutton = $('<button class = "btn btn-info btn-lg pull-right" data-toggle="popover" data-placement ="right" data-content="Copied!">Copy</button>');
			pastawell.append(copybutton);
			addCopyMovie(copybutton, pasta);
		}else{
			pastawell.on("click", function(e){
				if($(e.target).is($(this))){
		            $(this).selectText();
		        }
			});
		}
		pastawell.append(trashbutton);
		row.append(pastawell);
		$("#pastapot").append(row);
		$(trashbutton).on("click", function(){
			$(this).parent().parent().slideUp(300);
			setTimeout(function(){
				removeJSONArray(localFavs, "id", id);
				localStorage.setItem("favouritePastas", JSON.stringify(localFavs));
				$(this).parent().parent().remove();
			}, 300);
		});
	});
}

function loadPastas(data){
	clearPastas();
	//if there are less than 15 items per page, then it doesn't go on. so disable next
	if (data.length < 15){
		$(".next").addClass("disabled");
	}
	//change to data.copypasta when you recieving a json file 
	$.each(data, function(index){
		var id = this["id"];
		var pasta = this["pasta"];
		var favs = this["favourites"]
		var tags = '<div class = "tagscontainer pull-left">Tags:' + replaceAll("#", " #", this["tags"]) + '</div>';
		if ($(window).width() >= 615)
		{
			var favourites = $('<div class = "col-md-3 col-xs-2"><h5 class = "pull-right">\'s</h5><h5 class ="pull-right">&nbsp;<span class="glyphicon glyphicon-heart pull-right red" aria-hidden="true" style = "vertical-align:middle"></span></h5><h5 class = "pull-right number">' + favs + '</h5></div>');
			var pastawell = $('<div class = "well col-md-6 col-sm-8 col-xs-8">' + pasta + '<br>' + '</div>');
	    }else{
	    	var favourites = $('<div class = "col-xs-1"></div>');
	    	var pastawell = $('<div class = "well col-md-6 col-sm-8 col-xs-10">' + pasta + '<br>' + '</div>');
	    }
		var favbutton;
		var row = $('<div class = "row"></div>');
		pastawell.append(tags);

		if(hasFlash){
			favbutton = $('<button class = "btn favbutton pull-right btn-lg" data-toggle="popover" data-trigger="manual" data-placement="bottom" data-content="Favorited!"><span class="glyphicon glyphicon-heart" aria-hidden="true" style = "vertical-align:middle"></span></button>');
			var copybutton = $('<button class = "btn btn-info pull-right btn-lg" data-toggle="popover" data-placement="right" data-content="Copied!">Copy</button>');
			pastawell.append(copybutton);
			addCopyMovie(copybutton, pasta);
		}else{
			favbutton = $('<button class = "btn favnoflash pull-right btn-lg" data-toggle="popover" data-trigger="manual" data-placement="bottom" data-content="Favorited!"><span class="glyphicon glyphicon-heart" aria-hidden="true" style = "vertical-align:middle"></span></button>');
			pastawell.on("click", function(e){
				if($(e.target).is($(this))){
		            $(this).selectText();
		        }
			});
		}
		pastawell.append(favbutton);
		favbutton.on("click", function(event){
			var bAlreadyFav = false;
			for (var i = localFavs.length - 1; i >= 0; i--) {
				if (localFavs[i].id === id){
					bAlreadyFav = true;
					break;
				}
			};
			if (!bAlreadyFav){
				//tell the server that this has been favourited
				//add 1
				if (favourites.has(".number").length){
					favourites.children(".number").text((favs + 1));
				}
				$.ajax({
					url: '/favouritepasta',
					type: 'POST',
					data: JSON.stringify({"id":id}),
					contentType:"application/json"
				});
				$(this).popover("show");
				var pastaJSON = {'id':id, 'pasta':pasta};
				localFavs.push(pastaJSON);
				localStorage.setItem("favouritePastas", JSON.stringify(localFavs));
				$(this).children(".glyphicon").addClass("active");
			}
		});
		row.append(favourites);
		row.append(pastawell);
		$("#pastapot").append(row);
		for (var i = localFavs.length - 1; i >= 0; i--) {
				if (localFavs[i].id === id){
					favbutton.children(".glyphicon").addClass("active");
					break;
				}
		};
	});
}

function setURL(){
	var newUrl = '/' + requestOptions["pastatype"] + '/' 
	+ requestOptions["category"] + '/' + requestOptions["id"];
	window.history.pushState(null, '', newUrl);
	//google analytics stuff
	ga('send', 'pageview', newUrl);
}
function categoryPressed(a){
	if (!a.hasClass("active"))
	{
		$(".disabled").removeClass("disabled");
		$(".previous").addClass("disabled");
		$("#pagecounter").text("1");
		setRequestOptions(a.data("category"), 1);
		requestCategoryPastas();
		setURL();
	}
}

function setRequestOptions(category, id){
	requestOptions["category"] = category;
	requestOptions["id"] = id;
}

function requestCategoryPastas(){
	$.get("/static/" + requestOptions["pastatype"] + "/" + requestOptions["category"] + "/" + requestOptions["id"], function(data){
		$("#cpinfo").text(cpinfoMessage);
		loadPastas(data);
	});
}

function singlePageCategory(){
	$(".pager").children("li").addClass("disabled");
	$("#pagecounter").text("1");
}

function disablePagination(){
	$(".next").addClass("disabled");
	$(".previous").addClass("disabled");
	$("#pagecounter").text("1");
}

function loadSettings(){
	var category = $("#category-name").data("category");
	var pageNumber = $("#category-name").data("page")
	requestOptions["pastatype"] = $("#category-name").data("type");;
	requestOptions["category"] = category;
	requestOptions["id"] = pageNumber;
	$("#pagecounter").text(pageNumber);
	if (pageNumber === 1){
		$(".next").removeClass("disabled");
		$(".previous").addClass("disabled");
	}else if (pageNumber === 7){
		$(".next").addClass("disabled");
		$(".previous").removeClass("disabled");
	}else{
		$(".next").removeClass("disabled");
		$(".previous").removeClass("disabled");
	}
	if (category !== 'favourites'){
		if (category === "hot"){
			$("#sortByHot").children().addClass("chosen");
		}else if (category === "new"){
			$("#sortByNew").children().addClass("chosen");
		}else{
			if (requestOptions["pastatype"] !== 'all'){
				disablePagination();
			}
			$("#sortByTop").children().children("a").addClass("chosen");
			if (category === "thisweek"){
				$("#thisweek").addClass("chosen");
			}else if (category === "thismonth"){
				$("#thismonth").addClass("chosen");
			}else if (category === "alltime"){
				$("#alltime").addClass("chosen");
			}
		}
		requestCategoryPastas();
	}else{
		//load in favourites
		$("#sortByFav").children().addClass("chosen");
		singlePageCategory();
		loadFavPastas();
	}
}
$(document).ready(function() {
	$("[rel=tooltip]").tooltip({ placement: 'left'});
	loadLocalPastas();
	ZeroClipboard.config( { swfPath: "/images/ZeroClipboard.swf" } );
	loadSettings();
	$(window).resize(function() {
	    var viewportWidth = $(window).width();
	    if (viewportWidth > 1000){
	    	$("#titletext").text("ᕙ༼ຈل͜ຈ༽ᕗ Copypasterino.me ᕙ༼ຈل͜ຈ༽ᕗ");
	    	$("#titletext").removeClass("mobile-title");
			$("#titletext").addClass("desktop-title");
			$("#navlist").removeClass("navbar-nav");
			$("#navlist").addClass("nav-justified");
			$("#titlesubtext").show();
			$("#ayylmao").show();
	    }else{
	    	$("#titletext").text("Copypasterino.me");
	    	$("#titletext").removeClass("desktop-title");
			$("#titletext").addClass("mobile-title");
	    	$("#navlist").removeClass("nav-justified");
	    	$("#navlist").addClass("navbar-nav");
	    	$("#titlesubtext").hide();
	    	$("#ayylmao").hide();
	    }
	});

	$("#typechoices").children("li").on("click", "a", function(e){
		e.preventDefault();
		requestOptions["pastatype"] = $(this).data("type");
		requestOptions["id"] = 1;
		$("#category-name").text($(this).text());
		if (!$("#sortByFav").children().hasClass("chosen")){
			$(".next").removeClass("disabled");
			$(".previous").addClass("disabled");
			$("#pagecounter").text("1");
			requestCategoryPastas();
			setURL();
		}
		if (requestOptions["pastatype"] !== 'all' && requestOptions["category"] !== 'hot'
			&& requestOptions["category"] !== 'new'){
			disablePagination();
		}
	});

	$(".nav").children("li").on("click", ".selector", function(e){
		e.preventDefault();
		$(".chosen").removeClass("chosen")
		$(this).addClass("chosen");
	});

	$("#sortByHot").on("click", "a", function(){
		categoryPressed($(this));
		$(this).blur();
	});

	$("#sortByNew").on("click", "a", function(){
		categoryPressed($(this));
		$(this).blur();
	});

	$("#sortByTop").children("ul").children("li").on("click", "a", function(event){
		//bunch of crap to remove the highlight
		event.preventDefault();
		$(".selector").filter(".chosen").removeClass("chosen");
		$(this).parent().siblings(".chosen").removeClass("chosen");
		$("#sortByTop").children(".dropdown-toggle").addClass("chosen");
		$(this).parent().addClass("chosen");
		categoryPressed($(this));
		$(this).blur();
		if (requestOptions["pastatype"] !== 'all'){
			disablePagination();
		}
	});

	$("#sortByFav").mouseup(function(){
		//There is only 1 page for local favs, so disable the pagers
		singlePageCategory();
		loadFavPastas();
		window.history.pushState(null, '', '/favorites');
		ga('send', 'pageview', '/favorites');
		$(this).blur();
	});

	$("#submitbutton").click(function(event){
		event.preventDefault();
		$(this).blur();
		$("#sendpastabutton").text("Submit!");
		$("#submitpasta").slideToggle();
		if ($(this).hasClass("chosen"))
		{
			$(this).removeClass("chosen");
		}
		else
		{
			$(this).addClass("chosen");
		}
	});

	$("#sendpastabutton").on("click", function(){
		//Send to the server
		if($("#submitpastabox").val() != "" && $(this).text() === "Submit!"){
			var pasta = {
				"pasta": $("#submitpastabox").val(),
			 	"tags": replaceAll(" ", "", $("#tagsbox").val())};
			 	//console.log(JSON.stringify(pasta));
			$.ajax({
				url: '/submitpasta',
				type: 'POST',
				data: JSON.stringify(pasta),
				contentType:"application/json"
			});
		}
		$(this).text("Thanks! Sent for review!");

		$("#submitpasta").delay(1500).slideUp(600);
		setTimeout(function(){
			$("#submitpastabox").val("");
			$("#tagsbox").val("");
		}, 1500);
		$("#submitbutton").removeClass("chosen");
		$(this).blur();
	});

	$(".pager").children("li").on("click", "a", function(event){
		var button = $(this).parent();
		if (button.hasClass("disabled") === true){
			event.preventDefault();
		}else{
			//If the user has hit a button, they are neither going to be at the max page or min page
			//therefore we can safely remove disabled from all classes
			$(".disabled").removeClass("disabled");
			if(button.hasClass("next") && requestOptions["id"] < 7){
				requestOptions["id"]++;
				requestCategoryPastas();
				//disable button if gone past 3
				if (requestOptions["id"] === 7){
					button.addClass("disabled");
				}
			}else if (button.hasClass("previous") && requestOptions["id"] > 1){
				requestOptions["id"]--;
				requestCategoryPastas();
				if (requestOptions["id"] === 1){
					button.addClass("disabled");
				} 
			}
			$("#pagecounter").text(requestOptions["id"]);
			console.log(requestOptions["id"])
			setURL();
		}
		$(this).blur();
	});

	$(".navbar-form").submit(function(e){
		e.preventDefault();
		ga('send', 'pageview', '/search');
		var searchTerms = replaceAll("#", "", $(this).find("input").val());
		$.get("/search/" + searchTerms, function(data){
			$("#cpinfo").text("Didn't find what you were looking for? Click 'Submit Pasta' and add it yourself!");
			loadPastas(data);
			singlePageCategory();
			$(".chosen").removeClass("chosen");
		});
	});

	$('body').on('click', function (e) {
	    $('[data-toggle="popover"]').each(function () {
	        //the 'is' for buttons that trigger popups
	        //the 'has' for icons within a button that triggers a popup
	        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
	            $(this).popover('hide');
	        }
	    });
	});
});
