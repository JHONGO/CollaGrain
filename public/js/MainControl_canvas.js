//Send socket.io message
var socket = io.connect();	
var socket_message = {};

var gainNum = 0;
//Global variables
var canvas = null, ctx = null;
var	center_ball_r = 0, center_ball_x = 0, center_ball_y = 0;			
var ax = 0, ay = 0, 
	cx = 0, cy = 0; 			
var balls = new Array();
var dis = 0;
var balls_num = 50;
var opacity = 0;
var playback_img = null;
var playback = false;
var effectIndex = 0;
var red = (Math.random() * 255).toFixed(0);
var green = (Math.random() * 255).toFixed(0);
var blue = (Math.random() * 255).toFixed(0);
var Grain_color = 'rgba('+red +','+ green +','+ blue +','+ 0.6 + ')';
var nickname = '';

//This is a detected function for checking if the user is using mobile device or not. ==============================================
function mobilecheck(){
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}


$('#enter').click(function() {
	$('.lightbox').fadeOut('slow', function() {
		nickname = document.getElementById("nick_input").value;
		if(nickname == '') {
			//location.reload();
		}
	});
});

//Initialize the canvas ============================================================================================================
window.addEventListener('load', function(event) {


	window.mCheck = mobilecheck();	
  	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");	
	ctx.canvas.width = window.innerWidth; 
	ctx.canvas.height = window.innerHeight;
	cx = ctx.canvas.width;
	cy = ctx.canvas.height-200;
	center_ball_r = Math.round(Math.min(cx/3, cy/3));
	center_ball_x = cx/2;
	center_ball_y = center_ball_r + 100;
	ballsizeMIN = grainSize.i;
	ballsizeMAX = grainSize.i + variance.i;

	//playback_img = new Image();
	//playback_img.src = "../img/playback.png";

	document.getElementById("effector2").style.display="none";
	document.getElementById("effector1").style.display="none";

	//checking if the user is using mobile device or not. ==========================================================================
	//ON MOBILE
	if(mCheck) {
		canvas.addEventListener('touchstart', function(e){
			if((e.touches[0].clientX > cx/2 - center_ball_r) && (e.touches[0].clientX < cx/2 + center_ball_r)){
				if((e.touches[0].clientY > cy/2 - center_ball_r) && (e.touches[0].clientY < cy/2 + center_ball_r)){
					createBalls();
				}	
			}

			/* if((e.touches[0].clientX > cx/2 - 100) && (e.touches[0].clientX < cx/2 + 100)){
				if((e.touches[0].clientY > 50) && (e.touches[0].clientY < 300)){
					if(playback == false){
						playback = true;
						playback_img.src = "../img/play.png";
					}
					else{
						playback = false;
						playback_img.src = "../img/playback.png";
					}
				}	
			} */
	        e.preventDefault();
	    }, false);
	}
	//ON PC
	else {
		function getMousePos(canvas, evt) {
		    var rect = canvas.getBoundingClientRect();
		    return {
		      x: evt.clientX - rect.left,
		      y: evt.clientY - rect.top
		    };
		}
		canvas.addEventListener("mousedown", function(e){
			var position = getMousePos(canvas, e);
			posx = position.x;
    		posy = position.y;
    		if((posx > cx/2 - center_ball_r) && (posx < cx/2 + center_ball_r)){
				if((posy > cy/2 - center_ball_r) && (posy < cy/2 + center_ball_r)){
					createBalls();
					console.log(posx+', '+posy);
				}	
			}
		}, false);
		canvas.addEventListener('mousemove', function(e) {
	        var mousePos = getMousePos(canvas, e);
	        var message = 'Mouse position: ' + ax + ',' + ay;
	        ax = 0.5*(mousePos.x - cy/2);
	        ay = 0.5*(mousePos.y - cx/2);
	    }, false);
	}
    gainNum = gain.i;	

});

//Redefine the canvas size when the windows changes the size. ======================================================================
window.addEventListener('orientationchange', resizeCV, false);
window.addEventListener('resize', resizeCV, false);
function resizeCV() {
	ctx.canvas.width = window.innerWidth; 
	ctx.canvas.height = window.innerHeight;
	cx = ctx.canvas.width;
	cy = ctx.canvas.height;
	center_ball_r = Math.round(Math.min(cx/3, cy/3));
	center_ball_x = cx/2;
	center_ball_y = center_ball_r + 100;
}

//Obtain the values of accelerations on device =====================================================================================
window.ondevicemotion = function(e) {

	//Beause the x axis acceleration value is opposite to official value, so I multiply ax by a minus.
	ax = event.accelerationIncludingGravity.x * (-gravity.i);
	ay = event.accelerationIncludingGravity.y * (gravity.i);
}


//Send the selected effect index with a independent socket variable - SVtoM_effectIndex.
socket.on('SVtoM_effectIndex', function(data) {
	effectIndex = parseInt(data.index);
});

