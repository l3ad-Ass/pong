//Global variable declaration
var canvas, ctx, animateInterval,computerLevel , isPaused, b, g, p1, p2;

//Init function
function init(e) {
	canvas = document.getElementById('screen');
	ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	isPaused = true;
	computerLevel=0.1;
	g = new Ground(100, '#00f000');

	p1 = new Player(1, g);
	p2 = new Player(2, g);

	b = new Ball(g, [ p1, p2 ]);

	animateInterval = requestAnimationFrame(animate);

	//Listners
	//Pause and Start Listner
	window.onclick = function() {
		isPaused = !isPaused;
	};

	//Controles
	window.onmousemove = function(e) {
		p1.update(e.clientY);
	};
	
	//Resize adjustment

	window.onresize = resize;

	function resize(e) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		isPaused=true;
		g.reset();
		b.reset();
		p1.reset();
		p2.reset();
	}
}
//Animation loop
function animate() {
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

	//Drawing calls
	g.draw();
	p1.drawScore();
	p2.drawScore();
	b.draw();
	p1.draw();
	p2.draw();
	//Update Calls
	if (!isPaused) {
		b.update();
		p2.update(p2.y+(b.y-(p2.y))*computerLevel);
	}

	//Recurr animate function
	requestAnimationFrame(animate);
}
//Global functions
//Computer Speed changin function
function setComputerLevel(level) {
	if(level<=0.2){
			computerLevel=level;
	}
}

//Collision Square and circle
function intersects(circle, rect) {
	
	var circleDistance = {};
	circleDistance.x = Math.abs(circle.x - rect.x);
	circleDistance.y = Math.abs(circle.y - rect.y);
	
	if (circleDistance.x > rect.width / 2 + circle.radius) {
		return false;
	}
	if (circleDistance.y > rect.height / 2 + circle.radius) {
		return false;
	}
	
	if (circleDistance.x <= rect.width / 2) {
		return true;
	}
	if (circleDistance.y <= rect.height / 2) {
		return true;
	}

	var cornerDistance_sq = (circleDistance.x - rect.width / 2) ^ (2 + (circleDistance.y - rect.height / 2)) ^ 2;

	return cornerDistance_sq <= (circle.radius ^ 2);
}

//Ground class
function Ground(margin, color) {
	this.margin = margin;
	this.x = (window.innerWidth-200>=800)?(window.innerWidth-800)/2:margin;
	this.y = margin;
	this.width = (window.innerWidth-200>=800)?800:window.innerWidth - 2 * margin;
	this.height = window.innerHeight - 2 * margin;
	this.color = color;
	this.draw = function() {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.stroke();
		ctx.fill();
		ctx.font = "100px Comic Sans M";
		ctx.fillStyle=this.color;
		ctx.textAlign='center';
		ctx.closePath();
		ctx.beginPath();
		ctx.fillStyle = '#ffffff';
		for(var i=this.y-100;i<=this.height+100;i+=15){
			ctx.rect(this.x+this.width/2-2,i+10,4,10);
		}
		ctx.fill();
		ctx.fillText('PONG', this.x+this.width/2,this.margin+this.height-20);
	};
	this.reset=function(){
		this.height = (window.innerHeight<=500)?300: window.innerHeight - 2 * margin;
		this.x = (window.innerWidth-200>=800)?(window.innerWidth-800)/2:margin;
		this.width=(window.innerWidth-200>=800)?800:((window.innerWidth<=500)?300:window.innerWidth - 2 * margin);

	};
}

