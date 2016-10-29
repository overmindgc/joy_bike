;(function(win,$){
	// var $rechargeInput = $('#rechargeInput');
	// $rechargeInput.on('focus',function(){
	// 	$(this).addClass('active');
	// }).on('blur',function(){
	// 	$(this).removeClass('active');
	// });
	// $rechargeInput.on('input',function(){
	// 	var val = $(this).val().replace(/^(0+|\.)|\D/g,'');
	// 	// var val = $(this).val().replace(/[^\d.]/g,'');
	// 	$(this).val(val);
	// });
	$.ajax({
		type:'GET',
		url:'http://api.sktbj.com:8080/restful/getValidateCode',
		// headers:{"Authentication":"B9A45EAC2C54BF5F8379C3D3A352A052"},
		xhrFields:{
			"Authentication":"B9A45EAC2C54BF5F8379C3D3A352A052"
		},
		// beforeSend:function(xhr){
		//  xhr.setRequestHeader("Authentication", "B9A45EAC2C54BF5F8379C3D3A352A052");
		// 		// xhr.setRequestHeader("Authentication","B9A45EAC2C54BF5F8379C3D3A352A052");
		// },
		data:{mobile:'17090132125'},
		success:function(d){
			console.log(d);
		}
	});
})(window,Zepto);

