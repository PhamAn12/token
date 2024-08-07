
class Shop extends Phaser.Scene {
    constructor() {
        super('Shop');
    }
	preload(){
 
	}
    create() {
        this.add.sprite(0, 0, 'background').setOrigin(0,0);
        var fontScore = { font: '58px '+EPT.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 5 };
		this.textScore = this.add.text(EPT.world.centerX, EPT.world.centerY, 'COMING SOON!', fontScore);
		this.textScore.setOrigin(0.5,0.5);
        const graphics = this.add.graphics();
        graphics.fillStyle(0xfae019, 1); 
            
        const rectangleHeight = 70; 
        graphics.fillRect(0, EPT.world.height - rectangleHeight, EPT.world.width, rectangleHeight);
    
        var buttonShop = new Button(EPT.world.width/2 - 200, EPT.world.height-35, 'shop-icon', this.stateBack, this);
        var buttonHome = new Button(EPT.world.width/2, EPT.world.height-35, 'home-icon', this.gotoHome, this);
        var buttonQuest = new Button(EPT.world.width/2 + 200, EPT.world.height-35, 'quest-icon',this.gotoQuest, this);
        buttonShop.setAlpha(0.7);
	}
	gotoHome() {
		EPT.fadeOutScene('Game', this);
	}
    gotoQuest() {
		EPT.fadeOutScene('Story', this);
	}

};
