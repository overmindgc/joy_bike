$(function(){
	var ctrl ={
		path:{
			
		},
		init:function(){
			var t=this;
			t.radioToggle();
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
