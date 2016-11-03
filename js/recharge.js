;(function(win,$){
	// var $rechargeInput = $('#rechargeInput');
	// $rechargeInput.on('focus',function(){
	// 	$(this).addClass('active');
	// }).on('blur',function(){
	// 	$(this).removeClass('active');
	// });
	// $rechargeInput.on('input',function(){
	// 	var val = $(this).val().replace(/^(0+|\.)|\D/g,'');
	// 	// var val = $(this).val().replace(/[^\d.]/g,'');
	// 	$(this).val(val);
	// });
	var $itemBox = $('#itemBox');
	var MINE = {
		userId:$.getCookie('userId')||'1',
		init:function(){
			var _this = this,html='';
			$.ajax({
				type:'GET',
				url:window.ROUT+'pay/product',
				data :{userId:_this.userId},
				success:function(d){
					if (d.success&&d.data) {
						var data = eval('(' + d.data + ')');
						for (var i = 0; i < data.length; i++) {
							html += '<li class="fl mt-20" data-value="'+data[i].price+'"><p class="ri-name ft-32">'+data[i].price+'元</p><p class="ri-tip ft-26">'+data[i].productName+'</p></li>';
						}
						$itemBox.html(html);
				}

				}
			});
			_this.bindEvent();
		},
		bindEvent:function(){
			$itemBox.on('tap','li',function(){
				console.log($(this).data('value'))
			});
			$('#czBtn').on('tap',function(){
				console.log('去充值');
			});
		}
	};
	MINE.init();
})(window,Zepto);

