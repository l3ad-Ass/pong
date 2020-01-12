//Global variable declaration
var canvas, ctx, animateInterval, computerLevel, isPaused, b, g, gH, gW, p1, p2, DY, goTo, playWithMouse;

//Init function
function init(e) {
	canvas = document.getElementById('screen');
	ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	isPaused = true;
	playWithMouse = false;
	gH = 400;
	gW = 800;
	g = new Ground(gW, gH, '#00f000');
	computerLevel = 0.1;

	p1 = new Player(1, g);
	p2 = new Player(2, g);
	goTo = p1.y;
	b = new Ball(g, [ p1, p2 ]);

	animateInterval = requestAnimationFrame(animate);

	//Listners
	//Controles
	window.onmousemove = function(e) {
		if (playWithMouse) {
			p1.update(e.clientY);
		}
	};

	//Keyboard Controls
	window.onkeydown = function(e) {
		//Toggle start on space bar or enter
		if (!isPaused) {
			DY = e.keyCode == 38 || e.keyCode == 87 ? -1 : e.keyCode == 40 || e.keyCode == 83 ? 1 : 0;
		}
		if (e.keyCode == 32 || e.keyCode == 13) {
			toggleStart();
		}
	};
	window.onkeyup = (e) => {
		if (e.keyCode == 38 || e.keyCode == 87 || e.keyCode == 40 || e.keyCode == 83) {
			DY = 0;
		}
	};

	//Resize adjustment

	window.onresize = resize;

	function resize(e) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		isPaused = true;
		g.reset(gW, gH);
		b.reset();
		p1.reset();
		p2.reset();
	}

	//ML initilization call
	initML();
}
//Animation loop
function animate() {
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

	//Drawing calls
	g.draw();
	com.draw();
	p1.drawScore();
	p2.drawScore();
	b.draw();
	p1.draw();
	p2.draw();
	//Update Calls
	if (!isPaused) {
		com.collectData();
		b.update();
		p1.update(p1.y + DY * computerLevel * b.speed * 8);
		
		if(com.isTraining){
			p2.update(p2.y + (b.y - p2.y) * computerLevel + 0.05);
		}else{
			let tdy=com.predict();
			p2.update(p2.y + -1 * tdy * computerLevel * b.speed * 8);
			
		}
	}

	//Recurr animate function
	requestAnimationFrame(animate);
}
//Global functions

//Pause and play
function toggleStart() {
	isPaused = !isPaused;
}

