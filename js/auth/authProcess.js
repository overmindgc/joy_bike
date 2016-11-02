$(function(){
	var ctrl={
		path:{
			update:ROUT+"user/update"
		},
		init:function(){
			this.btnActive();
		},
		upload1:function(){
			var fr;
			function showPreview(source) {  
	            var file = source.files[0];  
	            if(window.FileReader) {  
	                fr = new FileReader();  
	                fr.onloadend = function(e) {  
//	                	console.log(fr);
	                    document.getElementById("portrait").src = e.target.result;  
	                };  
	                fr.readAsDataURL(file);  
	            }  
	        }  
	        $('#upload1').change(function(){
	        	showPreview(this);
	        });
	        console.log(fr)
	        return fr;
		},
		update:function(){
			
		},
		btnActive:function(){
			var t=this;
			var realname,
				idcard,
				nationality,userId,iphone;
			var upload1,upload2;
			userId= 4;//$.getCookie("userId");
			iphone =15901375531;//$.getCookie('iphone');
			realname="张柜";//$.getCookie('realname');
			idcard =210923198611043035;//$.getCookie('idcard');
			$('.auth_trueName').val(realname);
			$('.idcard').val(idcard);
			nationality =$('.auth_country').val();
			$('select,#upload1,#upload2').change(function(){
				nationality =$('.auth_country').val();
//				upload1 = $('#upload1').val();
upload1 =t.upload1().result;
upload2=t.upload1().result;
				upload2 = $('#upload2').val();
				if(realname!=""&&idcard!=""&&nationality!="请输入您的国籍"&&upload1!=''&&upload2!=""){
					$('.auth_btn').addClass('valid').tap(function(){
						$.ajax({
							url:t.path.update,
							data:{
								userId:userId,
								iphone:iphone,
								realName:realname,			//	是	String	真实姓名
								idNumber:idcard,			//	是	String	身份证号
								nationality:nationality,	//	否	String	国籍
								identityCardPhoto:upload2,	//	否	byte[]	身份证照片
								photo:upload1,				//	否	byte[]	人和身份证合影图片
								userImg:""
							}
						});
					});
				}else{
					$('.auth_btn').removeClass('valid').off('tap');
				}
			});
			
			
		}
	};
	ctrl.init();
	
});
