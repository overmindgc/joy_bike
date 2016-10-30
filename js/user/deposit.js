;(function($){
	var MINE = {
		userId:$.getCookie('userId')||'1',
		init:function(){
			var _this = this;
			_this.bindEvent();
		},
		bindEvent:function(){
			var _this = this,$tip=$('#tip');
			$('#tkBtn').on('tap',function(){
				$tip.show();
			});
			$tip.find('.cancel').on('tap',function(){
				$tip.hide();
			});
			$tip.find('.confirm').on('tap',function(){
				$.ajax({
					type:'POST',
					url:window.ROUT+'/pay/refund',
					data :{userId:_this.userId},
					success:function(d){
						console.log(d);
					}
				});
			});
		}
	};
	MINE.init();
})(Zepto);