//A function for changing the effect interfaces. 
function changeEffect(index) {
	effectIndex = index;
	if(effectIndex == 1){
			document.getElementById("effector2").style.display="none";
			document.getElementById("effector1").style.display="block";
	}
	if(effectIndex == 2){
			document.getElementById("effector2").style.display="block";
			document.getElementById("effector1").style.display="none";
	}
	var effect = {
		'effectIndex' : index
	};
	socket.emit('effectIndex', effect);
	console.log(index);
}

//Balls Constructor ================================================================================================================
function Ball (){
	this.x =  center_ball_x;
	this.y = center_ball_y;
	this.vx = 20;
	this.vy = 1;
	this.r = Math.random() * (ballsizeMAX-ballsizeMIN)+ballsizeMIN;
	this.bufpart = this.r / center_ball_r;
	this.color = Grain_color;

	this.update = function(){
		var landscapeOrientation = window.innerWidth/window.innerHeight > 1;

		if (mCheck && landscapeOrientation) {
			alert('Please Lock Your Screen rotation.');
		} 					
		else {	
			// v1 = v0 + a1
			this.vx = this.vx + ax ; 
			this.vy = this.vy + ay;
		}

		//Add the restitution to grains movement.
		this.vx = this.vx * restitution.i;
		this.vy = this.vy * restitution.i;


		//This part is controlling the movement resolution.
		this.y = parseInt(this.y + this.vy / 60);
		this.x = parseInt(this.x + this.vx / 60);
	}
	
	this.collide = function(){

		//Counting the distance between grain and the border of the big circle.
		dis = Math.pow(center_ball_x - this.x, 2) + Math.pow(center_ball_y - this.y, 2);


		//if contact the boundary, then......
		if(dis > Math.pow(center_ball_r-this.r, 2)){

			//degree counting of the bouncing point
			if(this.x < cx/2 && this.y < center_ball_y){ // top-left
				this.degree = (180/Math.PI)*Math.atan((cy/2-this.y)/(cx/2-this.x))+270;
				this.timepart = Math.floor(this.degree/360*1000)/1000;
			}
			
			if(this.x > cx/2 && this.y < center_ball_y){ // top-right
				this.degree = (180/Math.PI)*Math.atan((cy/2-this.y)/(cx/2-this.x))+90;
				this.timepart = Math.floor(this.degree/360*1000)/1000;
			}

			if(this.x < cx/2 && this.y > center_ball_y){ // bottom-left
				this.degree = (180/Math.PI)*Math.atan((cy/2-this.y)/(cx/2-this.x))+270;
				this.timepart = Math.floor(this.degree/360*1000)/1000;
			}

			if(this.x > cx/2 && this.y > center_ball_y){ // bottom-right
				this.degree = (180/Math.PI)*Math.atan((cy/2-this.y)/(cx/2-this.x))+90;
				this.timepart = Math.floor(this.degree/360*1000)/1000;
			}


			//Bounce counting
			this.vx = -this.vx;
			this.vy = -this.vy;

			//Add some threshold value to avoid the grains bouncing out in boundary counting. 
			if(this.x > cx/2) {
				this.x = this.x - 10;
			}else {
				this.x = this.x + 10;
			}

			if(this.y > cy/2) {
				this.y = this.y - 10;
			}else {
				this.y = this.y + 10;
			}


			//The JSON object for saving the grain controlling values.
			socket_message = {
				'ID' : socket.id,
				'red' : red,
				'green' : green,
				'blue' : blue,
				'grainSize' : this.r,
				'timepart' : this.timepart,
				'bufpart' : this.bufpart,
				'gain' : gainNum,
				'playback' : playback,
				'delaytime' : delaytime.i,
				'delaygain' : delaygain.i,
				'actual_id_array' : [],
			};

			//Send the JSON object to system's server side.
			socket.emit('MtoSV_message', socket_message);
		}
	}

	this.display = function(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
	}					
}


var ran_x = 0;
var ran_y = 0;
var ran_xx = 0;
var ran_vx = 0;
var ran_vy = 0;
var radius = 0;
var ran_color = 0;

//Function for creating a ball =============================================================================================
function createBalls(){	
	if(balls.length <= balls_num) {
		balls.push(new Ball());
	}
}				


var process_time_machine = 0;
//Drawing the canvas =======================================================================================================
function draw(){
	process_time_machine++;
	ctx.clearRect(0, 0, cx, cy);
	ctx.rect(0, 0, cx, cy+500);
	ctx.fillStyle="#000";
	ctx.fill();
	//Center Ball rendering
	ctx.beginPath();					
	ctx.arc(center_ball_x, center_ball_y, center_ball_r, 0, 2*Math.PI);
	ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
	ctx.fill();
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
	ctx.lineWidth = 3;
	ctx.stroke();

	//ctx.fillStyle = 'rgba(0, 0, 0, 1)';
	//ctx.font="20px Georgia";
	//ctx.fillText(ax+', '+ay, 100, 100);

	ballsizeMIN = grainSize.i;
	ballsizeMAX = grainSize.i + variance.i;
	gainNum = gain.i;
	//Balls array rendering
	balls.forEach (function(ball){
		ball.update();
		ball.collide();
		ball.display();
	});		

	requestAnimationFrame(draw);
}
requestAnimationFrame(draw);