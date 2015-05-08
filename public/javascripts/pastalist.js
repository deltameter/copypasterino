function resize(){
	if ($(window).width() > 1000){
    	$("#titletext").text("ᕙ༼ຈل͜ຈ༽ᕗ Copypasterino.me ᕙ༼ຈل͜ຈ༽ᕗ");
    	$("#titletext").removeClass("mobile-title");
		$("#titletext").addClass("desktop-title");
        $("#navlist").removeClass("navbar-nav");
        $("#navlist").addClass("nav-justified");
		$("#titlesubtext").show();
    }else{
    	$("#titletext").text("Copypasterino.me");
    	$("#titletext").removeClass("desktop-title");
		$("#titletext").addClass("mobile-title");
        $("#navlist").removeClass("nav-justified");
        $("#navlist").addClass("navbar-nav");
    	$("#titlesubtext").hide();
    }
}
function loadLinks(links){
	for (var i = 0; i < links; i++) {
		var button = $('<li><a class = "btn btn-default" href = "/copypastas/' + i + '">' + i + '</a></li>')
		$("#pastaslist").append(button);
	};
}

function getCount(){
	$.ajax({
		type: 'GET',
		url:'/copypastascount'
	}).done(function(count){
		console.log(count);
		loadLinks(count);
	});
}
$(document).ready(function(){
	resize();
	getCount();
	$(window).resize(function() {
		resize();
	});
});