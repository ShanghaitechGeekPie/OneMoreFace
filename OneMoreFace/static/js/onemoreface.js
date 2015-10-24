/*
* @Author: eastpiger
* @Date:   2015-10-24 21:10:49
* @Last Modified by:   eastpiger
* @Last Modified time: 2015-10-25 07:01:20
*/

'use strict';

function Clmtrackr(){
}

function Clmtrackr_config(options){
	this.scale = options.scale ? options.scale : false;
	this.source = options.source ? options.source : undefined;
	this.id = options.id ? options.id : undefined;
	this.handle = options.handle ? options.handle : undefined;
	this.currentMask = options.currentMask ? options.currentMask : 0;
}

function Clmtrackr_init(options){
	this.video = document.createElement("video");
	this.overlay = document.createElement("canvas");
	this.webgl = document.createElement("canvas");

	this.video.setAttribute('class','video');
	this.video.setAttribute('width',this.scale ? (this.scale == 1) ? '400' : "280" : '120');
	this.video.setAttribute('height',this.scale ? (this.scale == 1) ? '300' : "210" : '90');
	this.video.setAttribute('preload','auto');
	this.overlay.setAttribute('class','overlay');
	this.overlay.setAttribute('width',this.scale ? (this.scale == 1) ? '400' : "280" : '120');
	this.overlay.setAttribute('height',this.scale ? (this.scale == 1) ? '300' : "210" : '90');
	this.webgl.setAttribute('class','webgl');
	this.webgl.setAttribute('width',this.scale ? (this.scale == 1) ? '400' : "280" : '120');
	this.webgl.setAttribute('height',this.scale ? (this.scale == 1) ? '300' : "210" : '90');

	this.handle.appendChild(this.video);
	this.handle.appendChild(this.overlay);
	this.handle.appendChild(this.webgl);

	this.overlayCC = this.overlay.getContext('2d');
	this.ctrack = new clm.tracker();

	if (!this.scale) {
		var temp = document.createElement("div");
		temp.setAttribute('class','mask-question');
		temp.innerHTML ='?';
		this.handle.appendChild(temp);
		this.handle.setAttribute('onclick','changeView("' + this.id + '")');
	}

	var source = this.source;
	var handle = this.handle;
	var video = this.video;
	var overlay = this.overlay;
	var webgl = this.webgl;
	var overlayCC = this.overlayCC;
	var ctrack = this.ctrack;
	var currentMask = this.currentMask;

	ctrack.init(pModel);

	// check whether browser supports webGL
	var webGLContext;
	var webGLTestCanvas = document.createElement('canvas');
	if (window.WebGLRenderingContext) {
		webGLContext = webGLTestCanvas.getContext('webgl') || webGLTestCanvas.getContext('experimental-webgl');
		if (!webGLContext || !webGLContext.getExtension('OES_texture_float')) {
			webGLContext = null;
		}
	}
	if (webGLContext == null) {
		alert("Your browser does not seem to support WebGL. Unfortunately this face mask example depends on WebGL, so you'll have to try it in another browser. :(");
	}

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

	// check for camerasupport
	if (navigator.getUserMedia) {
		// set up stream

		// chrome 19 shim
		var videoSelector = {video : true};
		if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
			var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
			if (chromeVersion < 20) {
				videoSelector = "video";
			}
		};

		video.mozSrcObject = source;
		if (video.mozCaptureStream) {
			video.mozSrcObject = source;
		} else {
			video.src = (window.URL && window.URL.createObjectURL(source)) || source;
		}
	// video.play();
	//     navigator.getUserMedia(videoSelector, function( stream ) {
	//             video.mozSrcObject = source;
				// if (video.mozCaptureStream) {
				//                    video.mozSrcObject = source;
				//                } else {
	//             video.src = (window.URL && window.URL.createObjectURL(source)) || source;
	//            }
	//         video.play();
	//     }, function() {
	//         insertAltVideo(video);
	//         document.getElementById('gum').className = "hide";
	//         document.getElementById('nogum').className = "nohide";
	//         alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
	//     });
	} else {
		insertAltVideo(video)
		document.getElementById('gum').className = "hide";
		document.getElementById('nogum').className = "nohide";
		alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
	}

	var positions;
	var fd = new faceDeformer();
	fd.init(webgl);

	var animationRequest;

	function drawGridLoop() {
		// get position of face
		positions = ctrack.getCurrentPosition(video);
		overlayCC.clearRect(0, 0, 500, 375);
		if (positions) {
			// draw current grid
			ctrack.draw(overlay);
		}
		// check whether mask has converged
		var pn = ctrack.getConvergence();
		switchMasks();
		requestAnimFrame(drawMaskLoop);
		// if (pn < 0.4) {
		// 	switchMasks();
		// 	requestAnimFrame(drawMaskLoop);
		// } else {
		// 	requestAnimFrame(drawGridLoop);
		// }
	}

	var _this = this
	function switchMasks() {
		// get mask
		var maskname = Object.keys(masks)[_this.currentMask];
		fd.load(document.getElementById(maskname), masks[maskname], pModel);
	}

	this.drawGridLoop = drawGridLoop;
	this.switchMasks = switchMasks;

	function drawMaskLoop() {
		// get position of face
		positions = ctrack.getCurrentPosition();
		overlayCC.clearRect(0, 0, 400, 300);
		if (positions) {
			// draw mask on top of face
			fd.draw(positions);
		}
		animationRequest = requestAnimFrame(drawMaskLoop);
	}

	document.addEventListener("clmtrackrIteration", function(event) {
		stats.update();
	}, false);

}

