;(function($){
	var MINE = {
		userId:$.getCookie('userId')||'1',
		init:function(){
			var _this = this;
			// 获取用户账户余额
			$.ajax({
				type:'GET',
				url:window.ROUT+'user/getAcountMoney',
				data :{userId:_this.userId},
				success:function(d){
					if(d.errorCode == 0 || d.success){
						$('#yue').html(d.data+'<span class="ft-32">元</span>');
					}
				}
			});
			_this.bindEvent();
		},
		bindEvent:function(){
			var _this = this;
			$('body').on('tap',function(e){
				var _url = $(e.target).attr('toUrl');
				if(_url)window.location.href = _url+'.html';
			});
		}
	};
	MINE.init();
})(Zepto);

