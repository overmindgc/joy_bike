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
			markers.push(marker);
		}		
	}
	
});