function Clmtrackr_destroy(){
	this.object = null;
	this.handle.parentNode.removeChild(this.handle);
}

function Clmtrackr_changemask(value){
	this.currentMask = parseInt(value, 10);
	this.switchMasks();
}

function Clmtrackr_show(showctrack){
	// start video
	this.video.play();
	if (showctrack){
		// start tracking
		this.ctrack.start(this.video);
		// start drawing face grid
		this.drawGridLoop();
	}
}

Clmtrackr.prototype.config = Clmtrackr_config;
Clmtrackr.prototype.init = Clmtrackr_init;
Clmtrackr.prototype.destroy = Clmtrackr_destroy;
Clmtrackr.prototype.changemask = Clmtrackr_changemask;
Clmtrackr.prototype.show = Clmtrackr_show;

var session,localStream
var clmtrackrarray = {};
$(document).ready(function(){

	// 声明session变量
	// var session;
	// 创建本地视频流
	var config = {audio: true, video: true, data: true};
	localStream = new RTCat.Stream(config);
	// 获取远程视频流播放器位置
	var remoteVideo = $('#remoteMediaContainer');

	// 使用token新建会话，请将此处的Token替换为
	// 从http://dashboard.shishimao.com/生成的Token
	session = new RTCat.Session(token);

	// token验证正确
	localStream.on("access-accepted", function () {
		// 正确建立连接，进入房间
		session.on('session-connected', function (streams) {
			// 显示自己的视频
			// localStream.play("localMediaContainer");
			var clmtrackr = new Clmtrackr();

			clmtrackrarray[0] = clmtrackr;

			var temp = document.createElement("div");
			temp.setAttribute('class','container container-myself');

			document.getElementById('localMediaContainer').appendChild(temp);

			clmtrackr.config({
				source: localStream.stream,
				handle: temp,
				id: 0,
				scale: 2
			})
			clmtrackr.init();
			clmtrackr.show(true);
			// 发布视频流
			session.publish(localStream);
			for (var stream in streams) {
				// 订阅视频流
				session.subscribe(streams[stream]);
			}
		});

		// 当别的用户加入时，订阅他的视频流
		session.on('stream-added', function (stream) {
			session.subscribe(stream)
		});

		// 当别的用户退出时，移除他的视频流
		session.on('stream-removed', function (stream) {
			// 移除视频
			clmtrackrarray[stream].destroy();
		});

		// 成功订阅他人的视频流，在页面中创建一个播放容器并播放
		session.on('stream-subscribed', function (stream) {
			var clmtrackr = new Clmtrackr();

			clmtrackrarray[stream.id] = clmtrackr;

			var temp = document.createElement("div");
			temp.setAttribute('class','container');

			document.getElementById('container').appendChild(temp);

			clmtrackr.config({
				source: stream.stream,
				handle: temp,
				id: stream.id
			})
			clmtrackr.init();
			clmtrackr.show();
			// clmtrackr.video.play();
		});

		session.on('session-message-received',function(stream_id,message){
			// alert(message);
			if (message.type == "msg")
				$("#msgbox").append('<p>'+message.msg+'<p>')
			else if (message.type == "mask"){
				clmtrackrarray[stream_id].changemask(message.mask);
				if (clmtrackrarray['view'] && (clmtrackrarray['view'].id == stream_id)){
					clmtrackrarray['view'].changemask(message.mask);
				}
			}
		});

		// 连接房间
		session.connect();

	});

	localStream.init()
 })

function changeView(id){
	if (clmtrackrarray['view']){
		clmtrackrarray['view'].destroy();

	}
	var clmtrackr = new Clmtrackr();

	clmtrackrarray['view'] = clmtrackr;

	var temp = document.createElement("div");
	temp.setAttribute('class','container container-view');

	document.getElementById('container-view').appendChild(temp);
	clmtrackr.config({
		source: clmtrackrarray[id].source,
		handle: temp,
		id: clmtrackrarray[id].id,
		scale: 1,
		currentMask: clmtrackrarray[id].currentMask
	})
	clmtrackr.init();
	clmtrackr.show(true);
	// clmtrackr.video.play();
}

function sendmsg(message){
	// session.localStream.sendMessage(message);
	$("#msgbox").append('<p>' + "[Myself]：" + message + '<p>')
	for (var peer in session.remoteStreams) {
		session.sendMessageTo({"type": "msg","msg": "[" + document.getElementById("name").value + "]：" + message}, session.remoteStreams[peer].id);
	}
}

function changemask(){
	for (var peer in session.remoteStreams) {
		session.sendMessageTo({"type": "mask","mask": document.getElementById("selectmask").value}, session.remoteStreams[peer].id);
	}
	clmtrackrarray[0].changemask(document.getElementById("selectmask").value)
	// alert(document.getElementById("selectmask").value)
}


$(function(){
	$(".logo").addClass("active")
	setTimeout(function(){
		$(".logo").removeClass("active")
	},2000);
	setTimeout(function(){
		$("body").removeClass("init")
	},2500);
})
