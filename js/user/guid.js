;(function($){
	var MINE = {
		userId:$.getCookie('userId'),
		init:function(){
			var _this = this;
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
