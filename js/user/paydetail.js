;(function($){
	    $.parseMillisecond = function (ms,type,part) {
    	type = type || '-';
			part = part || 'all';
        if(!ms) return "";
        var date   = new Date(ms),
            year   = date.getFullYear(),
            month  = ("0" + (date.getMonth() + 1)).slice(-2),
            day    = ("0" + date.getDate()).slice(-2),
            hour   = ("0" + date.getHours()).slice(-2),
            minute = ("0" + date.getMinutes()).slice(-2),
            second = ("0" + date.getSeconds()).slice(-2);
						if(part == 'onlyDate'){
							return year + type + month + type + day;
						}
        return year + type + month + type + day + " " + hour + ":" + minute + ":" + second;
    };
	var $ul = $('#detailCon').children(),
	tmp ='<li class="border-box border-1px border-bottom">'
		+'	<div class="paydetail-name ft-32 fc-666">{name}</div>'
		+'	<span class="ft-22 fc-999">{time}</span>'
		+'	<span class="paydetail-price trans-v fc-ed6d2b">￥{price}</span>'
		+'</li>';
	var MINE = {
		userId:$.getCookie('userId'),
		init:function(){
			var _this = this;
			// 获取消费订单列表
			$.ajax({
				type:'GET',
				url:window.ROUT+'pay/getConsumeLogs',
				data :{userId:_this.userId},
				success:function(d){
					if(d.errorCode == 0 || d.success){
						var len = d.data.length,_html='';
						if(len){
							for (var i = 0; i < len; i++) {
								_html += tmp.replace('{name}','车辆骑行').replace('{time}',$.parseMillisecond(d.data[i].createAt)).replace('{price}',d.data[i].payAmount);
							}
							$ul.eq(0).html(_html);
						}
					}
				}
			});
			// 获取消费订单列表
			$.ajax({
				type:'GET',
				url:window.ROUT+'pay/getDepositLogs',
				data :{userId:_this.userId},
				success:function(d){
					if(d.errorCode == 0 || d.success){
						var len = d.data.length,_html='';
						if(len){
							for (var i = 0; i < len; i++) {
								_html += tmp.replace('{name}',d.data[i].payType == 0 ? '余额充值':'押金充值').replace('{time}',$.parseMillisecond(d.data[i].createAt)).replace('{price}',d.data[i].residualCash);
							}
							$ul.eq(1).html(_html);
						}
					}
				}
			});
			_this.bindEvent();
		},
		bindEvent:function(){
			var _this = this;
			$('.user-tourl').on('tap','li',function(){
				var _url = $(this).data('url');
				_url&&(window.location.href = _url+'.html');
			});
			$('#detailTab').children().on('tap',function(){
				var index = $(this).index();
				$(this).addClass('active').siblings().removeClass('active');
				$ul.hide();
				$ul.eq(index).show();
			});
		}
	};
	MINE.init();
})(Zepto);
