/*
* @Author: eastpiger
* @Date:   2015-10-24 21:10:49
* @Last Modified by:   eastpiger
* @Last Modified time: 2015-10-24 21:47:21
*/

'use strict';

function Clmtrackr(options){
	this.source = undefined;
	this.id = undefined;
	this.handle = undefined;
}

function Clmtrackr_init(options){
	this.handle.attr('id','Clmtrackr' + this.id);
	this.handle.html('' +
		'<video id="videoel" width="400" height="300" preload="auto"></video>' +
		'<canvas id="overlay" width="400" height="300"></canvas>' +
		'<canvas id="webgl" width="400" height="300"></canvas>');

    var ctrack = new clm.tracker();
    ctrack.init(pModel);

                function enablestart() {
                    var startbutton = document.getElementById('startbutton');
                    startbutton.value = "start";
                    startbutton.disabled = null;
                }

                var insertAltVideo = function(video) {

                    if (supports_video()) {
                        if (supports_ogg_theora_video()) {
                            video.src = "./media/cap13_edit2.ogv";
                        } else if (supports_h264_baseline_video()) {
                            video.src = "./media/cap13_edit2.mp4";
                        } else {
                            return false;
                        }
                        //video.play();
                        return true;
                    } else return false;
                }

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

                    navigator.getUserMedia(videoSelector, function( stream ) {
                        if (vid.mozCaptureStream) {
                            vid.mozSrcObject = stream;
                        } else {
                            vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
                        }
                        vid.play();
                    }, function() {
                        insertAltVideo(vid);
                        document.getElementById('gum').className = "hide";
                        document.getElementById('nogum').className = "nohide";
                        alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
                    });
                } else {
                    insertAltVideo(vid)
                    document.getElementById('gum').className = "hide";
                    document.getElementById('nogum').className = "nohide";
                    alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
                }

                vid.addEventListener('canplay', enablestart, false);

                document.getElementById('selectmask').addEventListener('change', updateMask, false);

                function updateMask(el) {
                    currentMask = parseInt(el.target.value, 10);
                    switchMasks();
                }

                function startVideo() {


                            vid.mozSrcObject = tttt;
         // if (vid.mozCaptureStream) {
         //                    vid.mozSrcObject = tttt;
         //                } else {
                            vid.src = (window.URL && window.URL.createObjectURL(tttt)) || tttt;
         //                }
                        vid.play();


                    // start video
                    vid.play();
                    // start tracking
                    ctrack.start(vid);
                    // start drawing face grid
                    drawGridLoop();
                }

                var positions;
                var fd = new faceDeformer();
                fd.init(document.getElementById('webgl'));







                var currentMask = 0;
                var animationRequest;

                function drawGridLoop() {
                    // get position of face
                    positions = ctrack.getCurrentPosition(vid);
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

function Clmtrackr_destroy(options){
	this.source = undefined;
	this.id = undefined;
	this.handle = undefined;
}


function Clmtrackr_change(options){
	this.source = undefined;
	this.id = undefined;
	this.handle = undefined;
}



Clmtrackr.prototype.init = Clmtrackr_init;
Clmtrackr.prototype.destroy = Clmtrackr_destroy;
Clmtrackr.prototype.change = Clmtrackr_change;

var clmtrackr = new Clmtrackr();

$(function(){
	var t = new mauna.datatable('id','title','content');
	t.init();
	t.show();
})

(function(){
  function MaunaDialog(options){
	this.options = {
	  id: "MaunaDialog" + Date.parse(new Date()),
	  title: "title",
	  content: "content",
	  foot: [],
	  backdrop: "static",
	  keyboard: false,
	  closeable: true,
	  callback: undefined,
	  parent: true,
	};
	if (options) this.set(options);
	this.Object = undefined;
  }

  function MaunaDialog_set(options){
	this.options = {
	  id: (options.id != undefined)?options.id:this.options.id,
	  title: (options.title != undefined)?options.title:this.options.title,
	  content: (options.content != undefined)?options.content:this.options.content,
	  foot: (options.foot != undefined)?options.foot:this.options.foot,
	  backdrop: (options.backdrop != undefined)?options.backdrop:this.options.backdrop,
	  keyboard: (options.keyboard != undefined)?options.keyboard:this.options.keyboard,
	  closeable: (options.closeable != undefined)?options.closeable:this.options.closeable,
	  callback: (options.callback != undefined)?options.callback:this.options.callback,
	  parent: (options.parent != undefined)?options.parent:this.options.parent,
	};
	for (var i=0;i<this.options.foot.length;i++)
	{
	  this.options.foot[i] = {
		caption: this.options.foot[i].caption?this.options.foot[i].caption:"Button",
		style: this.options.foot[i].style?this.options.foot[i].style:"default",
		callbackkey: this.options.foot[i].callbackkey?this.options.foot[i].callbackkey:"button",
		closeable: this.options.foot[i].closeable?this.options.foot[i].closeable:false,
	  };
	};
  }

  function MaunaDialog_init(){
	if (this.Object) this.destroy();
	if (this.options.parent){
	  $("body", window.parent.document).append("<div id=\"" + this.options.id + "\" class=\"modal fade\"></div>");
	  this.Object = $("#" + this.options.id, window.parent.document);
	}else{
	  $("body").append("<div id=\"" + this.options.id + "\" class=\"modal fade\"></div>")
	  this.Object = $("#" + this.options.id);
	};
	this.Object.append("<div class=\"modal-dialog\"></div>");
	this.Object.find(".modal-dialog")
	  .append("<div class=\"modal-content\"></div>");

	this.Object.find(".modal-content")
	  .append("<div class=\"modal-header\"></div>");
	if (this.options.closeable)
	  this.Object.find(".modal-header")
		.append("<button class=\"close\" type=\"button\" data-dismiss=\"modal\" callbackkey=\"close\"></button>")
		.find("button")
		  .append("<span>&times;</span>");
	this.Object.find(".modal-header")
	  .append("<h4>" + this.options.title + "</h4>");

	this.Object.find(".modal-content")
	  .append("<div class=\"modal-body\">" + this.options.content + "</div>");

	this.Object.find(".modal-content")
	  .append("<div class=\"modal-footer\"></div>");
	for (i in this.options.foot){
	  this.Object.find(".modal-footer")
		.append("<button class=\"btn " + "btn-" + this.options.foot[i].style + "\" type=\"button\" callbackkey=\"" + this.options.foot[i].callbackkey + "\" " + (this.options.foot[i].closeable?"data-dismiss=\"modal\"":"") + ">" + this.options.foot[i].caption + "</button>");
	}
	if (this.options.callback){
	  callback=this.options.callback;
	  this.Object.find(".modal-footer button,.modal-header button")
		.click(function(){callback($(this).attr("callbackkey"))});
	}
	this.Object.modal({
		backdrop: this.options.backdrop,
		keyboard: this.options.keyboard,
	});
  }

  function MaunaDialog_destroy(){
	if (this.Object) this.Object.remove();
  }

  function MaunaDialog_show(){
	this.Object.modal("show");
	if (this.options.parent){
	  $(".modal-backdrop.fade.in").appendTo($("body", window.parent.document));
	};
  }

  function MaunaDialog_hide(){
	this.Object.modal("hide");
  }

  MaunaDialog.prototype.set = MaunaDialog_set;
  MaunaDialog.prototype.init = MaunaDialog_init;
  MaunaDialog.prototype.destroy = MaunaDialog_show;
  MaunaDialog.prototype.show = MaunaDialog_show;
  MaunaDialog.prototype.hide = MaunaDialog_hide;

  Mauna.prototype.dialog = MaunaDialog;

  function MaunaDialogMsg(options){
	this.options = {
	  foot: [
		{
		  caption: "OK",
		  style: "primary",
		  callbackkey: "ok",
		  closeable: true,
		},
	  ],
	  keyboard: true,
	};
	  Mauna.prototype.dialog.call(this, this.options);
	if (options) this.set(options);
  }

  MaunaDialogMsg.prototype = new Mauna.prototype.dialog();

  Mauna.prototype.dialog_msg = MaunaDialogMsg;

  function MaunaDialogBoolean(options){
	this.options = {
	  foot: [
		{
		  caption: "No",
		  style: "default",
		  callbackkey: "no",
		},
		{
		  caption: "Yes",
		  style: "primary",
		  callbackkey: "yes",
		},
	  ],
	  closeable: false,
	};
	  Mauna.prototype.dialog.call(this, this.options);
	if (options) this.set(options);
  }

  MaunaDialogBoolean.prototype = new Mauna.prototype.dialog();

  Mauna.prototype.dialog_boolean = MaunaDialogBoolean;

  function MaunaDialogBooleannull(options){
	this.options = {
	  foot: [
		{
		  caption: "Cancel",
		  style: "default",
		  callbackkey: "cancel",
		},
		{
		  caption: "No",
		  style: "default",
		  callbackkey: "no",
		},
		{
		  caption: "Yes",
		  style: "primary",
		  callbackkey: "yes",
		},
	  ],
	  closeable: false,
	};
	  Mauna.prototype.dialog.call(this, this.options);
	if (options) this.set(options);
  }

  MaunaDialogBooleannull.prototype = new Mauna.prototype.dialog();

  Mauna.prototype.dialog_booleannull = MaunaDialogBooleannull;
})()
