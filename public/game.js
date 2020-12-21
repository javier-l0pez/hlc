import Stats from './Stats.js';
import playGame from './playGame.js';

var config = {
    type: Phaser.AUTO,
    backgroundColor: 0x111111,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "thegame",
        width: 750,
        height: 1334
    },
    scene: [Stats, playGame]
}
var game = new Phaser.Game(config);