//Computer Speed changin function
function setComputerLevel(level) {
	if (level <= 0.15) {
		computerLevel = level;
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
function Ground(width, height, color) {
	this.marginX;
	this.marginY;
	this.x;
	this.y;
	this.width = width;
	this.height = height;
	this.color = color;
	this.reset = function(width, height) {
		this.marginX = (window.innerWidth - width) / 2;
		this.marginY = (window.innerHeight - height) / 2;
		this.x = this.marginX;
		this.y = this.marginY;
	};
	this.reset(width, height);
	this.draw = function() {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.stroke();
		ctx.fill();
		ctx.font = '100px Comic Sans M';
		ctx.fillStyle = this.color;
		ctx.textAlign = 'center';
		ctx.closePath();
		ctx.beginPath();
		ctx.fillStyle = '#ffffff';
		for (var i = this.y - 10; i < this.y + this.height - 15; i += 15) {
			ctx.rect(this.x + this.width / 2 - 2, i + 10, 4, 10);
		}
		ctx.fill();
		ctx.fillText('PONG', this.x + this.width / 2, this.marginY + this.height - 20);
	};
}

//Ball class
function Ball(ground, players) {
	this.radius = ground.height * 0.03;
	this.x;
	this.y;
	this.speed;
	this.velocityX;
	this.velocityY;
	this.color = '#ff0000';
	this.players = players;
	this.reset = function() {
		this.x = g.x + g.width / 2;
		this.y = g.y + g.height / 2;
		this.speed = 10;
		this.velocityX = this.speed;
		this.velocityY = 0;
		computerLevel = 0.1;
	};
	this.reset();
	this.setSpeed = function(newSpeed) {
		if (newSpeed < players[0].width - 0.1) {
			this.speed = newSpeed;
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
			let direction = this.x < canvas.width / 2 ? 1 : -1;
			this.x = direction == 1 ? ground.x + 1 : ground.x + ground.width - 1;
			this.velocityX *= -1;
		}
		//Bottom and Top respectively
		if (this.y + this.radius >= ground.y + ground.height || this.y - this.radius <= ground.y) {
			let direction = this.y < canvas.height / 2 ? 1 : -1;
			this.y = direction == 1 ? ground.y + this.radius + 1 : ground.y + ground.height - (this.radius + 1);
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
				this.setSpeed(this.speed + 0.1);
				setComputerLevel(computerLevel + 0.001);
			}
		}
		//Score logic
		if (this.x + this.radius >= ground.x + ground.width || this.x - this.radius <= ground.x) {
			isPaused = true;
			//if computer wins
			if (this.x < canvas.width / 2) {
				players[1].score++;
			} else {
				players[0].score++;
				if(com.isTraining){
					if(com.playCount>0){
						com.playCount--;
					}else if(com.playCount==0){
						com.trainModel();
						com.isTraining=false;
					}
				}
			}
			this.reset();
		}
	};
}

//Player class
function Player(number, ground) {
	this.x;
	this.y;
	this.width = ground.height * 0.05;
	this.height = ground.height * 0.25;
	this.number = number;
	this.score = 0;
	this.color;
	if (number == 1) {
		this.x = ground.x + this.width / 2 + 2;
		this.y = ground.height / 2 + ground.marginY + this.height / 2 - this.height / 2;
		this.color = '#f0f0f0';
	} else if (number == 2) {
		this.x = ground.x + ground.width - (2 + this.width / 2);
		this.y = ground.height / 2 + ground.marginY;
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
		if (newY - this.height / 2 > ground.y && newY + this.height / 2 < ground.y + ground.height) {
			this.y = newY;
		} else if (newY - this.height / 2 <= ground.y) {
			this.y = ground.y + this.height / 2;
		} else if (newY + this.height / 2 >= ground.y + ground.height) {
			this.y = ground.y + ground.height - this.height / 2;
		}
	};
	this.drawScore = function() {
		ctx.font = '100px Comic Sans M';
		ctx.fillStyle = '#ffffff';
		ctx.textAlign = 'center';
		if (this.number == 1) {
			ctx.fillText(this.score, ground.x + ground.width / 4, ground.marginY + 100);
		} else {
			ctx.fillText(this.score, ground.x + 3 * ground.width / 4, ground.marginY + 100);
		}
	};
	this.reset = function() {
		this.height = ground.height * 0.25;
		if (this.number == 1) {
			this.x = ground.x + this.width / 2 + 2;
			this.y = ground.height / 2 + ground.marginY + this.height / 2 - this.height / 2;
		} else if (this.number == 2) {
			this.x = ground.x + ground.width - (2 + this.width / 2);
			this.y = ground.height / 2 + ground.marginY;
		} else {
			console.error('Player number is not valid : ' + number);
		}
	};
}

//Onload calback to init function
window.onload = init;

//Tensorflow Implementation
//Global variables
var com;
//AI Class
function AI() {
	this.isTraining;
	this.previousData;
	this.currentData;
	this.currentPrediction;
	this.playCount;
	this.dataXs = [];
	this.dataYs = [];
	this.direction=[0.2,0.2,0.2];
	this.model = createModel();

	//Functions
	this.nextData = function() {
		if ((playCount = 0)) {
			this.isTraining = false;
			this.previousData = null;
		}
		this.playCount--;
	};
	this.reset = function() {
		this.isTraining = true;
		this.previousData = null;
		this.currentData = null;
		this.currentPrediction = 0;
		this.playCount = 2;
	};
	this.reset();
	this.collectData = function() {
		if (!isPaused) {
			if (this.previousData == null) {
				this.previousData = this.isTraining
					? [ b.x, b.y, p1.y, p2.y ]
					: [ g.width - b.x, g.height - b.y, g.height - p1.y, g.height - p2.y ];
				return;
			}
			this.currentData = this.isTraining
				? [ b.x, b.y, p1.y, p2.y ]
				: [ g.width - b.x, g.height - b.y, g.height - p1.y, g.height - p2.y ];
			if(this.isTraining){
				this.dataXs.push([ ...this.currentData, ...this.previousData ]);
				this.dataYs.push([DY==-1?1:0,DY==0?1:0,DY==1?1:0]);
			}
			
			this.previousData=this.currentData;
		}
	};
	this.trainModel = function() {
		//Data format [ballx,bally,playery,computery,previousballx,previousbally,previousplayery,previouscomputery]
		//Preparing data for training
		//Normalization of Data
		console.log('Preparing Data to Train');
		let minX = g.x;
		let maxX = g.x + g.width;
		let minY = g.y;
		let maxY = g.y + g.height;
		let newDataXs = this.dataXs.map((currentData) => {
			return currentData.map((value, index) => {
				let min;
				let max;
				if (index == 0 || index == 4) {
					//if Preparing Y values
					min = minX;
					max = maxX;
				} else {
					//if Preparing X values
					min = minY;
					max = maxY;
				}
				return (value - min) / (max - min);
			});
		});
		//Start training
		console.log('Started training');
		let thisO = this;
		(async function(){
			let result = await thisO.model.fit(tf.tensor(newDataXs),tf.tensor(thisO.dataYs));		
		}());
		console.log('trained');
		

	};

	this.predict = function() {
		let value = com.model.predict(tf.tensor([[...this.currentData,...this.previousData]])).argMax(1);
		this.currentPrediction = value.dataSync()[0]-1;
		return this.currentPrediction;
	};
	this.draw=function(){
		ctx.beginPath();
		ctx.fillStyle = `rgba(0,0,0,${this.direction[0]})`;
		ctx.arc(window.innerWidth-50, g.y+50, 20, 0, 2 * Math.PI);
		ctx.fillStyle = `rgba(0,0,0,${this.direction[1]})`;
		ctx.arc(window.innerWidth-50, g.y+100, 20, 0, 2 * Math.PI);
		ctx.fillStyle = `rgba(0,0,0,${this.direction[2]}`;
		ctx.arc(window.innerWidth-50, g.y+150, 20, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	};
}

//Machine Learning Init
function initML() {
	console.log('ML start');
	//Creating ML Object
	com = new AI();

}

function createModel() {
	const model = new tf.sequential();
	model.add(tf.layers.dense({ units: 256, inputShape: [ 8 ] }));
	model.add(tf.layers.dense({ units: 512, inputShape: [ 256 ] }));
	model.add(tf.layers.dense({ units: 256, inputShape: [ 512 ] }));
	model.add(tf.layers.dense({ units: 3, inputShape: [ 256 ] }));
	const learningRate = 0.001;
	const optimizer = tf.train.adam(learningRate);
	model.compile({ loss: 'meanSquaredError', optimizer: optimizer });
	return model;
}
