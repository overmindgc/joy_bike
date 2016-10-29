$(function(){
	var url ='http://api.joybike.com.cn/pay/deposit';
	var userId=""; 
	var dataParam={
		userId	:userId,
		rechargeType:1,
		orderMoney:400,
		channelId:2,
		openId:'',
		pruductDesc:"",
		openid:""
	};
	$('.ev_deposit').click(function(){
		$.ajax({
			url:url,
			data:dataParam,
			dataType:'jsonp',
			jsonp:"",
			type:'get',
			success:function(res){
				if(res.success){
					var data = res.data;
					wx.config({
					    debug: false, 
					    appId: data.appid, 
					    timestamp: data.timestamp, 
					    nonceStr: data.nonecestr, 
					    signature: data.sign,
					    jsApiList: [
					    	"chooseWXPay"
					    ]
					});
					wx.chooseWXPay({
					    timestamp: data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
					    nonceStr: data.noncestr, // 支付签名随机串，不长于 32 位
					    package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
					    signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
					    paySign: data.sign, // 支付签名
					    success: function (res) {
					        // 支付成功后的回调函数
					    }
					});
				}
			}
		})
	});
});
"data": {
      "appid": "wx8888888888888888",
      "partnerid": "1900000109",
      "prepayid": "WX1217752501201407033233368018",
      "package": "Sign=WXPay" ,
      "noncestr": "5K8264ILTKCH16CQ2502SI8ZNMTM67VS",
      "timestamp": "1412000000",
      "sign": "C380BEC2BFD727A4B6845133519F3AD6"
    }