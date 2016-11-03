;(function($){
	var MINE = {
		userId:$.getCookie('userId')||'1',
		init:function(){
			var _this = this;
			_this.bindEvent();
			$.ajax({
				type:'GET',
				url:window.ROUT+'pay/getConsumeLogs',
				data :{userId:_this.userId},
				success:function(d){
					console.log(d);
				}
			});
		},
		bindEvent:function(){

		}
	};
	MINE.init();
})(Zepto);
