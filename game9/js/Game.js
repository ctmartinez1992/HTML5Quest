Game9.Game = function (game) {
    this.game = game;
    this.game.score = 0;
    this.game.highscore = 0;
};

var tileSize;
var fieldArray;
var tileSprites;				
var colors;				
var upKey;
var downKey;
var leftKey;
var rightKey;
var canMove;

Game9.Game.prototype = {
	create: function () {
        this.sound.stopAll();
		
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//Background
		game.stage.backgroundColor = 0x4488cc;
		
		//Control variables
		doUpdate = true;
		paused = false;

		//Size of each tile
		tileSize = 100;
		
		//4x4 array that holds the values of each cell
		fieldArray = new Array(0, 0, 0, 0,
							   0, 0, 0, 0,
							   0, 0, 0, 0,
							   0, 0, 0, 0);
			
		//Possible colors for each cell
		colors = {
			2:		0xFFFFFF,
			4:		0xFFEEDD,
			8:		0xEEDDCC,
			16:		0xDDCCBB,
			32:		0xBBBBCC,
			64:		0xAABBDD,
			128:	0x9999CC,
			256:	0x9988AA,
			512:	0x779988,
			1024:	0xAAAA99,
			2048:	0x66BBAA,
			4096:	0x66AA77,
			8192:	0x448855,
			16384:	0x556644,
			32768:	0x334455,
			65536:	0x223322
		};
		
		//Player keys
		upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		upKey.onDown.add(this.moveUp, this);
		downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		downKey.onDown.add(this.moveDown, this);
		leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		leftKey.onDown.add(this.moveLeft, this);
		rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		rightKey.onDown.add(this.moveRight, this);
		
    	//Group that holds all rendering tiles
		tileSprites = game.add.group();
		
		//Controls if the player can do anything
		canMove = false;
		
		//Border
		this.border = game.add.sprite(game.world.centerX, game.world.centerY + 50, 'border');
		this.border.anchor.setTo(0.5, 0.5);

		//FPS Text
		game.time.advancedTiming = true;
		this.textFPS = game.add.text(20, 20, '', { font: "12px Chunk", fill: "#ffffff", align: "center" });
        this.textFPS.anchor.setTo(0, 0);
		this.textFPS.fixedToCamera = true;
		
		//Score Text
        this.textScore = game.add.text(game.camera.width - 20, 20, "SCORE: " + game.score, { font: "12px Chunk", fill: "#ffffff", align: "center" });
        this.textScore.anchor.setTo(1, 0);
		this.textScore.fixedToCamera = true;
		
    	//On start, add 2 twos
		this.addTwo();
		this.addTwo();
		
		//Initialize Pause function
		Pause.init();
		
		//Volume handler
		Volume.init(0, game.camera.height - 26);
	},

	update: function () {
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {            
			game.state.start('MainMenu');
        }
		
		if (this.game.time.fps !== 0) {
			this.textFPS.setText(game.time.fps + ' FPS');
		}
		
		if (doUpdate) {		
			this.updatePlayer();
        }		
    },
	
	updatePlayer: function() {
		
	},
	
	addTwo: function() {
		//Get an empty tile
		do {
			var randomValue = Math.floor(Math.random() * 16);
		} while (fieldArray[randomValue] != 0);
		
		fieldArray[randomValue] = 2;
		
		//Create a new sprite for the cell and set values
		var tile = game.add.sprite(this.toCol(randomValue) * tileSize + game.width / 4, this.toRow(randomValue) * tileSize + game.height / 4, "tile");
		tile.pos = randomValue;
		tile.alpha = 0;

		//Text shows the cell value
		var text = game.add.text(tileSize / 2,tileSize / 2, "2", { font: "bold 16px Arial", align:"center" });
		text.anchor.set(0.5);
		
		//Add text to tile and tile to group
		tile.addChild(text);
		tileSprites.add(tile);
		
		//Fade the tile in
		var fadeIn = game.add.tween(tile);
		fadeIn.to({ alpha: 1 }, 250);
		fadeIn.onComplete.add(function(){
			this.updateNumbers();
			canMove = true;
		}, this);
		fadeIn.start();
	},
	
	//1D row search
	toRow: function(n) {
		return Math.floor(n / 4);
	},
	
	//1D column search
	toCol: function(n) {
		return n % 4;
	},
	
	//Updates the numbers in cells
	updateNumbers: function() {
		tileSprites.forEach(function(item) {
			var value = fieldArray[item.pos];
			item.getChildAt(0).text = value;
			item.tint = colors[value];
		});	
	},
	
	//Move tiles to the left
	moveLeft: function() {
		if(canMove) {
			canMove = false;
			var moved = false;
			
			//Sort tiles by x and loop it
			tileSprites.sort("x", Phaser.Group.SORT_ASCENDING);
			tileSprites.forEach(function(item){
				var row = this.toRow(item.pos);
				var col = this.toCol(item.pos);
				if(col > 0) {
					var remove = false;
					for(i=col - 1; i>=0; i--) {
						if(fieldArray[row * 4 + i] != 0) {
							if(fieldArray[row * 4 + i] == fieldArray[row * 4 + col]) {
								remove = true;
								i--;
							}
							
							break;
     					}
     				}
					
					//Can we move?
					if(col != i + 1) {
						moved = true;
						this.moveTile(item, row * 4 + col, row * 4 + i + 1, remove);
     				}
     			}
     		}, this);
			
			this.endMove(moved);
         }
	},
    
	//Move tiles up
	moveUp: function() {
		if(canMove) {
			canMove = false;
			var moved = false;

			//Sort tiles by y and loop it
			tileSprites.sort("y", Phaser.Group.SORT_ASCENDING);
     		tileSprites.forEach(function(item){
				var row = this.toRow(item.pos);
				var col = this.toCol(item.pos);
				if(row > 0) { 
					var remove = false;
					for(i=row - 1; i >= 0; i--) {
						if(fieldArray[i * 4 + col] != 0) {
							if(fieldArray[i * 4 + col] == fieldArray[row * 4 + col]) {
								remove = true;
								i--;
							}
							
							break;
     					}
					}
					
					//Can we move?
					if(row != i + 1) {
						moved = true;
						this.moveTile(item,row*4+col,(i+1)*4+col,remove);
     				}
     			}
     		}, this);
			
			this.endMove(moved);
        }
	},
	
	//Move tiles to the right
	moveRight: function() {
		if(canMove) {
			canMove = false;
			var moved = false;

			//Sort tiles by x and loop it
			tileSprites.sort("x", Phaser.Group.SORT_DESCENDING);
			tileSprites.forEach(function(item) {
				var row = this.toRow(item.pos);
				var col = this.toCol(item.pos);
				if(col < 3) {
					var remove = false;
					for(i=col + 1; i <= 3; i++) {
						if(fieldArray[row * 4 + i] != 0) {
							if(fieldArray[row * 4 + i] == fieldArray[row * 4 + col]) {
								remove = true;
								i++;   
							}

							break;
						}
					}
					
					//Can we move it?
					if(col != i - 1) {
						moved = true;
						this.moveTile(item, row * 4 + col, row * 4 + i - 1, remove);
					}
				}
			}, this);

			this.endMove(moved);
		}
	},
	
	//Move tiles down
	moveDown: function() {
		if(canMove) {
			canMove = false;
			var moved = false;

			//Sort by y and loop it
			tileSprites.sort("y", Phaser.Group.SORT_DESCENDING);
			tileSprites.forEach(function(item) {
				var row = this.toRow(item.pos);
				var col = this.toCol(item.pos);
				if(row < 3) {
					var remove = false;
					for(i=row + 1; i <= 3; i++) {
						if(fieldArray[i * 4 + col] != 0) {
							if(fieldArray[i * 4 + col] == fieldArray[row * 4 + col]) {
								remove = true;
								i++;
							}

							break;
						}
					}

					//Can we move it?
					if(row != i - 1) {
						moved = true;
						this.moveTile(item, row * 4 + col, (i - 1) * 4 + col, remove);
					}
				}
			}, this);

			this.endMove(moved);
		}
	},
	
	//Finish the move
	endMove: function(moved) {
		if(moved){
			this.addTwo();
		} else {
			canMove = true;
		}
	},
	
	//Move a tile
	moveTile: function(tile, from, to, remove) {
		//Update cell array
		fieldArray[to] = fieldArray[from];
		fieldArray[from] = 0;
		
		tile.pos = to;
		
		//Tween it
		var movement = game.add.tween(tile);
		movement.to({ x: tileSize * (this.toCol(to)) + game.width / 4, y: tileSize * (this.toRow(to)) + game.height / 4 }, 150);
		if(remove) {
			fieldArray[to] *= 2;
			movement.onComplete.add(function(){
				tile.destroy();
			});
		}
		
		movement.start();
	}
};