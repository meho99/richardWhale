import Phaser from 'phaser' // silnik gry
import actions from '../actions'; // akcje, animacje gry
import Characters from '../characters' // wszelkie postacie w grze


// ----- rozgrywka gry  -----

class Level4 extends Phaser.Scene {
    constructor(functions) {
        super({ key: 'lvl4', active: false })

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
        actions.enemyKrokActions(this)
        actions.enemyTurtleActions(this)
    }

    create = () => {
        // ----- statyczne obrazki -----
        this.add.image(0, 0, 'background2').setOrigin(0) // tło
        this.add.image(950, 20, 'arrow1').setOrigin(0).setScale(1 / 3, 1 / 3) // trzałka

        // ----- obiekt gracza -----
        this.player = Characters.getPlayer(this, 50, 400, 'right')


        // ----- flakoniki z dodatkowym życiem/ wodą -----

        let waterBottles = this.physics.add.staticGroup();
        waterBottles.create(60, 140, 'waterBottle').setOrigin(0);
        this.physics.add.overlap(this.player, waterBottles, this.collectWater, null, this)

        // ----- przesówalne pudełka

        this.box1 = this.physics.add.sprite(400, 200, 'box').setOrigin(0)
        this.box1.body.collideWorldBounds = true; // ustawienie kolizji z krawędziami 
        this.box1.body.setBounce(0.5); // odepchniecie w poziomie
        this.box1.body.setMass(10) // nadanie masy pudełku

        // ----- przeciwnicy(chodzący na platformach) -----

        this.enemyKrok = Characters.getEnemyCrock(this, 1000, 446, 'right') // krokodyl
        this.enemyTurtle = Characters.getEnemyTurtle(this, 600, 433, 'right'); // zółw

        // ----- podstawa (ziemia ) i platformy (statyczne obiekty) -----

        this.add.sprite(512, 537, 'ground')
        this.add.sprite(450, 336, 'platform1')
        this.add.sprite(-100, 196, 'platform1')
        this.add.sprite(1000, 196, 'platform1')
        this.add.sprite(1100, 91, 'platform1')

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(512, 546, 'ground');
        this.platforms.create(450, 345, 'platform1');
        this.platforms.create(-100, 205, 'platform1');
        this.platforms.create(1000, 205, 'platform1');
        this.platforms.create(1100, 100, 'platform1');

        // ----- przeciwnicy (latający) -----

        this.enemyBat = Characters.getEnemyBat(this, 600, 120, 'right') // nietoperz
        this.enemyBat2 = Characters.getEnemyBat(this, 600,120, 'left') // nietoperz 2

        // ----- obiekt oblsugi klawiatury -----
        this.cursors = this.input.keyboard.createCursorKeys();


        // ----- kolizje -----

        this.physics.add.collider(this.player, this.platforms); // gracza z platformami
        this.physics.add.collider(this.enemyTurtle, this.platforms); // zółwia z platformami

        actions.jumpOnTurtle(this.enemyTurtle,this.player, this); // wskakiwanie na zolwia

        this.physics.add.collider(this.box1, this.platforms); // pudełka z platformami
        this.physics.add.collider(this.box1, this.player, () => { this.box1.body.velocity.x = 0 }); // pudełka z graczem

        this.physics.add.overlap(this.player, this.enemyBat, () => { actions.batHit(this.enemyBat, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu nietoperza
        this.physics.add.overlap(this.player, this.enemyBat2, () => { actions.batHit(this.enemyBat2, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu nietoperza
        this.physics.add.overlap(this.player, this.enemyKrok, () => { actions.batHit(this.enemyKrok, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu krokodyla
        this.physics.add.overlap(this.player, this.enemyKrok, () => { actions.batHit(this.enemyKrok, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu krokodyla

    }

    update = () => {
        //  ---------- przesowanie obiektów ----------

        this.physics.world.overlap(this.player, this.enemyTurtle, () => { actions.moveElement(this.player, this.enemyTurtle) }, null, this)
        this.physics.world.overlap(this.player, this.box1, () => { actions.moveElement(this.player, this.box1) }, null, this)

        // ---------- dodatkowe poprawki zachowań elementów ----------

        if (!this.enemyTurtle.live) actions.slowDown(this.enemyTurtle, 2) // spowolnianie żólwia
        actions.slowDown(this.box1, 2) // spowolnianie boxu

        // ---------- strzały gracza ----------

        if (this.cursors.space.isDown && !this.player.reload) {
            actions.shoot(this, this.player.direction, this.player, this.speed * 300, 'playerBullet', 0, [this.box1, this.platforms], [
                { element: this.enemyBat, func: () => { actions.hittedOpponent(this.enemyBat, this) } },
                { element: this.enemyBat2, func: () => { actions.hittedOpponent(this.enemyBat2, this) } },
                { element: this.enemyKrok, func: () => { actions.hittedOpponent(this.enemyKrok, this) } },
                { element: this.enemyTurtle, func: () => { actions.hittedTurtle(this.enemyTurtle, this) } },

            ]);
        }

        // ---------- obsługa klawiatury i animacji gracza ----------

        actions.playerMovingAndAnimations(this.cursors, this.player, this.speed)

        // ---------- zachowanie przeciwników ----------


        actions.batMoves(this.enemyBat,'')
        actions.batMoves(this.enemyBat2,'')
        actions.kroksMoves(this.player, this.enemyKrok)
        actions.turtleMoves(this.player, this.enemyTurtle)


        // ----------- wygranko  i przejscie do nastepnej sceny ----------

        if (this.player.y <= 46 && this.player.x >= 910) {
            this.goToNextScene(this.scene.key, 'lvl5')
        }

    }
}

export default Level4;