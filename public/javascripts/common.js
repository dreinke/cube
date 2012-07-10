var main = new Main();

function Main(){
	var _this = this;
	
	type = null;
	socket = null;
	cube = null;
	xAngle = 0;
	yAngle = 0;

	jQuery(document).ready(function() {
		jQuery('.choice').click(init);
	});

	function init(){
		type = jQuery(this).attr('id');
		jQuery('#content').fadeTo(500,0, function() {
			jQuery(this).hide();
			jQuery('#experiment').fadeTo(500,1);
		});
		
		//cube
		cube = jQuery('#cube').first();
		
		socket = io.connect('http://192.168.1.54/');
		socket.on('connect', bindEvents);
	}

	function bindEvents(){
		var _this = this;
	
		if(type == 'mobile') {
			if(window.DeviceOrientationEvent){
				window.addEventListener('deviceorientation', onDeviceOrientation);
			} else if(window.OrientationEvent){
				window.addEventListener('MozOrientation', onMozOrientation);
			}
		}

		//socket.on('your_id', create);
		socket.on('move', onMove);
		socket.on('disconnect', onKill);
	}
	
	function onDeviceOrientation(eventData) {
			var data = {
				tiltLR: eventData.gamma,
				tiltFB: eventData.beta,
				dir: eventData.alpha,
				motUD: null
			}

			deviceOrientationHandler(data.tiltLR, data.tiltFB, data.dir, data.motUD);
			socket.emit('client_move', data);
		}
		
	function onMozOrientation(eventData) {
		var data = {
			tiltLR: eventData.x * 90,
			tiltFB: eventData.y * -90,
			dir: null,
			motUD: eventData.z
		}

		deviceOrientationHandler(data.tiltLR, data.tiltFB, data.dir, data.motUD);
		socket.emit('client_move', data);
	}

	function onMove(data){	
		deviceOrientationHandler(data.tiltLR, data.tiltFB, data.dir, data.motUD);
	}
	
	function deviceOrientationHandler(tiltLR, tiltFB, dir, motUD){
		//console.debug(Math.round(tiltLR), Math.round(tiltFB), Math.round(dir), Math.round(motUD));
		
		xAngle = (Math.round(tiltFB) * -1);
		yAngle = (Math.round(dir) * -1);
		cube.css('-webkit-transform', "rotateX(" + xAngle + "deg) rotateY(" + yAngle + "deg)");
		cube.css('-moz-transform', "rotateX(" + xAngle + "deg) rotateY(" + yAngle + "deg)");
	}
	
	function onKill(){
	}
	
	//public methods
	/*
	_this.harakiri = function(){
		console.log('FLW');
		socket.disconnect();
	}
	*/
}