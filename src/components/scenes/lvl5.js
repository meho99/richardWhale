import Phaser from 'phaser' // silnik gry
import actions from '../actions'; // akcje, animacje gry
import Characters from '../characters' // wszelkie postacie w grze


// ----- rozgrywka gry  -----

class Level5 extends Phaser.Scene {
    constructor(functions) {
        super({ key: 'lvl5', active: false })

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
        actions.enemyBat2Actions(this)
        actions.enemyKrokActions(this)
        actions.enemyTurtleActions(this)
    }

    create = () => {
        // ----- statyczne obrazki -----
        this.add.image(0, 0, 'background2').setOrigin(0) // tło
        this.add.image(970, 20, 'arrow1').setOrigin(0).setScale(1 / 3, 1 / 3) // trzałka

        // ----- obiekt gracza -----
        this.player = Characters.getPlayer(this, 40, 400, 'right')


        // ----- flakoniki z dodatkowym życiem/ wodą -----

        let lifeBottles = this.physics.add.staticGroup();
        lifeBottles.create(980, 122, 'lifeBottle').setOrigin(0);
        this.physics.add.overlap(this.player, lifeBottles, this.collectLife, null, this)

        // ----- przesówalne pudełka

        this.box1 = this.physics.add.sprite(400, 200, 'box').setOrigin(0)
        this.box1.body.collideWorldBounds = true; // ustawienie kolizji z krawędziami 
        this.box1.body.setBounce(0.5); // odepchniecie w poziomie
        this.box1.body.setMass(10) // nadanie masy pudełku

        // ----- przeciwnicy(chodzący na platformach) -----

        this.enemyTurtle = Characters.getEnemyTurtle(this, 500, 433, 'right'); // zółw
        this.enemyTurtle2 = Characters.getEnemyTurtle(this, 800, 93, 'right'); // zółw
        this.enemyTurtle3 = Characters.getEnemyTurtle(this, 200, 23, 'right'); // zółw
        this.enemy1= Characters.getEnemyChorse(this, 790, 100, 'left'); // szczelający koń=


        // ----- podstawa (ziemia ) i platformy (statyczne obiekty) -----

        this.add.sprite(512, 537, 'ground')
        this.add.sprite(200, 336, 'platform1')
        this.add.sprite(1120, 176, 'platform1')
        this.add.sprite(1030, 256, 'platform1')
        this.add.sprite(1200, 91, 'platform1')

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(512, 546, 'ground');
        this.platforms.create(200, 345, 'platform1');
        this.platforms.create(1120, 185, 'platform1');
        this.platforms.create(1030, 265, 'platform1');
        this.platforms.create(1200, 100, 'platform1');

        // ----- przeciwnicy (latający) -----

        this.enemyBat = Characters.getEnemyBat2(this, 600, 120, 'right') // nietoperz

        // ----- obiekt oblsugi klawiatury -----
        this.cursors = this.input.keyboard.createCursorKeys();


        // ----- kolizje -----

        this.physics.add.collider(this.player, this.platforms); // gracza z platformami
        this.physics.add.collider(this.enemyTurtle, this.platforms); // zółwia z platformami
        this.physics.add.collider(this.enemyTurtle2, this.platforms); // zółwia z platformami
        this.physics.add.collider(this.enemyTurtle3, this.platforms); // zółwia z platformami
        this.physics.add.collider(this.enemy1, this.platforms); // platformami z koniem
        actions.jumpOnTurtle(this.enemyTurtle,this.player, this); // swskakiwanie an zolwia

        actions.jumpOnTurtle(this.enemyTurtle2,this.player, this);
        actions.jumpOnTurtle(this.enemyTurtle3,this.player, this);

        this.physics.add.collider(this.box1, this.platforms); // pudełka z platformami
        this.physics.add.collider(this.box1, this.player, () => { this.box1.body.velocity.x = 0 }); // pudełka z graczem

        this.physics.add.overlap(this.player, this.enemyBat, () => { actions.batHit(this.enemyBat, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu nietoperza

    }

    update = () => {
        //  ---------- przesowanie obiektów ----------

        this.physics.world.overlap(this.player, this.enemyTurtle, () => { actions.moveElement(this.player, this.enemyTurtle) }, null, this)
        this.physics.world.overlap(this.player, this.enemyTurtle2, () => { actions.moveElement(this.player, this.enemyTurtle2) }, null, this)
        this.physics.world.overlap(this.player, this.enemyTurtle3, () => { actions.moveElement(this.player, this.enemyTurtle3) }, null, this)

        this.physics.world.overlap(this.player, this.box1, () => { actions.moveElement(this.player, this.box1) }, null, this)

        // ---------- dodatkowe poprawki zachowań elementów ----------

        if (!this.enemyTurtle.live) actions.slowDown(this.enemyTurtle, 2) // spowolnianie żólwia
        if (!this.enemyTurtle2.live) actions.slowDown(this.enemyTurtle2, 2) // spowolnianie żólwia
        if (!this.enemyTurtle3.live) actions.slowDown(this.enemyTurtle3, 2) // spowolnianie żólwia
        actions.slowDown(this.enemy1, 3) // spowolnianie trafionego przeciwnika


        actions.slowDown(this.box1, 2) // spowolnianie boxu

        // ---------- strzały gracza ----------

        if (this.cursors.space.isDown && !this.player.reload) {
            actions.shoot(this, this.player.direction, this.player, this.speed * 300, 'playerBullet', 0, [this.box1, this.platforms], [
                { element: this.enemyBat, func: () => { actions.hittedOpponent(this.enemyBat, this) } },
                { element: this.enemyTurtle, func: () => { actions.hittedTurtle(this.enemyTurtle, this) } },
                { element: this.enemyTurtle2, func: () => { actions.hittedTurtle(this.enemyTurtle2, this) } },
                { element: this.enemyTurtle3, func: () => { actions.hittedTurtle(this.enemyTurtle3, this) } },
                { element: this.enemy1, func: () => { actions.hittedOpponent(this.enemy1, this) } },

            ]);
        }

        // ---------- obsługa klawiatury i animacji gracza ----------

        actions.playerMovingAndAnimations(this.cursors, this.player, this.speed)

        // ---------- zachowanie przeciwników ----------
        if (this.enemy1.active === true) {
            if (this.enemy1.y < this.player.y) {
                if (!this.enemy1.reload)
                    actions.shoot(this, -1, this.enemy1, 2000, 'enemy1Bullet', Math.floor(Math.random() * (171)) + 185, [this.box1], [{ element: this.player, func: () => { this.hit(this.scene.key) } }]);
                this.enemy1.anims.isPlaying = true;

            }
            else {
                this.enemy1.anims.isPlaying = false
            }
        }


        actions.batMoves(this.enemyBat,2)
        actions.turtleMoves(this.player, this.enemyTurtle)
        actions.turtleMoves(this.player, this.enemyTurtle2)
        actions.turtleMoves(this.player, this.enemyTurtle3)


        // ----------- wygranko  i przejscie do nastepnej sceny ----------

        if (this.player.y <= 46 && this.player.x >= 910) {
            this.goToNextScene(this.scene.key, 'lvl6')
        }
        if(this.player.y> 455) this.player.y= 455 // aby nie wpadali w dolna platforme
        if(this.enemyTurtle.y> 431) this.enemyTurtle.y= 431
        if(this.enemyTurtle2.y> 431) this.enemyTurtle2.y= 431
        if(this.enemyTurtle3.y> 431) this.enemyTurtle3.y= 431
    }
}

export default Level5;