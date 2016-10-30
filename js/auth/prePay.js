$(function(){
	var ctrl={
		path:{
			productList:ROUT+'pay/product'
		},
		init:function(){
			var t=this;
			t.getProductList();
		},
		getProductList:function(){
			var t=this;
			$.ajax({
				url:t.path.productList,
				type:"get",
				dataType:"json",
				success:function(res){
					if(res.success){
						var data = res.data;
						var html="";
						$.each(data,function(i,el){
							html+=  '<div class="prepay_price" data-price="+el.price+">'+
										'<div class="innerPriceWrap">'+
											'<p class='defaultPrice'>"+el.publishedPrice+"元</p>'+
											'<p class="sellPrice">售价："+el.price+"元</p>'+
										'</div>'+		
									'</div>';
						});
						$('.good_list').html(html);
						t.selectProduct();
					}else{
						
					}
				}
			});
		},
		selectProduct:function(){
			$('.prepay_price').click(function(){
				$('.count em').html($(this).attr('data-price'));
				$(this).addClass('active').siblings().removeClass('active');
			})
		}
		
	};
	ctrl.init();
});
