import Phaser from 'phaser' // silnik gry

// ----- menu gry ---- 
class Win extends Phaser.Scene {
    constructor(functions) {
        super({key:'win', active: false})

        this.goToNextScene= functions.goToNextScene

    }
    block= false;

    preload = () => { 

    }

    create = () => {
        this.cursors = this.input.keyboard.createCursorKeys();
        // ---- wyswietlenie tekstu na ekranie ----
        this.add.text(130,100, '!!! VICTORY !!!', {fill: 'white'})
        this.add.text(100,130, 'click space to start', {fill: 'white'})
        
    }
    update= ()=>{
        // ----- przejscie ropoczęcie gry po kliknieciu spacji -----
        if(!this.block)
        {
            if (this.cursors.space.isDown) {
                this.block= true;
                this.goToNextScene('win', 'lvl1')
            }
        }
    }


}
export default Win;