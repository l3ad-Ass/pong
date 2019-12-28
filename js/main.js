//Global variable declaration
var canvas, ctx, animateInterval, b, g, p1, p2;

//Init function
function init(e) {
	canvas = document.getElementById('screen');
	ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	g = new Ground(100, '#00f000');

	p1 = new Player(1, g);
	//p2 = new Player(2, g);

	b = new Ball(g, [ p1 ]);

	animateInterval = requestAnimationFrame(animate);
}
//Animation loop
function animate() {
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

	//Drawing calls
	g.draw();
	b.draw();
	p1.draw();
	//p2.draw();
	//Update Calls
	b.update();

	//Recurr animate function
	requestAnimationFrame(animate);
}
//Global functions

//Collision Square and circle
function intersects(circle,rect)
{
	var circleDistance={};
    circleDistance.x = Math.abs(circle.x - rect.x);
    circleDistance.y = Math.abs(circle.y - rect.y);

    if (circleDistance.x > (rect.width/2 + circle.radius)) { return false; }
    if (circleDistance.y > (rect.height/2 + circle.radius)) { return false; }

    if (circleDistance.x <= (rect.width/2)) { return true; } 
    if (circleDistance.y <= (rect.height/2)) { return true; }

    var cornerDistance_sq = (circleDistance.x - rect.width/2)^2 +
                         (circleDistance.y - rect.height/2)^2;

    return (cornerDistance_sq <= (circle.radius^2));
}


//Ground class
function Ground(margin, color) {
	this.margin = margin;
	this.x = margin;
	this.y = margin;
	this.width = window.innerWidth - 2 * margin;
	this.height = window.innerHeight - 2 * margin;
	this.color = color;
	this.draw = function() {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fill();
	};
}

//Ball class
function Ball(ground, players) {
	this.radius = 4;
	this.x = ground.x - this.radius + ground.width / 2;
	this.y = ground.y - this.radius + ground.height / 2;
	this.speed = 3;
	this.angle = 10;
	this.color = '#ff0000';
	this.players = players;
	//test
	this.radius=40;
	this.speed = 0.1;
	this.x = 140;
	 this.y=160;
	this.angle = 1;
	//
	this.setAngle = function(angle) {
		if (angle >= 360) {
			this.setAngle(angle - 360);
			return;
		} else if (angle < 0) {
			this.setAngle(360 + angle);
			return;
		}
		this.angle = angle;
	};
	this.draw = function() {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
		//Outline
		ctx.beginPath();
		ctx.strokeStyle='blue';
		ctx.rect(this.x-this.radius,this.y-this.radius,2*this.radius,2*this.radius);
		ctx.stroke();
	};
	this.update = function() {
		//Update the new coordinates according to speed
		this.x += Math.cos(this.angle * Math.PI / 180) * this.speed;
		this.y += Math.sin(this.angle * Math.PI / 180) * this.speed;

		//Logic for Wall bounce
		//Right and Left respectively
		if (this.x + this.radius >= ground.margin + ground.width || this.x - this.radius <= ground.margin) {
			this.setAngle(180 - this.angle);
		}
		//Bottom and Top respectively
		if (this.y + this.radius >= ground.margin + ground.height || this.y - this.radius <= ground.margin) {
			this.setAngle(360 - this.angle);
		}

		//Logic for player collision
		for (var i = 0; i < players.length; i++) {
			let player = players[i];
			//Bounce from player detection logic
			// if (
			// 	this.x - 5 <= player.x + playerMarginW &&
			// 	this.x + 5 >= player.x - playerMarginW&&
			// 	this.y - 5 <= player.y + playerMarginW &&
			// 	this.y + 5 >= player.y-playerMarginW
			// ) {
			// 	//console.log(player.number + ') bounce from');
			// 	let distance=Math.sqrt((player.x-this.x)*(player.x-this.x)+(player.y-this.y)*(player.y-this.y));
				
			// 	//console.log(distance);
			// 	if(distance==){
			// 		console.log('not center');
					
			// 	}else{
			// 		console.log('center');
					
			// 	}
			// }
			if(intersects(this,player)){
				let margin = player.width/2;
				if(this.x+this.radius>player.x-margin&&this.x+this.radius<player.x+margin){
					this.setAngle(360-this.angle);
					console.log('.');
				}

			}
		}
	};
}

//Player class
function Player(number, ground) {
	this.x;
	this.y;
	this.width = 50;
	this.height = 130;
	this.number = number;
	this.color;
	if (number == 1) {
		this.x = ground.margin+this.width/2 + 120;
		this.y = ground.height / 2 + ground.margin+this.height/2 - this.height / 2;
		this.color = 'rgba(233,233,233,0.5)';//'#f0f0f0';
	} else if (number == 2) {
		this.x = ground.margin + ground.width - (2 + this.width);
		this.y = ground.height / 2 + ground.margin - this.height / 2;
		this.color = '#0f0f0f';
	} else {
		console.error('Player number is not valid : ' + number);
	}
	this.draw = function() {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.rect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);
		ctx.fill();
	};
	this.update = function() {};
}



//Resize adjustment

window.onresize = resize;

function resize(e) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

//Onload calback to init function
window.onload = init;
