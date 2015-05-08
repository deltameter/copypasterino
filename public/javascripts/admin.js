//Put slashes before all the routes?
var currentPendingPasta;
var currentUpdatePasta;
var pastaCount;

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function clearPasta(type){
	if (type === "pending"){
		$("#pastabox").val("");
		$("#tagsbox").val("");
	}else if (type === "update"){
		$("#updatepastabox").val("");
		$("#updatetagsbox").val("");
	}
}

function loadPasta(pasta, type){
	if (type === "pending"){
		currentPendingPasta = pasta;
		$("#pastabox").val(pasta["pasta"]);
		$("#tagsbox").val(pasta["tags"]);
	}else if (type === "update"){
		currentUpdatePasta = pasta;
		$("#updatepastabox").val(pasta["pasta"]);
		$("#updatetagsbox").val(pasta["tags"]);
	}
}

function getCount(){
	$.ajax({
		type: 'GET',
		url:'/admingetcount'
	}).done(function(count){
		$("#count").text("Count:" + count);
		pastaCount = count;
	});
}

function createAdRow(data){
	console.log(data);
	var adrow = $('<div class = "row" style = "margin-top:50px"> </row>');
	adrow.append('<input type="text" class="form-control description" placeholder="description" style = "max-width:500px;float:left">');
	adrow.append('<input type="text" class="form-control link" placeholder="link" style = "max-width:500px;float:left">');

	var removeAd = $('<button type="button" class="btn btn-danger">Remove</button>');
	removeAd.on("click", function(){
		var removedAd = { "description": $(this).siblings(".description").val() };
		$.ajax({
			type: 'POST',
			url:'/removeAd',
			data: removedAd
		})
		$(this).parent().remove();
	});

	var submitad = $('<button type="button" class="btn btn-success">Add</button>');
	submitad.on("click", function(){
		var description = $(this).siblings(".description").val();
		var link = $(this).siblings(".link").val();
		if (description != "" && link != ""){
			var newAd = { "description": description, "link": link };
			$.ajax({
				type: 'POST',
				url:'/createad',
				data: newAd
			})
			$(this).parent().append(removeAd);
			$(this).siblings(".description").prop("readonly");
			$(this).siblings(".link").prop("readonly");
			$(this).remove();
		}
	});

	if (data != ""){
		console.log("0");
		adrow.children(".description").val(data.description);
		adrow.children(".description").prop("readonly");
		adrow.children(".link").val(data.link);
		adrow.children(".link").prop("readonly");
		adrow.append(removeAd);
	}else{
		adrow.append(submitad);
	}

	$("#adcontrol").append(adrow);
}
function loadAds(){
	$.ajax({
		type: 'GET',
		url:'/getDeals'
	}).done(function(ads){
		$.each(ads, function(index, ad){
			createAdRow(ad);
		});
	});
};
$(document).ready(function(){
	getCount();

	loadAds();
	$("#approve").on("click", function(){
		if ($("#pastabox").val() != ""){
			var approvedPasta = {"pasta": $("#pastabox").val(),
			"tags": replaceAll(" ", "", $("#tagsbox").val()),
			"_id": currentPendingPasta["_id"],
			"created_on": currentPendingPasta.created_on};

			$.ajax({
				type: 'POST',
				url:'/approvepasta',
				data: approvedPasta
			});
			clearPasta("pending");
			$("#count").text("Count:" + (pastaCount - 1));
		}
	});

	$("#reject").on("click", function(){
		if ($("#pastabox").val() != ""){
			$.ajax({
				type: 'POST',
				url:'/rejectpasta',
				data: {_id: currentPendingPasta["_id"]}
			});
			clearPasta("pending");
			$("#count").text("Count:" + (pastaCount - 1));
		}
	});

	$("#get").on("click", function(){
		$.ajax({
			type: 'GET',
			url:'/getpendingpasta'
		}).done(function(pasta){
			loadPasta(pasta, "pending");
			console.log(pasta);
		});
	});

	$(".navbar-form").on("submit", function(e){
		e.preventDefault();
		var searchTerms = replaceAll(" ", "", $(this).find("input").val());
		var encoded = encodeURIComponent(searchTerms);
		console.log(encoded);
		console.log(searchTerms);
		$.ajax({
			type: 'GET',
			url:'/adminfindpasta/' + encoded,
		}).done(function(pasta){
			loadPasta(pasta, "update");
			currentPendingPasta = pasta;
			console.log(pasta);
		});
	});

	$("#updateapprove").on("click", function(){
		if ($("#updatepastabox").val() != ""){
			var update = {
				"id": currentUpdatePasta.id,
				"pasta": $("#updatepastabox").val(),
				"tags": $("#updatetagsbox").val()
			};
			$.ajax({
				type: 'POST',
				url:'/adminupdatepasta',
				data: update
			});
		}
		clearPasta("update");
	});

	$("#newad").on("click", function(){
		createAdRow("");
	});

	$("#changeMessage").on("click", function(){
		var change = $("#alertMessage").val();
			if (change != ""){
			var varUpdate = {"change": $("#alertMessage").val()};
			$.ajax({
				type: 'POST',
				url:'/adminupdatevar/alertMessage',
				data: varUpdate
			});
		}
	});
	setInterval(getCount, 5000);
});