$(function(){
	var url =ROUT+'service/valideIdCard';
	var appkey='79ab28c3bfbd630a05e8432161c05cdc';
	var realname =$.trim($('.auth_trueName').val());//名字"邓永望";
	var idcard = $.trim($('.auth_cardno').val());//身份证号610922197401232578;
	var isIDCard15=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/; 
	var isIDCard18=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i;
	$('input').on('blur propertyChange input',function(){
		realname =$.trim($('.auth_trueName').val());
		idcard = $.trim($('.auth_cardno').val());
		if(realname!=""&&(isIDCard15.test(idcard)||isIDCard18.test(idcard))){
			$('.auth_btn').addClass('valid').tap(function(){
				$.ajax({
					url:url,
					data:{realname:encodeURI(realname),idcard:idcard},
					dataType:'json',
					success:function(res){
						if(res.success){
							$.setCookie('realname',realname,{expires:24*7});
							$.setCookie('idcard',idcard,{expires:24*7});
							window.location.href ='http://60.205.142.55/forward/H5/joy_bike/authDeposit.html';
						}else{
							popup('您输入的名字与身份证号不匹配！');
						}
					}
				});
			});
		}else{
			$('.auth_btn').removeClass('valid').off('tap');
		}
	})
	
});

