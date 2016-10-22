/*
 *提炼一些公用方法
 * */

//是否微信浏览器
function isWeixin() {
    var nav = navigator.userAgent;
    if (/MicroMessenger/.test(nav)) {
        return true;
    } else {
        return false;
    }
};
function popup(s) {
    if ($(".ev_popup").length == 0) {

        $("body").append(
        	'<div class="ev_popup" style="position:fixed;width:80%;top:48%;left:10%;text-align:center;line-height:38px;padding:10px;margin:0 auto">'+
        	'<div style="margin:0 auto;background:#2a2a2a;color:#fff;border-radius:10px;">'+s+'</div></div>'
        	);

      
    } else {
        
        $(".ev_popup div").text(s);
    }
    setTimeout(function() {
        $(".ev_popup").remove();
    }, 3000)
}
function fnAjax(url,params,callback){ // 异步获取数据		
		$.ajax({
			url : url,
			type : "POST",
			dataType : "json",
			data : params,
			success : function(data){			
				callback(data);
			},
			error : function(){
				
			}			
		});
	}
String.prototype.cutString = function(len) {
    //length属性读出来的汉字长度为1
    if (this.length * 2 <= len) {
        return this;
    }
    var strlen = 0;
    var s = "";
    for (var i = 0; i < this.length; i++) {
        s = s + this.charAt(i);
        if (this.charCodeAt(i) > 128) {
            strlen = strlen + 2;
            if (strlen >= len) {
                return s.substring(0, s.length - 1) + "...";
            }
        } else {
            strlen = strlen + 1;
            if (strlen >= len) {
                return s.substring(0, s.length - 2) + "...";
            }
        }
    }
    return s;
};