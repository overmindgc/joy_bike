$(function(){
	var controller ={
		init:function(){
			var t=this;
			t.isPhoneNo();
			t.getCodeRequest();
			t.checkBoxState();
			t.checkIfValid();
		},
		isPhoneNo:function(){//手机号验证
			var value="";
			var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
			$('.login_username').on('input blur propertyChange',function(){
				value=$('.login_username').val();
				if(phoneReg.test(value)){
					$('.login_validCode').addClass('valid');
				}else{
					$('.login_validCode').removeClass('valid');
				}
			});
			
		},
		getCodeRequest:function(){
			var t=this;
			$('.login_validCode').tap(function(){
				if($(this).hasClass('valid')){//请求验证码
					if($(this).attr('data-status')!='lock'){
						$(".login_validCode").attr("data-status", "lock");
						t.getCode();
						t.countDown(60);
					}					
				}else{
					return false;
				}
			})
			
		},
		countDown:function(t){			
			$(".login_validCode").text(t + "秒后重新获取").css('font-size','0.5rem');
			var s = setInterval(function () {
				t--;
				$(".login_validCode").text(t + "秒后重新获取");
				if (t == 0) {
					clearInterval(s);
					$(".login_validCode").text("重新发送").css('font-size','1rem');
					$(".login_validCode").attr("data-status", "unlock");
				}
			},1000);			
		},
		getCode:function(){//checkIfvalid
			var url = 'http://api.joybike.com.cn/restful/user/getValidateCode';
			var data ={mobile:$.trim($('.login_username').val())};
			$.ajax({
				url:url,
				data:data,
				type:'get',
				dataType:'json',
				success:function(res){
					if(res.success){
						
					}else{
						popup(res.errorMessage)
					}
				},
				error:function(){
					
				}
			});
		},
		checkIfValid:function(){//检测是否有效
			var t=this;
			
			$('input').on('input blur propertyChange',function(){
				t.loginBtnClick();
			});
			
		},
		loginBtnClick:function(){
			var t=this;
			var phoneNumber=""; 
			var code = '';
			var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
				phoneNumber= $.trim($('.login_username').val());
				code = $.trim($('.login_passCode').val());
				if(phoneReg.test(phoneNumber)&&code!=''&&code.length==4&&$('.ev_checkState').hasClass('chosed')){
					$('.ev_loginBtn').addClass('login_permit').tap(function(){
						t.login();
					});
				}else{
					$('.ev_loginBtn').removeClass('login_permit').off('tap');
				}
		},
		login:function(){
			var t=this;
			var url ='http://api.joybike.com.cn/restful/user/validate';
			var data={mobile:$.trim($('.login_username').val()),validateCode:$.trim($('.login_passCode').val())}
			$.ajax({
				url:url,
				data:data,
				dataType:'json',
				type:"post",
				success:function(res){
					if(res.success){//请求成功，跳转
						window.location.href="http://api.joybike.com.cn/joybikeH5/joy_bike/auth.html";
					}else{
						popup(res.errorMessage);
					}
				}
			});
		},
		checkBoxState:function(){
			var t=this;
			$('.ev_checkLabel, .ev_checkState').tap(function(){
				if($('.ev_checkState').hasClass('chosed')){
					$('.ev_checkState').removeClass('chosed').addClass('unchosed');
					$('.ev_loginBtn').removeClass('login_permit').off('tap');
				}else{
					$('.ev_checkState').removeClass('unchosed').addClass('chosed');
					t.loginBtnClick();
				}
			});
		}
	};
	controller.init();
});
