class Stats extends Phaser.Scene {
    constructor() {
        super("Stats");
    }

    create() {

        this.socket = io();
        let self = this;

        this.socket.emit('playerStartStats');
        this.numPlayersActive = 0;

        this.labelNumPlayers = "Number of Players: ";
        this.numPlayersTXT = this.add.text(10, 50, this.labelNumPlayers, { font: "25px Arial", fill: "yellow" })

        this.allPlayers;

        this.socket.on('currentPlayers', function (players) {
            self.allPlayers = players;
            self.updateActivePlayers(players, self);
        });

        this.socket.on('disconnect', function (playerId) {
            delete self.allPlayers[playerId];
            self.updateActivePlayers(self.allPlayers, self);
        });
    }

    updateActivePlayers(players, self) {

        let actives = 0;

        //Loop players and ask who is active
        Object.keys(players).forEach(function (id) {
            if (players[id].active) {
                actives++;
            }
        });

        self.scene.start("playGame", {
            socket: this.socket,
        });

        self.numPlayersTXT.setText(self.labelNumPlayers + actives);
    }
}

export default Stats;