$(function() {
	//加载地图，调用浏览器定位服务
	var map = new AMap.Map('container', {
		resizeEnable: true,
		zoom:7
	});
	map.plugin(["AMap.ToolBar"], function() {
		map.addControl(new AMap.ToolBar());
	});
	if(location.href.indexOf('&guide=1')!==-1){
		map.setStatus({scrollWheel:false})
	}
	map.plugin('AMap.Geolocation', function() {
		var geolocation = new AMap.Geolocation({
			enableHighAccuracy: true, //是否使用高精度定位，默认:true
			timeout: 10000, //超过10秒后停止定位，默认：无穷大
			buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
			zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
//			showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
			buttonPosition: 'RB'
		});
		map.addControl(geolocation);
		geolocation.getCurrentPosition();
		AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
		AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
	});

	//解析定位结果
	function onComplete(data) {
		/*var str=['定位成功'];
		str.push('经度：' + data.position.getLng());
		str.push('纬度：' + data.position.getLat());
		str.push('精度：' + data.accuracy + ' 米');
		str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
		document.getElementById('tip').innerHTML = str.join('<br>');*/
		
		//添加点标记，并使用自己的icon
    var marker=new AMap.Marker({
        map: map,
		position: [data.position.getLng(),data.position.getLat()],
        icon: new AMap.Icon({            
            size: new AMap.Size(40, 50),  //图标大小
            image: "http://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png",
            imageOffset: new AMap.Pixel(0, -60)
        })        
    });
		
		
		/*var timer;
		if(navigator.geolocation){
            timer=navigator.geolocation.watchPosition(function(ev){
                alert(ev.coords.longitude+','+ev.coords.latitude);
            }, function(){
                alert('获取地理信息失败');
            },{frequency: 3000});
        }else{
            alert('您的设备不支持地理定位');
        }
        
        setTimeout(function(){
            navigator.geolocation.clearWatch(timer);
        }, 10000);*/
	}

	//解析定位错误信息
	function onError(data) {
		/*//初始化地图对象，加载地图
		////初始化加载地图时，若center及level属性缺省，地图默认显示用户当前城市范围
		var map = new AMap.Map('mapContainer', {
			resizeEnable: true
		});*/
		document.getElementById('tip').innerHTML = '请开启手机定位信息';
	}
	
	//当前位置图标
//	$('.amap-marker-content div img').attr('src','images/index_point.png');
	
	//定位图标偏移
	/*$('.amap-geolocation-con').css('right', 'auto');
	$('.amap-geolocation-con').css('bottom', '1.5625rem');
	$('.amap-geolocation-con').css('left', '0.9375rem');*/
	
	/*map.setZoom(7);
	console.log(map.getZoom());*/
	//地图上Marker标记
	var bikes = [{
		"name": "尚东.数字山谷A区",
		"center": "116.28782,40.042944",
		"type": 1,
		"subDistricts": []
	}
	, {
		"name": "烈日影视大厦",
		"center": "116.288796,40.04315",
		"type": 1,
		"subDistricts": []
	}, {
		"name": "天天易家",
		"center": "116.288979,40.043757",
		"type": 1,
		"subDistricts": []
	}, {
		"name": "极加餐饮",
		"center": "116.287943,40.043495",
		"type": 1,
		"subDistricts": []
	}, {
		"name": "网龙网络公司",
		"center": "116.288372,40.043548",
		"type": 1,
		"subDistricts": []
	}, {
		"name": "车1",
		"center": "116.288077,40.043248",
		"type": 1,
		"subDistricts": []
	}, {
		"name": "车2",
		"center": "116.288233,40.043302",
		"type": 1,
		"subDistricts": []
	}, {
		"name": "车3",
		"center": "116.288169,40.043047",
		"type": 1,
		"subDistricts": []
	}, {
		"name": "车4",
		"center": "116.288576,40.04285",
		"type": 1,
		"subDistricts": []
	}, {
		"name": "车5",
		"center": "116.288099,40.042686",
		"type": 1,
		"subDistricts": []
	}, {
		"name": "黄石科技大厦",
		"center": "116.28885,40.044386",
		"type": 1,
		"subDistricts": []
	}, {
		"name": "东馨园",
		"center": "116.289306,40.041622",
		"type": 1,
		"subDistricts": []
	}];
	getBikes();
	$('.index_refresh').click(getBikes);
	map.setFitView();
	
	function getBikes(){
		var markers=[];
		for (var i = 0; i < bikes.length; i += 1) {
			(function(index){
				var icon = new AMap.Icon({
		            image : 'images/index_bike.png',
		            //icon可缺省，缺省时为默认的蓝色水滴图标，
		            size : new AMap.Size(35,39.5)
		    	});
				var marker = new AMap.Marker({
					icon:icon,//24px*24px
					position: bikes[i].center.split(','),
					offset : new AMap.Pixel(-17.5,-19.75),
					title: bikes[i].name,
					map: map
				});
				marker.on('click',function(){
					javascript:openInfo(index);
				})
				markers.push(marker);
			})(i);
			
		}		
	}
	
	//在指定位置打开信息窗体
    function openInfo(i) {
        //构建信息窗体中显示的内容
        var title = '';
        var content = [];
    	content.push(
    		'<div style="position:relative;top:-1.5625rem;width:3rem;height: 2.15625rem;border-radius: 2.5px;-webkit-box-shadow:0px 1.5px 3.5px rgba(0,0,0,0.2);box-shadow:0px 1.5px 3.5px rgba(0,0,0,0.2);">'+
			'<div style="z-index:2;position:absolute;left:0;top:0;width:3rem;height: 2.15625rem;'+
			'background:url(images/index_thumbnail.png) no-repeat #fff 0.125rem 0.125rem;'+
			'background-size:2.75rem 1.9375rem;"></div>'+
			'<span style="display:block;background:#fff;position:absolute;bottom:-0.15rem;left:50%;margin-left:-0.15rem;width:0.3125rem;height:0.3125rem;-webkit-box-shadow:0px 1.5px 3.5px rgba(0,0,0,0.2);box-shadow:0px 1.5px 3.5px rgba(0,0,0,0.2);transform: rotate(-45deg);"></span></div>'
		);
        var infoWindow = new AMap.InfoWindow({
	        isCustom: true,  //使用自定义窗体
	        content: createInfoWindow(title, content.join("<br/>")),
	    });
        infoWindow.open(map, bikes[i].center.split(','));
        
        //构建自定义信息窗体
	    function createInfoWindow(title, content) {
	        var info = document.createElement("div");
	        info.className = "index_thumbnail";
			info.innerHTML = content;
	        return info;
	    }
	    
	    //关闭信息窗体
	    function closeInfoWindow() {
	        map.clearInfoWindow();
	    }
    }



	//扫描二维码点击图片切换
	var index_onOff=false;
	$('.index_scan').on('click',function(){
		if(index_onOff){
			$(this).children('img').attr('src','images/index_scan_hover.png');
			index_onOff=true;
		}else{
			$(this).children('img').attr('src','images/index_scan.png');
			index_onOff=false;
		}
	})






});