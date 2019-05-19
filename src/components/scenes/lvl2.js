import Phaser from 'phaser' // silnik gry
import actions from '../actions'; // akcje, animacje gry
import Characters from '../characters' // wszelkie postacie w grze


// ----- rozgrywka gry  -----

class Level2 extends Phaser.Scene {
    constructor(functions) {
        super({ key: 'lvl2', active: false })

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
        actions.enemy2Actions(this)
    }

    create = () => {
        // ----- statyczne obrazki -----
        this.add.image(0, 0, 'background1').setOrigin(0) // tło
        this.add.image(950, 140, 'arrow1').setOrigin(0).setScale(1 / 3, 1 / 3) // trzałka

        // ----- obiekt gracza -----
        this.player = Characters.getPlayer(this, 50, 400, 'right')

        // ----- przeciwnicy -----
        this.enemy1= Characters.getEnemyChorse(this, 850, 350, 'left'); // szczelający koń=

        this.enemyBat= Characters.getEnemyBat(this, 800, 265, 'left') // nietoperz
        this.enemyBat2= Characters.getEnemyBat(this, 100, 155, 'left') // nietoperz 2


        // ----- flakoniki z dodatkowym życiem/ wodą -----

        // ----- przesówalne pudełka

        this.box1 = this.physics.add.sprite(200, 400, 'box').setOrigin(0)
        this.box1.body.collideWorldBounds = true; // ustawienie kolizji z krawędziami 
        this.box1.body.setBounce(0.5); // odepchniecie w poziomie
        this.box1.body.setMass(10) // nadanie masy pudełku

        // ----- podstawa (ziemia ) i platformy (statyczne obiekty) -----

        this.add.sprite(-250, 537, 'ground')
        this.add.sprite(1300, 537, 'ground')
        this.add.sprite(800, 352, 'platform1')
        this.add.sprite(950, 243, 'platform1')

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(-250, 546, 'ground');
        this.platforms.create(1300, 551, 'ground');

        this.platforms.create(800, 361, 'platform1');
        this.platforms.create(950, 252, 'platform1');

        // lawa
        this.lava = this.physics.add.staticGroup();
        this.platforms.create(520, 540, 'platform1') // dla ruchu pudełka

        this.lava.create(525, 540, 'lava')


        // ----- obiekt oblsugi klawiatury -----
        this.cursors = this.input.keyboard.createCursorKeys();


        // ----- kolizje -----

        this.physics.add.collider(this.player, this.platforms); // gracza z platformami
        this.physics.add.collider(this.box1, this.platforms); // pudełka z platformami
        this.physics.add.collider(this.box1, this.player, () => { this.box1.body.velocity.x = 0 }); // pudełka z graczem
        this.physics.add.collider(this.enemy1, this.platforms); // platform z koniem
        //this.physics.add.collider(this.box1, this.lava); // pudełka z graczem

        this.physics.add.overlap(this.player, this.enemyBat, () => { actions.batHit(this.enemyBat, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu nietoperza
        this.physics.add.overlap(this.player, this.enemyBat2, () => { actions.batHit(this.enemyBat2, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu nietoperza

    }

    update = () => {
        //  ---------- przesowanie obiektów ----------

        this.physics.world.overlap(this.player, this.box1, () => { actions.moveElement(this.player, this.box1) }, null, this)


        // ---------- dodatkowe poprawki zachowań elementów ----------

        actions.slowDown(this.box1, 2) // spowolnianie boxu
        actions.slowDown(this.enemy1, 3) // spowolnianie trafionego przeciwnika
        this.physics.world.overlap(this.player, this.lava, () => { this.hit(this.scene.key); this.player.x = 100; this.player.y = 400 }) // toniecie w lawie 


        // ---------- strzały gracza ----------

        if (this.cursors.space.isDown && !this.player.reload) {
            actions.shoot(this, this.player.direction, this.player, this.speed * 300, 'playerBullet', 0, [this.box1, this.platforms], [{ element: this.enemy1, func: () => { actions.hittedOpponent(this.enemy1, this) } }, { element: this.enemyBat, func: () => { actions.hittedOpponent(this.enemyBat, this) } }, { element: this.enemyBat2, func: () => { actions.hittedOpponent(this.enemyBat2, this) } }]);
        }

        // ---------- obsługa klawiatury i animacji gracza ----------

        actions.playerMovingAndAnimations(this.cursors, this.player, this.speed)

        // ---------- zachowanie przeciwników ----------

        if (this.enemy1.active == true) {
            if (this.enemy1.y + 150 > this.player.y && this.enemy1.y - 50 < this.player.y) {
                if (!this.enemy1.reload)
                    actions.shoot(this, -1, this.enemy1, 2000, 'enemy1Bullet', Math.floor(Math.random() * (51)) - 25, [this.box1], [{ element: this.player, func: () => { this.hit(this.scene.key) } }]);
                this.enemy1.anims.isPlaying = true;

            }
            else {
                this.enemy1.anims.isPlaying = false
            }
        }
        actions.batMoves(this.enemyBat,'')
        actions.batMoves(this.enemyBat2,'')

        // ----------- wygranko  i przejscie do nastepnej sceny ----------

        if (this.player.y <= 266 && this.player.x >= 910) {
            this.goToNextScene(this.scene.key, 'lvl3')
        }

    }
}


export default Level2;