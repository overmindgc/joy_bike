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
						$('#yue').html(d.data+'元');
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
		}
	};
	MINE.init();
})(Zepto);
