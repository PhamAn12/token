const COLOR_MAIN = 0xF0B70C;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0xF68301;
class Story extends Phaser.Scene {
    constructor() {
        super('Story');
    }
	preload(){
		this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });  
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

		var panel = this.rexUI.add.scrollablePanel({
            x: EPT.world.centerX, y: EPT.world.centerY,
            width: 500, height: 700,

            scrollMode: 'y',

            panel: {
                child: CreatePanel(this),
            },
            space: {
                slider: 15,
            }
        }).layout()
        panel.setChildrenInteractive({
            targets: [
                panel.getElement('panel')
            ]
        }).on('child.click', function (child) {
                // child : Label from CreateItem()  
                console.log(`Click ${child.name}`);
            })

	}
	clickContinue() {
		EPT.fadeOutScene('Game', this);
	}

};
var CreatePanel = function (scene) {
    var panel = scene.rexUI.add.sizer({
        orientation: 'y',
        space: { item: 5 }
    })

    for (var i = 0; i < 10; i++) {
        panel
            .add(
                CreateItem(scene, i.toString()),
                { expand: true }
            )
    }

    return panel;
}

var CreateItem = function (scene, text) {
    var item = scene.rexUI.add.dialog({
        height: 80,

        space: { left: 10, right: 10, top: 10, bottom: 10 },

        background: scene.rexUI.add.roundRectangle({
            radius: 10,
            color: COLOR_MAIN
        }),

        title: scene.rexUI.add.label({
            text: scene.add.text(0, 0, text),
        }),

        content: scene.rexUI.add.label({
            text: scene.add.text(0, 0, "ITEM " + text),
        }),

        actions: [
            scene.rexUI.add.label({
                space: { left: 5, right: 5, top: 5, bottom: 5 },
                background: scene.rexUI.add.roundRectangle({
                    color: COLOR_DARK
                }),
                text: scene.add.text(0, 0, 'OK'),
            }),
        ],

        proportion: {
            content: 1,
        },

        align: {
            actions: 'right'
        },

        name: text
    })
    return item;
}