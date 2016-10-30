/*
 *提炼一些公用方法
 * */
;
(function($) {
    window.ROUT = 'http://api.joybike.com.cn/restful/';
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
                '<div class="ev_popup" style="position:fixed;width:80%;top:48%;left:10%;text-align:center;line-height:38px;padding:10px;margin:0 auto">' +
                '<div style="margin:0 auto;background:#2a2a2a;color:#fff;border-radius:10px;">' + s + '</div></div>'
            );


        } else {

            $(".ev_popup div").text(s);
        }
        setTimeout(function() {
            $(".ev_popup").remove();
        }, 3000)
    }

    function fnAjax(url, params, callback) { // 异步获取数据
        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            data: params,
            success: function(data) {
                callback(data);
            },
            error: function() {

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
    /**
     * [get description] 读取cookie值
     * @param  {[string]} key     [description] cookie键值名称
     * @param  {[object]} options [description] cookie可选对象
     * @return {[string]}         [description] 返回cookie键值所对应的的值，没有值返回null
     */
    $.getCookie = function(key, options) {
        options = options || {};
        var result, decode = options.raw ? function(s) {
            return s;
        } : decodeURIComponent;
        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
    };
    /**
     * [set description] 添加指定名称cookie值 , 过期时间小时制
     * @param {[type]} key   [description]
     * @param {[type]} value [description]
     * @param {[type]} opt   [description] cookie相关属性，
     */
    $.setCookie = function(key, value, options) {
        options = $.extend({}, {
            domain: '',
            path: '/'
        }, options);

        //删除cookie操作处理
        if (value === null) {
            options.expires = -1;
        }

        //设置过期时间
        if (typeof options.expires === 'number') {
            var seconds = options.expires,
                t = options.expires = new Date();
            t.setTime(t.getTime() + seconds * 1000 * 60 * 60);
        }

        //强制转换为字符串格式
        value = '' + value;

        //设置cookie信息
        return (document.cookie = [
            key, '=',
            options.raw ? value : value,
            options.expires ? '; expires=' + options.expires.toUTCString() : '',
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    };
})(Zepto);
