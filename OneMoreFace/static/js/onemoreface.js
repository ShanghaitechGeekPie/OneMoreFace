/*
* @Author: eastpiger
* @Date:   2015-10-24 21:10:49
* @Last Modified by:   eastpiger
* @Last Modified time: 2015-10-25 02:06:53
*/

'use strict';

function Clmtrackr(){
}

function Clmtrackr_config(options){
	this.source = options.source ? options.source : undefined;
	this.id = options.id ? options.id : undefined;
	this.handle = options.handle ? options.handle : undefined;
}

function Clmtrackr_init(options){
	this.video = document.createElement("video");
	this.overlay = document.createElement("canvas");
	this.webgl = document.createElement("canvas");

	this.video.setAttribute('class','video')
	this.video.setAttribute('width','400')
	this.video.setAttribute('height','300')
	this.video.setAttribute('preload','auto');
	this.overlay.setAttribute('class','overlay')
	this.overlay.setAttribute('width','400')
	this.overlay.setAttribute('height','300');
	this.webgl.setAttribute('class','webgl')
	this.webgl.setAttribute('width','400')
	this.webgl.setAttribute('height','300');

	this.handle.appendChild(this.video);
	this.handle.appendChild(this.overlay);
	this.handle.appendChild(this.webgl);

	this.overlayCC = this.overlay.getContext('2d');
	this.ctrack = new clm.tracker();

	var source = this.source;
	var handle = this.handle;
	var video = this.video;
	var overlay = this.overlay;
	var webgl = this.webgl;
	var overlayCC = this.overlayCC;
	var ctrack = this.ctrack;

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
		video.play();
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

	var currentMask = 0;
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
		if (pn < 0.4) {
			switchMasks();
			requestAnimFrame(drawMaskLoop);
		} else {
			requestAnimFrame(drawGridLoop);
		}
	}

	this.drawGridLoop = drawGridLoop

	function switchMasks() {
		// get mask
		var maskname = Object.keys(masks)[currentMask];
		fd.load(document.getElementById(maskname), masks[maskname], pModel);
	}

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


function Clmtrackr_change(){
	currentMask = parseInt(el.target.value, 10);
	switchMasks();
}

function Clmtrackr_show() {
	// start video
	this.video.play();
	// start tracking
	this.ctrack.start(this.video);
	// start drawing face grid
	this.drawGridLoop();
}



Clmtrackr.prototype.config = Clmtrackr_config;
Clmtrackr.prototype.init = Clmtrackr_init;
Clmtrackr.prototype.destroy = Clmtrackr_destroy;
Clmtrackr.prototype.change = Clmtrackr_change;
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
			localStream.play("localMediaContainer");
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
		});

		session.on('session-message-received',function(stream_id,message){
		   alert(message);
		});

		// 连接房间
		session.connect();

	});

	localStream.init()
 })

function test(){
	// var users = session.remoteStreams;
	// for (var user in users) {
	//     session.sendMessageTo(user, {text:'Hello', timestamp:12321312});
	// }
	// alert(localStream.local)
	session.localStream.sendMessage({text:'Hello', timestamp:12321312});
for (var peer in session.remoteStreams) {
	session.sendMessageTo({text:'Hello', timestamp:12321312}, session.remoteStreams[peer].id);
}
}
