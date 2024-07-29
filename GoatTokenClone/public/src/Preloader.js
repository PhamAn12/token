class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }
    preload() {
		this.add.sprite(0, 0, 'background').setOrigin(0, 0);
        var titleFont = { font: '80px '+EPT.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 10 };
		var textTitleFont = this.add.text(EPT.world.centerX, EPT.world.centerY-50, EPT.text['game_tile'], titleFont);
		textTitleFont.setOrigin(0.5);
		var loadingBg = this.add.sprite(EPT.world.centerX, EPT.world.centerY+90, 'loading-background');
		loadingBg.setOrigin(0.5, 0.5);

		var progress = this.add.graphics();
		this.load.on('progress', function (value) {
			progress.clear();
			progress.fillStyle(0xffde00, 1);
			progress.fillRect(loadingBg.x-(loadingBg.width*0.5)+20, loadingBg.y-(loadingBg.height*0.5)+10, 540 * value, 25);
		});

		var resources = {
			'image': [
				['title', 'img/title.png'],
				['clickme', 'img/clickme.png'],
                ['overlay', 'img/overlay.png'],
                ['button-beer', 'img/button-beer.png'],
                ['banner-beer', 'img/banner-beer.png'],
                ['particle', 'img/particle.png'],
				['avatar', 'img/fake_avatar.png'],
				['goat', 'img/goat.png'],
			],
			'spritesheet': [
				['button-start', 'img/button-start.png', {frameWidth:180,frameHeight:180}],
				['button-settings', 'img/button-settings.png', {frameWidth:80,frameHeight:80}],
				['loader', 'img/loader.png', {frameWidth:45,frameHeight:45}],
				['button-continue', 'img/button-continue.png', {frameWidth:180,frameHeight:180}],
                ['button-mainmenu', 'img/button-mainmenu.png', {frameWidth:180,frameHeight:180}],
                ['button-restart', 'img/button-tryagain.png', {frameWidth:180,frameHeight:180}],
                ['button-achievements', 'img/button-achievements.png', {frameWidth:110,frameHeight:110}],
                ['button-pause', 'img/button-pause.png', {frameWidth:80,frameHeight:80}],
                ['button-credits', 'img/button-credits.png', {frameWidth:80,frameHeight:80}],
                ['button-sound-on', 'img/button-sound-on.png', {frameWidth:80,frameHeight:80}],
                ['button-sound-off', 'img/button-sound-off.png', {frameWidth:80,frameHeight:80}],
                ['button-music-on', 'img/button-music-on.png', {frameWidth:80,frameHeight:80}],
                ['button-music-off', 'img/button-music-off.png', {frameWidth:80,frameHeight:80}],
                ['button-back', 'img/button-back.png', {frameWidth:70,frameHeight:70}]
			],
			'audio': [
                ['sound-click', ['sfx/audio-button.m4a','sfx/audio-button.mp3','sfx/audio-button.ogg']],
                ['music-theme', ['sfx/music-bitsnbites-liver.m4a','sfx/music-bitsnbites-liver.mp3','sfx/music-bitsnbites-liver.ogg']]
            ]
		};
		for(var method in resources) {
			resources[method].forEach(function(args) {
				var loader = this.load[method];
				loader && loader.apply(this.load, args);
			}, this);
		};
    }
    create() {
		EPT.fadeOutScene('Game', this);
	}
}