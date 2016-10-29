$(function(){
	var url ='http://api.id98.cn/api/idcard';
	var appkey='79ab28c3bfbd630a05e8432161c05cdc';
	var name =$.trim($('.auth_trueName').val());//名字"邓永望";
	var cardno = $.trim($('.auth_cardno').val());//身份证号610922197401232578;
	var isIDCard15=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/; 
	var isIDCard18=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i;
	$('input').on('blur propertyChange input',function(){
		name =$.trim($('.auth_trueName').val());
		cardno = $.trim($('.auth_cardno').val());
		if(name!=""&&(isIDCard15.test(cardno)||isIDCard18.test(cardno))){
			$('.auth_btn').addClass('valid').tap(function(){
				$.ajax({
					url:url,
					data:{appkey:appkey,name:name,cardno:cardno},
					dataType:'jsonp',
					jsonp:"callback",
					success:function(res){
						if(res.success){
							window.location.href ='';
						}
					}
				});
			});
		}else{
			$('.auth_btn').removeClass('valid').off('tap');
		}
	})
	
});

