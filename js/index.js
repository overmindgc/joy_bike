$(function() {
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

	//加载地图，调用浏览器定位服务
	var map = new AMap.Map('container', {
		resizeEnable: true,
		dragEnable: true
	});
	
	//地图中添加地图操作ToolBar插件
    map.plugin(["AMap.ToolBar"], function() {
        toolBar = new AMap.ToolBar({locationMarker: customMarker}); //设置地位标记为自定义标记
        map.addControl(toolBar);
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
			showMarker: false,	 //定位成功后在定位到的位置显示点标记，默认：true
			showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
			buttonPosition: 'RB'
		});
		map.addControl(geolocation);
		geolocation.getCurrentPosition();
		AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
		AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
	});

    
	
	//解析定位结果
	function onComplete(data) {
		
		var curPosition=[];
		curPosition.push(data.position.getLng());
		curPosition.push(data.position.getLat());
		addIcon(curPosition);
		//地图上车辆Marker地理位置信息
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
		}
		/*, {
			"name": "好日子生活超市",
			"center": "116.375636,40.091632",
			"type": 1,
			"subDistricts": []
		}
		, {
			"name": "重庆小面",
			"center": "116.375132,40.091817",
			"type": 1,
			"subDistricts": []
		}
		, {
			"name": "美廉超市",
			"center": "116.375684,40.091164",
			"type": 1,
			"subDistricts": []
		}, {
			"name": "当前位置",
			"center": curPosition.join(','),
			"type": 1,
			"subDistricts": []
		}*/];
		toolBar.doLocation();
		getBikes();
		$('.index_refresh').click(getBikes);
		map.setFitView();
		
		//添加点标记，并使用自己的icon
		function addIcon(pos){				
		    new AMap.Marker({
		        map: map,
				position: pos,
		        icon: new AMap.Icon({            
		            size: new AMap.Size(70, 79),  //图标大小
		            image: "images/index_point.png",
		            imageOffset: new AMap.Pixel(-8, 14)
		        })        
		    });
		}
	    //地图中心点指针，事件回调函数
	    var callBackFn = function(e) {
	    	customMarker.setPosition(map.getCenter());
	    };
	    map.on('touchmove', callBackFn);
	    //移除地图的touchmove事件的监听
	    function removeListener() {
	        map.off('touchmove', callBackFn);
	    }
	    
		//将获得的车辆信息添加到地图上
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
						icon:icon,
						position: bikes[i].center.split(','),
						offset : new AMap.Pixel(-17.5,-19.75),
						title: bikes[i].name,
						map: map
					});
					marker.on('click',function(){
						openInfo(index);
						$('.index_guide').show();
						map.on('click',function(){
							$('.index_guide').hide();
						})
						walkRoutes(index);
					    
					})
					markers.push(marker);
				})(i);				
			};
			function walkRoutes(index){
//				walking.clear();
//				walking.setMap(null);
				//map.clearMap();
				//步行导航
			    var walking = new AMap.Walking({}); 
			    //根据起终点坐标规划步行路线
			    walking.search(curPosition,bikes[index].center.split(','),function(status, result){
			    	var routeS = result.routes;
			    	if (routeS.length <= 0) {
			            console.log('不可行');
			        }else{
			            var route_text="";
			            for(var v =0; v< routeS.length;v++){
			                //步行导航路段数
			                var  steps = routeS[v].steps;
			                var route_count = steps.length;
			                //步行距离（米）
			                var distance = routeS[v].distance;
			                //拼接输出html
			                for(var i=0 ;i< steps.length;i++) {
			                    route_text += "<tr><td align=\"left\" onMouseover=\"walkingDrawSeg('" + i + "')\">" + i +"." +steps[i].instruction  + "</td></tr>";
			                }
			            }
			            //输出步行路线指示
			            route_text = "<table cellspacing=\"5 px\" ><tr><td style=\"background:#e1e1e1;\">路线</td></tr><tr><td></td></tr>" + route_text + "<tr><td></td></tr></table>";
			            document.getElementById("result").innerHTML = route_text;
			            walkingDrawLine(index);
			        }
			    	
			    	//绘制步行导航路线
					function walkingDrawLine(index) {
					    //起点、终点图标
					    var sicon = new AMap.Icon({
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
					        position : bikes[index].center.split(','),
					        map:map,
					        offset : {
					            x : -16,
					            y : -40
					        }
					    });
					    //起点到路线的起点 路线的终点到终点 绘制无道路部分
					    var extra_path1 = new Array();
					    extra_path1.push(curPosition);
					    extra_path1.push(steps[0].path[0]);
					    var extra_line1 = new AMap.Polyline({
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
					    extra_path2.push(bikes[index].center.split(','));
					    extra_path2.push(path_xy[(path_xy.length-1)]);
					    console.log("2~"+extra_path2.toString());
					    var extra_line2 = new AMap.Polyline({
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
					    		i = i*2+1;
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
					        
					        
//					    for(var s=0; s<steps.length; s++) {
//					        var drawpath = steps[s].path;
//					        var polyline = new AMap.Polyline({
//					            map: map,
//					            path: drawpath,
//					            strokeColor: "#f00",
//					            strokeOpacity: 0.8,
//					            strokeWeight: 7
//					        });
//					    }
					    map.setFitView()
					};
					
			    	/*console.log(result);
			    	console.log(result.routes[0].steps[0]);
			    	console.log(result.routes[0].steps[0].path);
			    	var path=result.routes[0].steps[0].path;
			    	path.unshift(result.routes[0].steps[0].start_location);
			    	path.push(result.routes[0].steps[0].end_location);
			    	console.log(path);
			    	var lineArr = [
			    		curPosition,
			    		bikes[index].center.split(',')
					];
			    	var polyline = new AMap.Polyline({
						path: path, //设置线覆盖物路径        
						strokeColor: "#80cb38", //线颜色        
						strokeOpacity: 2,       //线透明度        
						strokeWeight: 5,        //线宽        
						strokeStyle: "solid",   //线样式        
						strokeDasharray: [10, 5] //补充线样式    
					});
					polyline.setMap(map);*/
					
			    });
			}
			
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
	        infoWindow.open(map, bikes[i].center.split(','));

	        
	        //构建自定义信息窗体
		    function createInfoWindow(title, content) {
		        var info = document.createElement("div");
		        info.className = "info";
				info.style.paddingBottom = '1.5625rem';
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

	//解析定位错误信息
	function onError(data) {
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