//Ball class
function Ball(ground, players) {
	this.radius = ground.height*0.03;
	this.x = ground.x + ground.width / 2;
	this.y = ground.y + ground.height / 2;
	this.speed = 5;
	this.velocityX = this.speed;
	this.velocityY = 0;
	this.color = '#ff0000';
	this.players = players;
	//test
	// 	this.radius = 14;
	//  this.speed = 5;
	// 	this.x = 340;
	// 	this.y = 300;
	// 	this.velocityX = -0.5;
	// 	this.velocityY = -0.5;
	//
	this.setSpeed=function(newSpeed){
		if(newSpeed<players[0].width-0.1){
			this.speed=newSpeed;
		}
	};
	this.draw = function() {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		// //Outline
		// ctx.beginPath();
		// ctx.strokeStyle = 'blue';
		// ctx.moveTo(this.x - this.radius, 0);
		// ctx.lineTo(this.x - this.radius, canvas.width);
		// ctx.moveTo(this.x + this.radius, 0);
		// ctx.lineTo(this.x + this.radius, canvas.width);
		// ctx.moveTo(0, this.y - this.radius);
		// ctx.lineTo(canvas.width, this.y - this.radius);
		// ctx.moveTo(0, this.y + this.radius);
		// ctx.lineTo(canvas.width, this.y + this.radius);
		// ctx.stroke();
		// ctx.closePath();
		// //axis
		// ctx.beginPath();
		// ctx.strokeStyle = 'white';
		// ctx.moveTo(this.x, 0);
		// ctx.lineTo(this.x, canvas.height);
		// ctx.moveTo(0, this.y);
		// ctx.lineTo(canvas.width, this.y);
		// ctx.stroke();
		// ctx.closePath();
	};
	this.update = function() {
		//Update the new coordinates according to speed
		this.x += this.velocityX;
		this.y += this.velocityY;

		//Logic for Wall bounce
		//Right and Left respectively
		if (this.x + this.radius >= ground.x + ground.width || this.x - this.radius <= ground.x) {
			let direction = (this.x<canvas.width/2)?1:-1;
			this.x=(direction==1)?ground.x+1:ground.x+ground.width-1;
			this.velocityX *= -1;
		}
		//Bottom and Top respectively
		if (this.y + this.radius >= ground.y + ground.height || this.y - this.radius <= ground.y) {
			let direction = (this.y<canvas.height/2)?1:-1;
			this.y=(direction==1)?ground.y+this.radius+1:ground.y+ground.height-(this.radius+1);
			this.velocityY *= -1;
		}

		//Logic for player collision
		for (var i = 0; i < players.length; i++) {
			let player = players[i];
			//Bounce from player detection logic
			if (intersects(this, player)) {
				let collidePoint = (this.y - player.y) / (player.height / 2);
				let angleRad = Math.PI / 4 * collidePoint;
				let direction = player.number == 1 ? 1 : -1;
				this.velocityX = direction * this.speed * Math.cos(angleRad);
				this.velocityY = this.speed * Math.sin(angleRad);
				this.setSpeed(this.speed+0.1);
				setComputerLevel(computerLevel+0.001);
			}
		}
		//Point logic
		if (this.x + this.radius >= ground.x + ground.width || this.x - this.radius <= ground.x) {
			isPaused = true;
			if (this.x < canvas.width / 2) {
				players[1].score++;
			} else {
				players[0].score++;
				
			}
			this.reset();
		}
	};
	this.reset = function() {
		this.x = ground.x + ground.width / 2;
		this.y = ground.y + ground.height / 2;
		this.speed = 5	;
		this.velocityX = this.speed;
		this.velocityY = 0;
	};
}

//Player class
function Player(number, ground) {
	this.x;
	this.y;
	this.width = ground.height*0.05;
	this.height = ground.height*0.25;
	this.speed=3;
	this.number = number;
	this.score = 0;
	this.color;
	if (number == 1) {
		this.x = ground.x + this.width / 2 + 2;
		this.y = ground.height / 2 + ground.margin + this.height / 2 - this.height / 2;
		this.color = '#f0f0f0';
	} else if (number == 2) {
		this.x = ground.x + ground.width - (2 + this.width / 2);
		this.y = ground.height / 2 + ground.margin;
		this.color = '#0f0f0f';
	} else {
		console.error('Player number is not valid : ' + number);
	}
	this.draw = function() {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
		ctx.fill();
	};
	this.update = function(newY) {
		
		if(newY-this.height/2>ground.y&&newY+this.height/2<ground.y+ground.height){	
			this.y=newY;
		}else if(newY-this.height/2<=ground.y){
			this.y=ground.y+this.height/2;
		}else if(newY+this.height/2>=ground.y+ground.height){
			this.y=ground.y+ground.height-this.height/2;
		}
	};
	this.drawScore=function(){
		ctx.font = "100px Comic Sans M";
		ctx.fillStyle='#ffffff';
		ctx.textAlign='center';
		if(this.number==1){
			ctx.fillText(this.score,ground.x+ ground.width/4, ground.margin*2);
		}else{
			ctx.fillText(this.score, ground.x+3*ground.width/4, ground.margin*2);
		}
	};
	this.reset=function(){
		this.height = ground.height*0.15;
		if (this.number == 1) {
			this.x = ground.x + this.width / 2 + 2;
			this.y = ground.height / 2 + ground.margin + this.height / 2 - this.height / 2;
		} else if (this.number == 2) {
			this.x = ground.x + ground.width - (2 + this.width / 2);
			this.y = ground.height / 2 + ground.margin;
		} else {
			console.error('Player number is not valid : ' + number);
		}
	};
}

//Onload calback to init function
window.onload = init;
