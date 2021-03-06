$(function() {
	//加载地图
	var map = new AMap.Map('container', {resizeEnable: true,center:[116.295,40.048],dragEnable: true});
	//调用浏览器定位服务
	map.plugin('AMap.Geolocation', function() {
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
		AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
		AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
	});
	//自定义定位标记
    var customMarker = new AMap.Marker({
        offset: new AMap.Pixel(-17, -36),//相对于基点的位置
        icon: new AMap.Icon({  //复杂图标
            size: new AMap.Size(36, 82),//图标大小
            image: "images/index_centralPos.png", //大图地址
            imageOffset: new AMap.Pixel(0, 0)//相对于大图的取图位置
        })
    });
	//地图中添加地图操作ToolBar插件
	var toolBar;
    map.plugin(["AMap.ToolBar"], function() {
        toolBar = new AMap.ToolBar({locationMarker: customMarker}); //设置地位标记为自定义标记
        map.addControl(toolBar);
    });

    onComplete();
    var curPosition=[],curAddress,vehicleId,bikes,markers=[];

	var extra_line1,extra_line2,extra_line3;	
	//解析定位结果
	function onComplete(data) {
		/*var lng=data.position.getLng();
		var lat=data.position.getLat();
		curPosition.push(lng);
		curPosition.push(lat);*/
		curPosition=[116.295,40.048];
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
	        map.setFitView();
		});
	    function geocoder_CallBack(data) {
	        curAddress = data.regeocode.formattedAddress; //返回地址描述
	    }
	    //当前位置marker
	    addIcon(curPosition);
		//添加地图中心点大头针
		toolBar.doLocation();	    
	    map.on('touchmove', callBackFn);	    
		checkStatus();		
	};
	
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
	//地图中心点事件回调函数
    var callBackFn = function(e){
    	customMarker.setPosition(map.getCenter());
    	console.log(customMarker.getPosition());
    };
    //移除地图的touchmove事件的监听
    function removeListener(){
        map.off('touchmove', callBackFn);
    }
    
	function checkStatus(){
		//判断用户使用状态
		$.ajax({
			type: "get",
			url: window.ROUT+"user/useInfo",
			data: {
				userId:$.getCookie('userId')||12
			},
			success: function(data){
				console.log(data);
				var evalData=eval('('+data.data+')');
				console.log(evalData);
				if(data.status==200 && data.success &&data.errorCode==0){
					//正在使用中的骑行订单-显示正在用车
					var popup = '<ul>'+
									'<li class="index_bikePos ft-32 fc-666 bd-b">'+'海淀区中关村软件园'+'</li>'+
									'<li class="bd-b fc-999">'+
										'<dl class="ft-26">'+
											'<dt>'+
												'<ol class="dp-box dp-flex">'+
													'<li class="dp-f-1"><span>10</span>分钟</li>'+
													'<li class="dp-f-1"><span>40</span>米</li>'+
													'<li class="dp-f-1"><span>2</span>大卡</li>'+
												'</ol>'+
											'</dt>'+
											'<dd>'+
												'<ol class="dp-box dp-flex">'+
													'<li class="dp-f-1">骑行时间</li>'+
													'<li class="dp-f-1">骑行距离</li>'+
													'<li class="dp-f-1">运动燃烧</li>'+
												'</ol>'+
											'</dd>'+
										'</dl>'+
									'</li>'+
									'<li class="index_using bgc-ed6d2b cl ft-26">'+
										'<div class="fl">正在用车 <b>'+evalData.vehicleOrderDto.vehicleId+'</b></div>'+
										'<div class="fr">预计费用 <b>1元</b></div>'+
									'</li>'+
								'</ul>';
	                $('.index_guide').html(popup).show();
	                $('.index_using').on('click',function(){
	                	var tip='<div class="index_popup index_lock">'+
		                			'<dl>'+
										'<dt class="fc-333 ft-32 pd-t">如何关锁</dt>'+
										'<dd class="ft-26 fc-666">关锁无须操作手机，只需手动将锁关闭合上锁环，即可完成还车，结束计费。</dd>'+
									'</dl>'+
								'</div>';
						$(document.body).append(tip);
						$('#mask').show();
						$('#mask').on('click',function(){
							$('.index_popup').remove();
							$(this).hide();
						})
	                })
	                map.clearMap();
	                
				}else if(data.status==200 && data.success &&data.errorCode==1){
					//未过期的预约信息-显示预约中
					var popup = '<div class="dp-flex dp-box" style="height:10rem;">'+
									'<ul class="index_orderList dp-f-1">'+
										'<li class="index_bikePos ft-32 fc-666 bd-b bgc-fff">'+curAddress+'</li>'+
										'<li class="bd-b fc-999 bgc-fff">'+
											'<dl class="ft-26">'+
												'<dt class="mg-l">自行车编号</dt>'+
												'<dd class="fc-666 ft-32 mg-l index_bikeNum">'+evalData.info.vehicleId+'</dd>'+
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
					$('.index_guide').html(popup);
					var timestamp = Date.parse(new Date());
					timestamp = timestamp / 1000;
					orderCountDown(evalData.info.endAt-timestamp);
					$('.index_cancel').on('click',function(){
						var tip='<div class="border-box cancelbike-tip-msg trans-vc bgc-fff">'+
									'<p class="ft-32 fc-66 lh-40">您确定取消预约吗？</p>'+
									'<div class="cancelbike-tip-btns cl text-c">'+
										'<span class="fl cancelbike-tip-cancel">取消</span>'+
										'<span class="fr cancelbike-tip-confirm">确定</span>'+
									'</div>'+
								'</div>';
						$(document.body).append(tip);
						$('#mask').show();
						$('.cancelbike-tip-confirm').on('click',function(){
							cancelBike();
							$('.cancelbike-tip-msg').remove();
							getBikes(curPosition);
						});
						$('.cancelbike-tip-cancel').on('click',function(){
							$('#mask').hide();
							$('.cancelbike-tip-msg').remove();
						})
					});
					$('.index_findBike').click(findBike);
				}else if(data.status==200 && data.success &&data.errorCode==4){
					//骑行已结束未付款的订单-跳去自动扣款
					console.log('您还有未付款的订单，支付后才可继续用车');
				}else if(data.status==200 && data.success &&data.errorCode==2){
					getBikes(curPosition);
				}
			}
		});	
	}
	//将获得的车辆信息添加到地图上
	function getBikes(pos){
		$.ajax({
			type: "get",
			url: window.ROUT+"bicycle/available",
			data: {
				/*longitude:pos[0],
				dimension:pos[1]*/
				longitude:'116.295',
				dimension:'40.048'
			},
			success: function(data){
				if(data.status==200 && data.success){
					var evalData=eval(data.data);
					bikes=evalData;
					var len=bikes.length;						
					for (var i = 0; i < len; i += 1) {						
						(function(index){
							var icon = new AMap.Icon({
					            image : 'images/index_bike.png',
					            size : new AMap.Size(35,39.5)
					    	});
							var marker = new AMap.Marker({
								icon:icon,
								position: [bikes[i].lastLongitude,bikes[i].lastDimension],
								offset : new AMap.Pixel(-17.5,-19.75),
								title: bikes[i].vehicleId,
								map: map
							});
							markers.push(marker);
							marker.on('click',function(){
								for(j=0;j<markers.length;j++){
									markers[j].setIcon('images/index_bike.png');
								};
								this.setIcon('images/index_bike_cur.png');
								vehicleId=this.H.title;
								openInfo(index);
								walkRoutes(customMarker.getPosition(),index,markers);
								removeListener();
								$('.index_guide').show();
								map.on('click',function(){
									$('.index_guide').hide();
									if(extra_line1!=null){
										extra_line1.setMap(null);
									}
									if(extra_line2!=null){
										extra_line2.setMap(null);
									}
									if(extra_line3!=null){
										extra_line3.setMap(null);
									}
									for(j=0;j<markers.length;j++){
										markers[j].setIcon('images/index_bike.png');
									};
									closeInfoWindow();
									map.on('touchmove', callBackFn);
								})   
							})
							
						})(i);									
					};
					map.setFitView();
				}
			}
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
    }
    //关闭信息窗体
    function closeInfoWindow() {
        map.clearInfoWindow();
    } 
	//预约车辆步行路线
	function walkRoutes(pos,index,markers){
	    var walking = new AMap.Walking({}); 
	    //根据起终点坐标规划步行路线
	    walking.search(pos,[bikes[index].lastLongitude,bikes[index].lastDimension],function(status, result){
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
	                $('.index_orderBtn a').on('click',function(){
	                	orderBike();
	                	removeListener();
	                	for(j=0;j<markers.length;j++){
							markers[j].hide();
						};
	                	markers[index].show();
	                });
	            }
	            walkingDrawLine(pos,steps,index);
			}
	    });
	}
	//绘制步行导航路线
	function walkingDrawLine(pos,steps,index) {
		if(extra_line1!=null){
			extra_line1.setMap(null);
		}
		if(extra_line2!=null){
			extra_line2.setMap(null);
		}
		if(extra_line3!=null){
			extra_line3.setMap(null);
		}
	    //起点到路线的起点 路线的终点到终点 绘制无道路部分
	    var extra_path1 = new Array();
	    extra_path1.push(pos);
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
	    map.setZoomAndCenter(16, pos);
	};
	
	function orderBike(){
		//预约用车
		var timestamp = Date.parse(new Date());
		timestamp = timestamp / 1000;
		var params = {};
		params.userId = $.getCookie('userId')||12;
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
				var evalData=eval('('+data.data+')');
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
					$('.index_guide').html(popup);
					orderCountDown(evalData.endAt-evalData.startAt);
					$('.index_cancel').on('click',function(){
						var tip='<div class="border-box cancelbike-tip-msg trans-vc bgc-fff">'+
									'<p class="ft-32 fc-66 lh-40">您确定取消预约吗？</p>'+
									'<div class="cancelbike-tip-btns cl text-c">'+
										'<span class="fl cancelbike-tip-cancel">取消</span>'+
										'<span class="fr cancelbike-tip-confirm">确定</span>'+
									'</div>'+
								'</div>';
						$(document.body).append(tip);
						$('#mask').show();
						$('.cancelbike-tip-confirm').on('click',function(){
							cancelBike();
							$('.cancelbike-tip-msg').remove();
							/*getBikes();*/
							map.on('touchmove', callBackFn);
						});
						$('.cancelbike-tip-cancel').on('click',function(){
							$('#mask').hide();
							$('.cancelbike-tip-msg').remove();
						})
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
	function orderCountDown(t){
		if (t < 1) {
            return;
        }
        var seconds = t ;
        var min = setInterval(function(){
            seconds -= 1;
            if (seconds == 0) {
                clearInterval(min);
                $('.index_guide').html('');            
                getBikes();
            }
            var minute = Math.floor(seconds / 60);
            var second = Math.floor(seconds - minute * 60);
            if(second<10){second="0"+second}
            $(".index_booking b").text(minute+':'+second);
        }, 1000);
	}
	function cancelBike(){
		var params = {};
		params.userId = $.getCookie('userId')||12;
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
					var cancelTip = '<div class="border-box order-fail trans-vc bgc-fff">'+
										'<p class="ft-32 fc-66 lh-40">取消预约成功</p>'+
									'</div>'
					$(document.body).append(cancelTip);
					$('#mask').show();
					$('#mask').on('click',function(){
						$('.order-fail').remove();
						$(this).hide();
						if(extra_line1!=null){
							extra_line1.setMap(null);
						}
						if(extra_line2!=null){
							extra_line2.setMap(null);
						}
						if(extra_line3!=null){
							extra_line3.setMap(null);
						}
						for(j=0;j<markers.length;j++){
							markers[j].setIcon('images/index_bike.png');
							markers[j].show();
						};
						closeInfoWindow();
					})
					$('.index_guide').html('');
				}else{
					var cancelTip = '<div class="border-box order-fail trans-vc bgc-fff">'+
										'<p class="ft-32 fc-66 lh-40">取消预约失败</p>'+
									'</div>'
					$(document.body).append(cancelTip);
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
				userId:$.getCookie('userId')||12,
				bicycleCode:vehicleId
			},
			success: function(data){
				console.log(data);
				console.log(data.data);
				if(data.status==200 && data.success){
					var findTip = '<div class="border-box order-fail trans-vc bgc-fff">'+
										'<p class="ft-32 fc-66 lh-40">'+data.data+'</p>'+
									'</div>'
					$(document.body).append(findTip);
					$('#mask').show();
					$('#mask').on('click',function(){
						$('.order-fail').remove();
						$(this).hide();
					})
				}
			}
		});
	}
	$('.index_refresh').on('click',function(){
		map.clearMap();
		$('.index_guide').html('');
		addIcon(curPosition);
		toolBar.doLocation();
		map.on('touchmove', callBackFn);
		getBikes(map.getCenter());
	});
	$('.amap-geolocation-con .amap-geo').on('click',function(){
		map.clearMap();
		$('.index_guide').html('');
		addIcon(curPosition);
		customMarker.setPosition(curPosition);
		getBikes(curPosition);
	})
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