$(function(){
	var ctrl ={
		path:{
			feedBack:ROUT+'bicycle/submit'
		},
		init:function(){
			var t=this;
			t.radioToggle();
			t.getBikeCode();
		},
		getBikeCode:function(){
			var t=this;
			$.ajax({
				url:"",
				type:"post",
				data:{url:document.location.href},
				dataType:"json",
				success:function(data){
					var data=data;
					wx.config({
						appId:"",
						signature:"",
						noncestr:"",
						timestamp:"",
						jsApiList:[
							'scanQRCode'
						]
					})
					wx.scanQRCode({
						needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
					    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
					    success: function (res) {
						    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
						    $('.scanBefore').hide();
						    $('.scanAfter').show();
						    $('.bikeNumber').html(result);
						    t.feedBack();
						    
						}
					});
				}
			});
//			t.feedBack();
		},
		getReason:function(){
			var t=this;
			var val =$('input:checked').val();
			if(val=='其他'){
				val = $('#report_otherReasons');
			}
			return val;
		},
		getUploadImg:function(){
			
		},
		feedBack:function(){
			var t=this;			
			var bikeCode= $('.bikeNumber').html();
			var reason = t.getReason();
			var data={
					bicycleCode:bikeCode,
					cause:reason,
					faultImg:[],
					createId:$.getCookie('userId'),
					createAt:new Date().getTime()
				};
				//bicycleCode	是	String	车辆编码
//cause	是	String	报修原因
//faultImg	否	byte[]	报修图片
//createId	是	long	报修提交人
//createAt
			
			
			if(bikeCode!=""&&bikeCode.length==9&&reason!="")//车编号不为空，原因不为空
			{
				$('.ev_reportReason').addClass('valid').tap(function(){
					$.ajax({
						url:t.path.feedBack,
						data:data,
						dataType:"json",
						type:"post",
						success:function(res){
							if(res.success){
								
							}else{
								
							}
						}
					})
				});
			}else{
				$('.ev_reportReason').removeClass('valid').off('tap');
			}
			
		},
		radioToggle:function(){
			$('.reportDetail label').click(function(){
				$(this).addClass('chosed').siblings().removeClass('chosed');
			});
		}
	};
	ctrl.init();
})
//$('input:checked')
