class Story extends Phaser.Scene {
    constructor() {
        super('Story');
    }
    create() {
		this.add.sprite(0, 0, 'background').setOrigin(0,0);

		var fontStory = { font: '40px '+EPT.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 5, align: 'center' };
		var textStory = this.add.text(EPT.world.centerX - 200, 50, EPT.text['list_quest'], fontStory);
		textStory.setOrigin(0.5,0);

		var buttonContinue = new Button(EPT.world.width-20, EPT.world.height-20, 'button-back', this.clickContinue, this);
		buttonContinue.setOrigin(1,1);
		buttonContinue.setScale(1.2);
		buttonContinue.x = EPT.world.width+buttonContinue.width+20;
		this.tweens.add({targets: buttonContinue, x: EPT.world.width-20, duration: 500, ease: 'Back'});

		this.cameras.main.fadeIn(250, 0, 0, 0);

		let backgroundScroll = this.add.graphics();
        backgroundScroll.fillStyle(0x0000ff, 1); // Blue color with full opacity
        backgroundScroll.fillRect(0, 0, 450, 730);
		this.scrollContainer = this.add.container(100, 100);
		this.scrollContainer.add(backgroundScroll);
		this.listItems = [];
        for (let i = 0; i < 20; i++) {
            let item = this.add.text(10, i * 30 + 10, 'Item jkdfjkdfjkdfk ' + (i + 1), fontStory);
            this.scrollContainer.add(item);
            this.listItems.push(item);
        }



	}
	clickContinue() {
		EPT.fadeOutScene('Game', this);
	}

};