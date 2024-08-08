class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }
    create() {
        this.add.sprite(0, 0, 'background').setOrigin(0,0);
        this.stateStatus = null;
        this._score = 0;
        this._time = 10;
		this._timerDuration = this._time;
		this._rate = 1.2;
		this._gamePaused = false;
		this._runOnce = false;
		this._level = 1;

		this.buttonDummy = new Button(EPT.world.centerX, EPT.world.centerY + 300, 'clickme', this.addPoints, this, 'static');
        this.buttonDummy.setOrigin(0.5,0.5);
        this.buttonDummy.setAlpha(0);
        this.buttonDummy.setScale(0.1);
        this.tweens.add({targets: this.buttonDummy, alpha: this._time > 0 ? 0.3: 1, duration: 300, ease: 'Linear'});
        this.tweens.add({targets: this.buttonDummy, scale: 1, duration: 500, ease: 'Back'});
        
        this.initUI();
        this.currentTimer = this.time.addEvent({
            delay: 1000,
            callback: function(){
				if(this._time > 0){
					this._time--;
					if(this.buttonDummy.anpha = 1) {
						this.tweens.add({targets: this.buttonDummy, alpha: 0.3, duration: 300, ease: 'Linear'});
					}
					//this.buttonDummy.setAlpha(0.5);
				}
				else{
					this.tweens.add({targets: this.buttonDummy, alpha: 1, duration: 500, ease: 'Linear'});

				}
                this.textTime.setText(EPT.text['gameplay-timeleft']+this._time);
                if(!this._time) {
                    this._runOnce = false;
                    this.stateStatus = 'gameover';
                }
            },
            callbackScope: this,
            loop: true
        });

		this.input.keyboard.on('keydown', this.handleKey, this);
        this.cameras.main.fadeIn(250);
        this.stateStatus = 'playing';
    }
	update() {
		switch(this.stateStatus) {
			case 'paused': {
				if(!this._runOnce) {
					this.statePaused();
					this._runOnce = true;
				}
				break;
			}
			// case 'gameover': {
			// 	if(!this._runOnce) {
			// 		this.stateGameover();
			// 		this._runOnce = true;
			// 	}
			// 	break;
			// }
			case 'playing': {
				this.statePlaying();
			}
			default: {
			}
		}
	}
    handleKey(e) {
        switch(e.code) {
            case 'Enter': {
                this.addPoints();
                break;
            }
            case 'KeyP': {
                this.managePause();
                break;
            }
            case 'KeyB': {
                this.stateBack();
                break;
            }
            case 'KeyT': {
                this.stateRestart();
                break;
            }
            default: {}
        }
    }
    managePause() {
        this._gamePaused =! this._gamePaused;
        this.currentTimer.paused =! this.currentTimer.paused;
		EPT.Sfx.play('click');
		if(this._gamePaused) {
			EPT.fadeOutIn(function(self){
				//self.buttonPause.input.enabled = false;
				self.buttonDummy.input.enabled = false;
				self.stateStatus = 'paused';
				self._runOnce = false;
			}, this);
			this.screenPausedBack.x = -this.screenPausedBack.width-20;
			this.tweens.add({targets: this.screenPausedBack, x: 100, duration: 500, delay: 250, ease: 'Back'});
			this.screenPausedContinue.x = EPT.world.width+this.screenPausedContinue.width+20;
			this.tweens.add({targets: this.screenPausedContinue, x: EPT.world.width-100, duration: 500, delay: 250, ease: 'Back'});
		}
		else {
			EPT.fadeOutIn(function(self){
				//self.buttonPause.input.enabled = true;
				self.buttonDummy.input.enabled = true;
				self._stateStatus = 'playing';
				self._runOnce = false;
			}, this);
			this.screenPausedBack.x = 100;
			this.tweens.add({targets: this.screenPausedBack, x: -this.screenPausedBack.width-20, duration: 500, ease: 'Back'});
			this.screenPausedContinue.x = EPT.world.width-100;
			this.tweens.add({targets: this.screenPausedContinue, x: EPT.world.width+this.screenPausedContinue.width+20, duration: 500, ease: 'Back'});
        }
    }
	statePlaying() {
        if(this._time === 0) {
            this._runOnce = false;
            this.stateStatus = 'gameover';
        }
	}
	statePaused() {
        this.screenPausedGroup.toggleVisible();
	}
	stateGameover() {
		this.currentTimer.paused =! this.currentTimer.paused;
		EPT.Storage.setHighscore('EPT-highscore',this._score);
		EPT.fadeOutIn(function(self){
			self.screenGameoverGroup.toggleVisible();			
			self.buttonPause.input.enabled = false;
			self.buttonDummy.input.enabled = false;
			self.screenGameoverScore.setText(EPT.text['gameplay-score']+self._score);
			self.gameoverScoreTween();
		}, this);
		this.screenGameoverBack.x = -this.screenGameoverBack.width-20;
		this.tweens.add({targets: this.screenGameoverBack, x: 100, duration: 500, delay: 250, ease: 'Back'});
		this.screenGameoverRestart.x = EPT.world.width+this.screenGameoverRestart.width+20;
		this.tweens.add({targets: this.screenGameoverRestart, x: EPT.world.width-100, duration: 500, delay: 250, ease: 'Back'});
	}
    initUI() {
		// this.buttonPause = new Button(20, 20, 'button-pause', this.managePause, this);
		// this.buttonPause.setOrigin(0,0);

		var fontScore = { font: '38px '+EPT.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 5 };
		var fontScoreWhite =  { font: '28px '+EPT.text['FONT'], fill: '#000', stroke: '#ffde00', strokeThickness: 5 };
		this.textScore = this.add.text(30, EPT.world.height-45, EPT.text['gameplay-score']+this._score, fontScore);
		this.textScore.setOrigin(0,1);

		this.textScore.y = -this.textScore.height-20;
		this.tweens.add({targets: this.textScore, y: 90, duration: 500, delay: 100, ease: 'Back'});

		this.textUsername = this.add.text(EPT.world.centerX, EPT.world.height-45, EPT.text['user_name'], fontScore);
		this.textUsername.setOrigin(0.5,0.5);

		this.tweens.add({targets: this.textUsername, y: 150, duration: 500, delay: 100, ease: 'Back'});

		this.textTime = this.add.text(EPT.world.width-60, 100, EPT.text['gameplay-timeleft']+this._time, fontScoreWhite);
		this.textTime.setOrigin(1,0);

		this.textTime.y = -this.textTime.height-20;
		this.tweens.add({targets: this.textTime, y: EPT.world.centerY + 150, duration: 500, delay: 100, ease: 'Back'});

		this.texLevel = this.add.text(EPT.world.centerX - 230, 0, 'Level: '+this._level, fontScoreWhite);
		this.texLevel.setOrigin(0,1);

		this.texLevel.y = -this.textTime.height-20;
		this.tweens.add({targets: this.texLevel, y: EPT.world.centerY + 185, duration: 500, delay: 100, ease: 'Back'});

		this.rateText = this.add.text(EPT.world.width-70, 45, EPT.text['rate']+this._rate, fontScore);
		this.rateText.setOrigin(1,0);

		this.rateText.y = -this.rateText.height-20;
		this.tweens.add({targets: this.rateText, y: 45, duration: 500, delay: 100, ease: 'Back'});

		var avatar = this.add.sprite(EPT.world.centerX, 60, 'avatar');
		avatar.setScale(0.5);
		this.tweens.add({targets: this.avatar, y: 90, duration: 500, delay: 100, ease: 'Back'});

		var middleImage = this.add.sprite(EPT.world.centerX, EPT.world.centerY-50, 'goat');
		this.tweens.add({targets: middleImage, angle: middleImage.angle-12, duration: 600, ease: 'Sine.inOut' });
        this.tweens.add({targets: middleImage, angle: middleImage.angle+14, duration: 1200, ease: 'Sine.inOut', yoyo: true, repeat: -1, delay: 1000 });

		// var buttonQuest = new Button(EPT.world.width-20, EPT.world.height-20, 'button-continue', this.openQuest, this);
		// buttonQuest.setOrigin(1,1);
		// buttonQuest.setScale(0.5);

		// buttonQuest.x = EPT.world.width+buttonQuest.width+20;
		// this.tweens.add({targets: buttonQuest, x: EPT.world.width-20, duration: 500, ease: 'Back'});

		var fontTitle = { font: '48px '+EPT.text['FONT'], fill: '#000', stroke: '#ffde00', strokeThickness: 10 };

		this.screenPausedGroup = this.add.group();
        this.screenPausedBg = this.add.sprite(0, 0, 'overlay');
        this.screenPausedBg.setAlpha(0.95);
        this.screenPausedBg.setOrigin(0, 0);
		this.screenPausedText = this.add.text(EPT.world.centerX, 100, EPT.text['gameplay-paused'], fontTitle);
		this.screenPausedText.setOrigin(0.5,0);
		this.screenPausedBack = new Button(100, EPT.world.height-100, 'button-mainmenu', this.stateBack, this);
		this.screenPausedBack.setOrigin(0,1);
		this.screenPausedContinue = new Button(EPT.world.width-100, EPT.world.height-100, 'button-continue', this.managePause, this);
		this.screenPausedContinue.setOrigin(1,1);
		this.screenPausedGroup.add(this.screenPausedBg);
		this.screenPausedGroup.add(this.screenPausedText);
		this.screenPausedGroup.add(this.screenPausedBack);
		this.screenPausedGroup.add(this.screenPausedContinue);
        this.screenPausedGroup.toggleVisible();

		this.screenGameoverGroup = this.add.group();
        this.screenGameoverBg = this.add.sprite(0, 0, 'overlay');
        this.screenGameoverBg.setAlpha(0.95);
        this.screenGameoverBg.setOrigin(0, 0);
		this.screenGameoverText = this.add.text(EPT.world.centerX, 100, EPT.text['gameplay-gameover'], fontTitle);
		this.screenGameoverText.setOrigin(0.5,0);
		this.screenGameoverBack = new Button(100, EPT.world.height-100, 'button-mainmenu', this.stateBack, this);
		this.screenGameoverBack.setOrigin(0,1);
		this.screenGameoverRestart = new Button(EPT.world.width-100, EPT.world.height-100, 'button-restart', this.stateRestart, this);
		this.screenGameoverRestart.setOrigin(1,1);
		this.screenGameoverScore = this.add.text(EPT.world.centerX, 300, EPT.text['gameplay-score']+this._score, fontScoreWhite);
		this.screenGameoverScore.setOrigin(0.5,0.5);
		this.screenGameoverGroup.add(this.screenGameoverBg);
		this.screenGameoverGroup.add(this.screenGameoverText);
		this.screenGameoverGroup.add(this.screenGameoverBack);
		this.screenGameoverGroup.add(this.screenGameoverRestart);
		this.screenGameoverGroup.add(this.screenGameoverScore);
		this.screenGameoverGroup.toggleVisible();
		// Add the loading background sprite
        this.loadingBg = this.add.sprite(this.scale.width / 2, this.scale.height / 2 + 210, 'loading-background');
        this.loadingBg.setOrigin(0.5, 0.5);

        // Create a separate canvas for the gradient
        var gradientCanvas = document.createElement('canvas');
        gradientCanvas.width = 540;
        gradientCanvas.height = 25;
        var gradientContext = gradientCanvas.getContext('2d');

        // Create the gradient
        var gradient = gradientContext.createLinearGradient(0, 0, gradientCanvas.width, 0);
        gradient.addColorStop(0, '#ffff00');  // Start color
        gradient.addColorStop(1, '#ff0000');  // End color

        // Fill the canvas with the gradient
        gradientContext.fillStyle = gradient;
        gradientContext.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);

        // Create a texture from the canvas and use it for a sprite
        
		if (this.textures.exists('gradient')) {
			var gradientTexture = this.textures.get('gradient');
		} else {
			var gradientTexture = this.textures.createCanvas('gradient', gradientCanvas.width, gradientCanvas.height);
		}
		if(gradientTexture != null && gradientTexture.context != null)
        {
			gradientTexture.context.drawImage(gradientCanvas, 0, 0);
        	gradientTexture.refresh();
		}

        this.progressBar = this.add.sprite(
            this.loadingBg.x - (this.loadingBg.width * 0.5) + 20,
            this.loadingBg.y - (this.loadingBg.height * 0.5) + 23,
            'gradient'
        ).setOrigin(0, 0.5);

        // Store the progress data object and tween reference
        this.progressData = { value: 0 };
        this.progressTween = null;

        // Bind the restartProgressBar method to the scene context
        this.restartProgressBar = this.restartProgressBar.bind(this);

        // Initial progress bar setup
        this.restartProgressBar();
		//this.createMenuButtons();
		const graphics = this.add.graphics();
		graphics.fillStyle(0xfae019, 1); 
		
		const rectangleHeight = 70; 
		graphics.fillRect(0, EPT.world.height - rectangleHeight, EPT.world.width, rectangleHeight);

		var buttonShop = new Button(EPT.world.width/2 - 200, EPT.world.height-35, 'shop-icon', this.openShop, this);
		var buttonHome = new Button(EPT.world.width/2, EPT.world.height-35, 'home-icon', this.stateBack, this);
		var buttonQuest = new Button(EPT.world.width/2 + 200, EPT.world.height-35, 'quest-icon', this.openQuest, this);
		var buttonUpgradeLevel = new Button(EPT.world.width/2 - 260, EPT.world.centerY+155, 'upgrade-icon', this.stateBack, this);
		buttonShop.setAlpha(0.7);

		function addZoomEffect(button) {
			button.on('pointerover', () => {
				this.tweens.add({
					targets: button,
					scaleX: 1.2,
					scaleY: 1.2,
					duration: 200,
					ease: 'Power2'
				});
			});
	
			button.on('pointerout', () => {
				this.tweens.add({
					targets: button,
					scaleX: 1,
					scaleY: 1,
					duration: 200,
					ease: 'Power2'
				});
			});
		}
		addZoomEffect.call(this, buttonShop);
    	addZoomEffect.call(this, buttonQuest);
		addZoomEffect.call(this, buttonUpgradeLevel);
    }
    addPoints() {
		if(this._time <= 0) {
			this._score += 10 * this._rate;
        	this.textScore.setText(EPT.text['gameplay-score']+this._score);
        
        	var randX = Phaser.Math.Between(200, EPT.world.width-200);
        	var randY = Phaser.Math.Between(200, EPT.world.height-200);
			var pointsAdded = this.add.text(randX, randY, '+10', { font: '48px '+EPT.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 10 });
			pointsAdded.setOrigin(0.5, 0.5);
        	this.tweens.add({targets: pointsAdded, alpha: 0, y: randY-50, duration: 1000, ease: 'Linear'});

        	this.cameras.main.shake(100, 0.01, true);
			this._time = 10;
			this.restartProgressBar();
		} else {
			var randX = Phaser.Math.Between(200, EPT.world.width-200);
        	var randY = Phaser.Math.Between(200, EPT.world.height-200);
			var pointsAdded = this.add.text(randX, randY, 'wait for time end!', { font: '28px '+EPT.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 10 });
			pointsAdded.setOrigin(0.5, 0.5);
        	this.tweens.add({targets: pointsAdded, alpha: 0, y: randY-50, duration: 1000, ease: 'Linear'});
		}
    }
	stateRestart() {
		EPT.Sfx.play('click');
        EPT.fadeOutScene('Game', this);
	}
	stateBack() {
		EPT.Sfx.play('click');
		EPT.fadeOutScene('MainMenu', this);
	}
	restartProgressBar() {
        // Reset the progress value
        this.progressData = { value: 0 };

        // Stop the existing tween if it exists
        if (this.progressTween) {
            this.progressTween.stop();
        }

        // Create a new tween to update the progress value over 10 seconds
        this.progressTween = this.tweens.add({
            targets: this.progressData,
            value: 1,
            duration: this._timerDuration * 1000, // 10 seconds
            ease: 'Linear',
            onUpdate: () => {
                // Update the width of the progress bar sprite
                this.progressBar.setCrop(0, 0, this.progressBar.width * this.progressData.value, this.progressBar.height);
            }
        });
    }
	gameoverScoreTween() {
		var self = this;
		this.screenGameoverScore.setText(EPT.text['gameplay-score']+'0');
		if(this._score) {
			this.pointsTween = this.tweens.addCounter({
				from: 0, to: this._score, duration: 2000, delay: 250,
				onUpdateScope: this, onCompleteScope: this,
				onUpdate: function(){
					self.screenGameoverScore.setText(EPT.text['gameplay-score']+Math.floor(self.pointsTween.getValue()));
				},
				onComplete: function(){
					var emitter = self.add.particles(self.screenGameoverScore.x+30, self.screenGameoverScore.y, 'particle', {
						speed: { min: -600, max: 600 },
						angle: { min: 0, max: 360 },
						scale: { start: 0.5, end: 3 },
						blendMode: 'ADD',
						active: true,
						lifespan: 2000,
						gravityY: 1000,
						quantity: 250
					});
					emitter.explode();
				}
			});
		}
	}
	openQuest() {
		EPT.fadeOutScene('Story', this);
	}
	openShop() {
		EPT.fadeOutScene('Shop', this);
	}
	createButton(x, y, label) {
        const button = this.add.container(x, y);
		var fontScoreWhite =  { font: '28px '+EPT.text['FONT'], fill: '#000', stroke: '#ffde00', strokeThickness: 5 };
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffff00, 1);
        graphics.fillRoundedRect(-50, -20, 100, 40, 10);
        graphics.lineStyle(2, 0x000000, 1);
        graphics.strokeRoundedRect(-50, -20, 100, 40, 10);
        button.add(graphics);

        const text = this.add.text(0, 0, label, fontScoreWhite).setOrigin(0.5);
        button.add(text);

        button.setSize(100, 40);
        button.setInteractive(new Phaser.Geom.Rectangle(-50, -20, 100, 40), Phaser.Geom.Rectangle.Contains);

        return button;
    }
	createMenuButtons() {
        const homeButton = this.createButton(EPT.world.width/2, EPT.world.height-50, 'Home');
        const questButton = this.createButton(EPT.world.width/2+100, EPT.world.height-50, 'Quest');
		questButton.on('pointerdown', () => {
            this.openQuest();
        });
		const storeButton = this.createButton(EPT.world.width/2-100, EPT.world.height-50, 'Store');

        this.add.existing(homeButton);
        this.add.existing(questButton);
		this.add.existing(storeButton);
    }
	
};