import Phaser from 'phaser' // silnik gry

// ----- menu gry ---- 
class Menu extends Phaser.Scene {
    constructor(functions) {
        super({key:'menu', active: false})

        this.goToNextScene= functions.goToNextScene

    }
    block= false;

    preload = () => { 

    }

    create = () => {
        this.cursors = this.input.keyboard.createCursorKeys();
        // ---- wyswietlenie tekstu na ekranie ----
        this.add.image(0,0, 'menu').setOrigin(0)
        this.add.text(130,100, 'RICHARD WHALE', {fill: 'white'})
        this.add.text(100,130, 'click space to start', {fill: 'white'})
        
    }
    update= ()=>{
        // ----- przejscie ropoczęcie gry po kliknieciu spacji -----
        if(!this.block)
        {
            if (this.cursors.space.isDown) {
                this.block= true;
                this.goToNextScene('menu', 'lvl1')
            }
        }
    }


}
export default Menu;