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
	p2 = new Player(2, g);

	b = new Ball(g, [ p1, p2 ]);

	animateInterval = requestAnimationFrame(animate);
}

//Global functions

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
	this.x = ground.x + ground.width / 2;
	this.y = ground.y + ground.height / 2;
	this.speed = 3;
	this.angle = 10;
	this.color = '#ff0000';
	this.players = players;
	this.setAngle = function(angle) {
		this.angle = angle;
	};
	this.draw = function() {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
		ctx.fill();
	};
	this.update = function() {
		//Update the new coordinates according to speed
		this.x += Math.cos(this.angle * Math.PI / 180) * this.speed;
		this.y += Math.sin(this.angle * Math.PI / 180) * this.speed;

		//Logic for Wall bounce
		//Right and Left respectively
		if (this.x + 5 >= ground.margin + ground.width || this.x - 5 <= ground.margin) {
			this.setAngle(180 - this.angle);
		}
		//Bottom and Top respectively
		if (this.y + 5 >= ground.margin + ground.height || this.y - 5 <= ground.margin) {
			this.setAngle(360 - this.angle);
		}

        //Logic for player collision
        var currentBall=this;
		this.players.forEach(function(player){
            //Bounce detection logic
			if (currentBall.x + 5 >= player.x && currentBall.y + 5 >= player.y&&currentBall.x-5<=player.x+player.width&&currentBall.y-5<=player.y+player.height) {
                
                if(currentBall.x + 5 >= player.x || currentBall.x-5<=player.x+player.width){
                    currentBall.setAngle(180 - currentBall.angle);
                } else if(currentBall.y + 5 >= player.y || currentBall.y-5<=player.y+player.height){
                    currentBall.setAngle(360 - currentBall.angle);
                }
            }
            
        });
	};
}

//Player class
function Player(number, ground) {
	this.x;
	this.y;
	this.width = 5;
	this.height = 30;
	this.color;
	if (number == 1) {
		this.x = ground.margin + 2;
		this.y = ground.height / 2 + ground.margin - this.height / 2;
		this.color = '#f0f0f0';
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
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fill();
	};
	this.update = function() {};
}

//Animation loop
function animate() {
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

	//Drawing calls
	g.draw();
	b.draw();
	p1.draw();
	p2.draw();
	//Update Calls
	b.update();

	//Recurr animate function
	requestAnimationFrame(animate);
}

//Resize adjustment

window.onresize = resize;

function resize(e) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

//Onload calback to init function
window.onload = init;
