import Phaser from 'phaser' // silnik gry
import actions from '../actions'; // akcje, animacje gry
import Characters from '../characters' // wszelkie postacie w grze


// ----- rozgrywka gry  -----

class Level1 extends Phaser.Scene {
    constructor(functions) {
        super({ key: 'lvl1', active: false })

        this.speed = 2; // szybkośc ruchu gracza
        this.goToNextScene = functions.goToNextScene; // funkcja przenosząca do innej sceny 
        this.hit = functions.hit;// funkcja po strzale w gracza
        this.reduceWater = functions.reduceWater; //  ubywanie wody 
        this.collectLife = functions.collectLife;// zebranie zycia
        this.collectWater = functions.collectWater; // zebranie wody


    }

    preload = () => {
        // ---- załadowanie animacji gracza  -----
        actions.playerAnimations(this); // 'playerRight' , 'playerLeft', 'playerStandRight', 'playerStandLeft'

        // ----- zaladowanie animacji przeciwnikow -----
        actions.enemy1Animation(this)

    }


    create = () => {
        // ----- statyczne obrazki -----
        this.add.image(0, 0, 'background1').setOrigin(0) // tła
        this.add.image(950, 140, 'arrow1').setOrigin(0).setScale(1 / 3, 1 / 3) // trzałka


        // ----- obiekt gracza -----
        this.player= Characters.getPlayer(this, 100, 400, 'right')


        // ----- przeciwnicy -----

        this.enemy1= Characters.getEnemyChorse(this, 740, 100, 'left'); // szczelający koń
       

        // ----- flakoniki z dodatkowym życiem/ wodą -----

        var lifeBottles = this.physics.add.staticGroup();
        lifeBottles.create(100, 278, 'lifeBottle').setOrigin(0);
        this.physics.add.overlap(this.player, lifeBottles, this.collectLife, null, this)

        var waterBottles = this.physics.add.staticGroup();
        waterBottles.create(900, 444, 'waterBottle').setOrigin(0);
        this.physics.add.overlap(this.player, waterBottles, this.collectWater, null, this)


        // ----- przesówalne pudełka

        this.box1 = this.physics.add.sprite(700, 400, 'box').setOrigin(0)
        this.box1.body.collideWorldBounds = true; // ustawienie kolizji z krawędziami 
        this.box1.body.setBounce(0.5); // odepchniecie w poziomie
        this.box1.body.setMass(10) // nadanie masy pudełku



        // ----- podstawa (ziemia ) i platformy (statyczne obiekty) -----

        this.add.sprite(512, 537, 'ground')
        this.add.sprite(150, 331, 'platform1')
        this.add.sprite(810, 226, 'platform1')

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(512, 546, 'ground');
        this.platforms.create(150, 340, 'platform1');
        this.platforms.create(810, 235, 'platform1');


        // ----- obiekt oblsugi klawiatury -----
        this.cursors = this.input.keyboard.createCursorKeys();


        // ----- kolizje -----

        this.physics.add.collider(this.player, this.platforms); // gracza z platformami
        this.physics.add.collider(this.box1, this.platforms); // pudełka z platformami
        this.physics.add.collider(this.box1, this.player, () => { this.box1.body.velocity.x = 0 }); // pudełka z graczem
        this.physics.add.collider(this.enemy1, this.platforms); // pudełka z graczem

    }

    update = () => {
        //  ---------- przesowanie obiektów ----------

        this.physics.world.overlap(this.player, this.box1, () => { actions.moveElement(this.player, this.box1) }, null, this)


        // ---------- dodatkowe poprawki zachowań elementów ----------

        actions.slowDown(this.box1, 2) // spowolnianie boxu
        actions.slowDown(this.enemy1, 3) // spowolnianie trafionego przeciwnika

        // ---------- strzały gracza ----------

        if (this.cursors.space.isDown && !this.player.reload) {
            actions.shoot(this, this.player.direction, this.player, this.speed * 300, 'playerBullet', 0, [this.box1, this.platforms], [{ element: this.enemy1, func: () => { actions.hittedOpponent(this.enemy1, this) } },]);
        }

        // ---------- obsługa klawiatury i animacji gracza ----------

        actions.playerMovingAndAnimations(this.cursors, this.player, this.speed)

        // ---------- zachowanie przeciwników ----------

        if (this.enemy1.active === true) { // strzalnie przeciwnika
            if (this.enemy1.y + 200 > this.player.y && this.enemy1.y - 100 < this.player.y) {
                if (!this.enemy1.reload)
                    actions.shoot(this, -1, this.enemy1, 2000, 'enemy1Bullet', 75, [], [{ element: this.player, func: () => { this.hit(this.scene.key) } }]);
                this.enemy1.anims.isPlaying = true;

            }
            else {
                this.enemy1.anims.isPlaying = false
            }
        }

        // ----------- wygranko  i przejscie do nastepnej sceny ----------

        if (this.player.y <= 176 && this.player.x >= 910) {
            this.goToNextScene(this.scene.key, 'lvl2')
        }
    }
}


export default Level1;