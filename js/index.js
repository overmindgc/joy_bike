$(function() {
/*	//身份认证
	$.ajax({
			    type: "get",
				url: "http://60.205.142.55/forward/service/valideIdCard",
				data: {
					idcard:"130233199302123023",
					realname:"%e6%9d%8e%e5%8d%ab%e4%bd%b3"
				},
				headers: {
					"Accept": 'application/json'
				},
				success: function(data){
					console.log(data);
					console.log(data.result);
				}
			});*/
			
/*	//故障上报
	var timestamp = Date.parse(new Date()); 
	timestamp = timestamp / 1000;
	var params={};
	params.bicycleCode = 'JOY002';
	params.cause= '车轮丢了';
	params.faultImg= [];
	params.createId= 15;
	params.createAt = timestamp;
	$.ajax({
		type: "post",
		url: window.ROUT+"bicycle/submit",
		contentType:'application/json',
		data: JSON.stringify(params),
		success: function(data){
			console.log(data);
			console.log(data.data);
		}
	});*/
/*	//测试开锁
	var timestamp = Date.parse(new Date());
	timestamp = timestamp / 1000;
	var params={};
	params.userId=15;
	params.bicycleCode = 'JOY002';
	params.beginAt = timestamp;
	params.beginDimension = 40.049;
	params.beginLongitude = 116.294;
	$.ajax({
		type: "post",
		url: window.ROUT+"bicycle/unlock",
		contentType:'application/json',
		data: JSON.stringify(params),
		success: function(data){
			console.log(data);
			console.log(data.data);
			console.log(data.success);
		}
	});*/

	//加载地图
	var map = new AMap.Map('container', {
		resizeEnable: true,
		center:[116.295,40.048],
		dragEnable: true
	});
	//自定义定位标记
    var toolBar;
    var customMarker = new AMap.Marker({
        offset: new AMap.Pixel(-17, -36),//相对于基点的位置
        icon: new AMap.Icon({  //复杂图标
            size: new AMap.Size(36, 82),//图标大小
            image: "images/index_centralPos.png", //大图地址
            imageOffset: new AMap.Pixel(0, 0)//相对于大图的取图位置
        })
    });
	//地图中添加地图操作ToolBar插件
    map.plugin(["AMap.ToolBar"], function() {
        toolBar = new AMap.ToolBar({locationMarker: customMarker}); //设置地位标记为自定义标记
        map.addControl(toolBar);
    });
    
/*	if(location.href.indexOf('&guide=1')!==-1){
		map.setStatus({scrollWheel:false})
	}*/
	//调用浏览器定位服务
/*	map.plugin('AMap.Geolocation', function() {
		var geolocation = new AMap.Geolocation({
			enableHighAccuracy: true, //是否使用高精度定位，默认:true
			timeout: 10000, //超过10秒后停止定位，默认：无穷大
			buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
			zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
			showMarker: false,	 //定位成功后在定位到的位置显示点标记，默认：true
			showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
			buttonPosition: 'RB'
		});
		map.addControl(geolocation);
		geolocation.getCurrentPosition();
//		map.setZoomAndCenter(17, [116.28782,40.042944]);
		AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
		AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
	});*/

    onComplete();
	var extra_line1,extra_line2,extra_line3;
	//解析定位结果
	function onComplete(data) {
//		map.setZoomAndCenter(14, [116.287,40.042]);
		/*var lng=data.position.getLng();
		var lat=data.position.getLat();
		var curPosition=[];
		curPosition.push(lng);
		curPosition.push(lat);*/
		var curPosition=[116.295,40.048];
		var curAddress;
		var vehicleId;
		map.plugin('AMap.Geocoder',function() {  //逆地理编码
	        var geocoder = new AMap.Geocoder({
	            radius: 1000,
	            extensions: "all"
	        });
	        map.addControl(geocoder);
	        geocoder.getAddress(curPosition, function(status, result) {
	            if (status === 'complete' && result.info === 'OK') {
	                geocoder_CallBack(result);
	            }
	        });
	        addIcon(curPosition);
	        map.setFitView();
		});
	    function geocoder_CallBack(data) {
	        curAddress = data.regeocode.formattedAddress; //返回地址描述
	    }		
		function addIcon(pos){	//添加点标记，并使用自己的icon		
		    new AMap.Marker({
		        map: map,
				position: pos,
		        icon: new AMap.Icon({            
		            size: new AMap.Size(70, 79),  //图标大小
		            image: "images/index_point.png",
		            imageOffset: new AMap.Pixel(-8, 14)
		        })        
		    });
		};
				
//		toolBar.doLocation();

//判断用户使用状态
	$.ajax({
		type: "get",
		url: window.ROUT+"user/useInfo",
		data: {
			userId:$.getCookie('userId')||15
		},
		success: function(data){
			console.log(data);
			/*console.log(data.data);
			console.log(data.errorCode);*/
		}
	});
		getBikes();
		$('.index_refresh').click(getBikes);

/*	    //地图中心点指针，事件回调函数
	    var callBackFn = function(e) {
	    	customMarker.setPosition(map.getCenter());
	    };
	    map.on('touchmove', callBackFn);
	    //移除地图的touchmove事件的监听
	    function removeListener() {
	        map.off('touchmove', callBackFn);
	    }*/
	   
	   
	    
		//将获得的车辆信息添加到地图上
		function getBikes(){
			$.ajax({
				type: "get",
				url: window.ROUT+"bicycle/available",
				data: {
					/*longitude:lng,
					dimension:lat*/
					longitude:'116.295',
					dimension:'40.048'
				},
				success: function(data){
					console.log(data);
					if(data.status==200 && data.success){
						var data=eval(data.data);
						var bikes=data;
						console.log(bikes);
						var markers=[];
						var len=bikes.length;
						
						for (var i = 0; i < len; i += 1) {						
	//						console.log([bikes[i].lastLongitude,bikes[i].lastDimension]);						
							(function(index){
								var icon = new AMap.Icon({
						            image : 'images/index_bike.png',
						            size : new AMap.Size(35,39.5)
						    	});
						    	var icon_cur = new AMap.Icon({
						            image : 'images/index_bike_cur.png',
						            size : new AMap.Size(35,39.5)
						    	});
								var marker = new AMap.Marker({
									icon:icon,
									position: [bikes[i].lastLongitude,bikes[i].lastDimension],
									offset : new AMap.Pixel(-17.5,-19.75),
									title: bikes[i].vehicleId,
									map: map
								});
								marker.on('click',function(){
									vehicleId=this.H.title;
									openInfo(index);
									walkRoutes(index);								
									$('.index_guide').show();
									map.on('click',function(){
										$('.index_guide').hide();
									})   
								})
								markers.push(marker);
							})(i);									
						};
						map.setFitView();
						
						function walkRoutes(index){
							//步行导航
						    var walking = new AMap.Walking({}); 
						    //根据起终点坐标规划步行路线
						    walking.search(curPosition,[bikes[index].lastLongitude,bikes[index].lastDimension],function(status, result){
						    	var routeS = result.routes;
						    	if (routeS.length <= 0) {
						            console.log('不可行');
						       }else{				           
						            for(var v =0; v< routeS.length;v++){
						                //步行导航路段数
						                var  steps = routeS[v].steps;
						                //步行距离（米）
						                var distance = routeS[v].distance;
						                //步行时间
						                var time = Math.floor(routeS[v].time/60);
						                //用车引导弹窗
										var popup = '<ul>'+
														'<li class="index_bikePos ft-32 fc-666 bd-b">'+curAddress+'</li>'+
														'<li class="bd-b fc-999">'+
															'<dl class="ft-26">'+
																'<dt>'+
																	'<ol class="dp-box dp-flex">'+
																		'<li class="dp-f-1"><span>1</span>辆</li>'+
																		'<li class="dp-f-1"><span>'+distance+'</span>米</li>'+
																		'<li class="dp-f-1"><span>'+time+'</span>分钟</li>'+
																	'</ol>'+
																'</dt>'+
																'<dd>'+
																	'<ol class="dp-box dp-flex">'+
																		'<li class="dp-f-1">可用自行车</li>'+
																		'<li class="dp-f-1">距离起始位置</li>'+
																		'<li class="dp-f-1">步行可到达</li>'+
																	'</ol>'+
																'</dd>'+
																'<dd class="index_orderBtn">'+
																	'<a href="javascript:;" class="bgc-ed6d2b ft-38">预约用车</a>'+
																'</dd>'+
															'</dl>'+
														'</li>'+
													'</ul>';
						                $('.index_guide').html(popup);
						                $('.index_orderBtn a').click(orderBike);
						            }
						            walkingDrawLine(index);
						        }
						    	
						    	//绘制步行导航路线
								function walkingDrawLine(index) {
									if(extra_line1!=null){
										extra_line1.setMap(null);
									}
									if(extra_line2!=null){
										extra_line2.setMap(null);
									}
									if(extra_line3!=null){
										extra_line3.setMap(null);
									}
								    //起点、终点图标
								    /*var sicon = new AMap.Icon({
								        image: "images/tripdetail_start.png",
								        size:new AMap.Size(44,44),
								        imageOffset: new AMap.Pixel(-334, -180)
								    });
								    var startmarker = new AMap.Marker({
								        icon : sicon, //复杂图标
								        visible : true,
								        position : curPosition,
								        map:map,
								        offset : {
								            x : -16,
								            y : -40
								        }
								    });
								    var eicon = new AMap.Icon({
								        image: "images/tripdetail_end.png",
								        size:new AMap.Size(44,44),
								        imageOffset: new AMap.Pixel(-334, -134)
								    });
								    var endmarker = new AMap.Marker({
								        icon : eicon, //复杂图标
								        visible : true,
								        position : [bikes[index].lastLongitude,bikes[index].lastDimension],
								        map:map,
								        offset : {
								            x : -16,
								            y : -40
								        }
								    });*/
								    //起点到路线的起点 路线的终点到终点 绘制无道路部分
								    var extra_path1 = new Array();
								    extra_path1.push(curPosition);
								    extra_path1.push(steps[0].path[0]);
								    extra_line1 = new AMap.Polyline({
								        map: map,
								        path: extra_path1,
								        strokeColor: "#5fab15",
								        strokeOpacity: 0.8,
								        strokeWeight: 7,
								        strokeStyle: "dashed",
								        strokeDasharray: [10, 5]
								    });							
								    var extra_path2 = new Array();
								    var path_xy = steps[(steps.length-1)].path;
								    extra_path2.push([bikes[index].lastLongitude,bikes[index].lastDimension]);
								    extra_path2.push(path_xy[(path_xy.length-1)]);
								    /*console.log("2~"+extra_path2.toString());*/
								    extra_line2 = new AMap.Polyline({
								        map: map,
								        path: extra_path2,
								        strokeColor: "#5fab15",
								        strokeOpacity: 0.8,
								        strokeWeight: 7,
								        strokeStyle: "dashed",
								        strokeBorder:"1px solid #559814",
								        strokeDasharray: [10, 5]
								    }); 
								 	var extra_path3 = new Array();
								    for(var s=0; s<steps.length; s++) {
								    	var array1 = steps[s].path.toString().split(',');
								    	for(var i=1;i<array1.length;){
								    		var arr = [parseFloat(array1[i-1]), parseFloat(array1[i])];
								    		i = i+2;
								    		extra_path3.push(arr);
								    	}
								    }
								    extra_line3 = new AMap.Polyline({
								            map: map,
								            path: extra_path3,
								            strokeColor: "#5fab15",
								            strokeOpacity: 0.8,
								            strokeWeight: 7
								    });
								    map.setFitView();
								};
								
						    });
						}
						
						//在指定位置打开信息窗体
					    function openInfo(i) {
					        //构建信息窗体中显示的内容
					        var title = '';
					        var content = [];
					    	content.push(
					    		'<div style="position:relative;top:0;width:3rem;height: 2.15625rem;border-radius: 2.5px;-webkit-box-shadow:0px 1.5px 3.5px rgba(0,0,0,0.2);box-shadow:0px 1.5px 3.5px rgba(0,0,0,0.2);">'+
								'<div class="index_thumbnail" style="z-index:2;position:absolute;left:0;top:0;width:3rem;height: 2.15625rem;'+
								'background:url(images/index_thumbnail.png) no-repeat #fff 0.125rem 0.125rem;'+
								'background-size:2.75rem 1.9375rem;"></div>'+
								'<span style="display:block;background:#fff;position:absolute;bottom:-0.15rem;left:50%;margin-left:-0.15rem;width:0.3125rem;height:0.3125rem;-webkit-box-shadow:0px 1.5px 3.5px rgba(0,0,0,0.2);box-shadow:0px 1.5px 3.5px rgba(0,0,0,0.2);transform: rotate(-45deg);"></span></div>'
							);
					        var infoWindow = new AMap.InfoWindow({
						        isCustom: true,  //使用自定义窗体
						        content: createInfoWindow(title, content.join("<br/>")),
						    });
					        infoWindow.open(map, [bikes[i].lastLongitude,bikes[i].lastDimension]);
				
					        
					        //构建自定义信息窗体
						    function createInfoWindow(title, content) {
						        var info = document.createElement("div");
						        info.className = "info";
								info.style.marginBottom = '1.5625rem';
								info.innerHTML = content
								info.onclick = function(){
									$('#mask').show();
									$('.index_bikeInfo').show();
									$('#mask').on('click',function(){
										$('.index_bikeInfo').hide();
										$(this).hide();
									});
									$('.index_feedback').on('click',function(){
										$('.index_bikeInfo').hide();
										$('#mask').hide();
									})
								};
						        return info;
						    }
						    //关闭信息窗体
						    function closeInfoWindow() {
						        map.clearInfoWindow();
						    }    
					    }
				
					};
					
				

				}
			});
	
		}

		function orderBike(){
			//预约用车
			var timestamp = Date.parse(new Date());
			timestamp = timestamp / 1000;
			var params = {};
			params.userId = $.getCookie('userId')||15;
			params.bicycleCode = vehicleId;
			params.beginAt = timestamp;
			//预约车辆
			$.ajax({
			    type: "post",
				url: window.ROUT+"bicycle/subscribe",
				contentType:'application/json',
				data: JSON.stringify(params),
				success: function(data){
					console.log(data);
					if(data.status==200 && data.success &&data.errorCode==0){
						var popup = '<div class="dp-flex dp-box" style="height:10rem;">'+
										'<ul class="index_orderList dp-f-1">'+
											'<li class="index_bikePos ft-32 fc-666 bd-b bgc-fff">'+curAddress+'</li>'+
											'<li class="bd-b fc-999 bgc-fff">'+
												'<dl class="ft-26">'+
													'<dt class="mg-l">自行车编号</dt>'+
													'<dd class="fc-666 ft-32 mg-l index_bikeNum">'+vehicleId+'</dd>'+
												'</dl>'+
											'</li>'+
											'<li class="ft-26 fc-666 index_booking">'+
												'<span class="ft-32 fc-ed6d2b mg-l">预约中</span>保留时间：<b>15:00</b>'+
											'</li>'+
										'</ul>'+
										'<ul class="index_bell">'+
											'<li class="index_findBike">'+
												'<span class="ft-26 fc-999">寻车铃</span>'+
											'</li>'+
											'<li class="index_cancel ft-26 bgc-ed6d2b">取消预约</li>'+
										'</ul>'+
									'</div>';
						countDown(900);
						$('.index_guide').html(popup);
						var min;
						function countDown(t){
							$(".index_booking b").text(t/60+':00');
							var s=60;
							min = setInterval(function () {
								t--;							
								s--;
								if(s==-1){
									s=59
								}
								if(s<10){
									s='0'+s;
								}
								var m=Math.floor(t/60);
								
								$(".index_booking b").text(m+':'+s);
								if (t == 0 && s==0) {
									clearInterval(min);
									$('.index_guide').html('');
								}
							},1000);
						}
						$('.index_cancel').on('click',function(){
							cancelBike();
							clearInterval(min);
						});
						$('.index_findBike').click(findBike);
					}
					if(data.status==200 && !data.success &&data.errorCode==1000){
						var orderFail = '<div class="border-box order-fail trans-vc bgc-fff">'+
											'<p class="ft-32 fc-66 lh-40">预约失败，重复预约</p>'+
										'</div>'
						$(document.body).append(orderFail);
						$('#mask').show();
						$('#mask').on('click',function(){
							$('.order-fail').remove();
							$(this).hide();
						})
					}
					if(data.errorCode==5014){
						var orderFail = '<div class="border-box order-fail trans-vc bgc-fff">'+
											'<p class="ft-32 fc-66 lh-40">预约失败，请您重新预约</p>'+
										'</div>'
						$(document.body).append(orderFail);
						$('#mask').show();
						$('#mask').on('click',function(){
							$('.order-fail').remove();
							$(this).hide();
						})
					}
				
				}
			});
		}
		function cancelBike(){
			var params = {};
			params.userId = $.getCookie('userId')||15;
			params.bicycleCode = vehicleId;
			//取消预约
			$.ajax({
			    type: "post",
				url: window.ROUT+"bicycle/cancle",
				contentType:'application/json',
				data: JSON.stringify(params),
				success: function(data){
					console.log(data);
					console.log(data.data);
					if(data.status==200 && data.success &&data.errorCode==0){
						var orderFail = '<div class="border-box order-fail trans-vc bgc-fff">'+
											'<p class="ft-32 fc-66 lh-40">取消预约成功</p>'+
										'</div>'
						$(document.body).append(orderFail);
						$('#mask').show();
						$('#mask').on('click',function(){
							$('.order-fail').remove();
							$(this).hide();
						})
						$('.index_guide').html('');
					}else{
						var orderFail = '<div class="border-box order-fail trans-vc bgc-fff">'+
											'<p class="ft-32 fc-66 lh-40">取消预约失败</p>'+
										'</div>'
						$(document.body).append(orderFail);
						$('#mask').show();
						$('#mask').on('click',function(){
							$('.order-fail').remove();
							$(this).hide();
						})
					}
					
				}
			});
		}
		
		function findBike(){
			//寻车
			$.ajax({
			    type: "get",
				url: window.ROUT+"bicycle/lookup",
				contentType:'application/json',
				data: {
					userId:$.getCookie('userId')||15,
					bicycleCode:vehicleId
				},
				success: function(data){
					console.log(data);
					console.log(data.data);
				}
			});
		}
		//GPS数据上报
		function sendData(){
			var timestamp = Date.parse(new Date());
			timestamp = timestamp / 1000;
			var params={};
			params.bicycleCode = vehicleId;			
			params.dimension = 40.049;
			params.longitude = 116.294;
			params.createAt = timestamp;
			$.ajax({
				type: "post",
				url: window.ROUT+"send",
				contentType:'application/json',
				data: JSON.stringify(params),
				success: function(data){
					console.log(data);
					console.log(1);
				}
			});
		}
	};

	//解析定位错误信息
	function onError(data) {
		console.log('error');
		/*var str = '<p>定位失败</p>';
	    str += '<p>错误信息：'
	    switch(data.info) {
	        case 'PERMISSION_DENIED':
	            str += '浏览器阻止了定位操作';
	            break;
	        case 'POSITION_UNAVAILBLE':
	            str += '无法获得当前位置';
	            break;
	        case 'TIMEOUT':
	            str += '定位超时';
	            break;
	        default:
	            str += '未知错误';
	            break;
	    }
	    str += '</p>';
	    result.innerHTML = str;*/
	}
	


	//去除高德图标链接
	$('.amap-logo').attr('href','javascript:;');
	$('.amap-logo').attr('target','_self');
	

});