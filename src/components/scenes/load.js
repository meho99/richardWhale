import Phaser from 'phaser' // silnik gry

// ----- import grafik -----

import playerSpirites from '../../sprites/player.png'
import ground1Image from '../../sprites/ground1.png'
import boxImage from '../../sprites/box.img'
import menuImage from '../../sprites/menu.png'
import playerBulletImage from '../../sprites/playerBullet.png'
import enemy1BulletImage from '../../sprites/enemy1Bullet.img'
import platformImage from '../../sprites/platform.img'
import enemy1Image from '../../sprites/enemy1.img'
import skullImage from '../../sprites/skull.img'
import lifeBottleImage from '../../sprites/life.img'
import waterBottleImage from '../../sprites/waterBottle.img'
import arrow1Image from '../../sprites/arrow.img'
import background1Image from '../../sprites/background1.img'
import background2Image from '../../sprites/background2.img'
import lavaImage from '../../sprites/lawa.img'
import batImage from '../../sprites/bat.img'
import bat2Image from '../../sprites/bat2.png'
import kroksImage from '../../sprites/kroks.png'
import turtleImage from '../../sprites/turtle.png'
import bossImage from '../../sprites/boss.png'



// ----- ladowanie wszystkich assetów (ładowanie gry) -----

class Load extends Phaser.Scene {
    constructor(functions) {
        super({ key: 'load', active: true })


        this.goToNextScene = functions.goToNextScene
    }

    preload = () => {
        // ----- załadowanie obrazków i fizyki do wszystkich scen -----
        this.load.image('menu', menuImage); // obrazek na menu
        this.load.image('background1', background1Image); // 1 tło gry
        this.load.image('background2', background2Image); // 2 tło gry
        this.load.spritesheet('player', playerSpirites, { frameWidth: 109, frameHeight: 41 }); // spiryty gracza
        this.load.image('ground', ground1Image) // trawa
        this.load.image('platform1', platformImage); // platformy
        this.load.image('box', boxImage); // przesówalne pudelko 
        this.load.image('playerBullet', playerBulletImage); // nabój gracza
        this.load.image('enemy1Bullet', enemy1BulletImage); // nabój przeciwnika
        this.load.spritesheet('enemy1', enemy1Image, { frameWidth: 85, frameHeight: 120 })
        this.load.spritesheet('turtle', turtleImage, { frameWidth: 125, frameHeight: 65 })
        this.load.image('skull', skullImage); // nabój gracza
        this.load.image('lifeBottle', lifeBottleImage); // flakon z dodatkowym zyciem
        this.load.image('waterBottle', waterBottleImage); //falakon z dodatkowa wodą
        this.load.image('arrow1', arrow1Image); // strzałka wskazujaca droge
        this.load.spritesheet('bat', batImage,{frameWidth:105   , frameHeight: 80}) // nietoperz
        this.load.spritesheet('bat2', bat2Image,{frameWidth:105   , frameHeight: 80}) // nietoperz 2(szypki)
        this.load.spritesheet('kroks', kroksImage,{frameWidth:175 , frameHeight: 55}) // krokodyl
        this.load.spritesheet('boss', bossImage,{frameWidth:230 , frameHeight: 134}) // boss 
        this.load.image('lava', lavaImage); // lawa
        


        // --- ladowanie

        // let loadingBar= this.add.graphics({
        //     color: 0xffffff
        // })
        // this.load.on('progress',(percent)=>{
        //     loadingBar.fillRect(0, this.game.renderer.height/2, this.game.renderer.width*percent)
        //     console.log(percent)
        // })

        // ----- po załadowaniu przejscie do nastepnych ekranów gry -----
        this.load.on("complete", () => { this.goToNextScene('load', 'menu') })


    }


    create = () => {


    }

}
export default Load;