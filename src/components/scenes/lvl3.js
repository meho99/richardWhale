import Phaser from 'phaser' // silnik gry
import actions from '../actions'; // akcje, animacje gry
import Characters from '../characters' // wszelkie postacie w grze


// ----- rozgrywka gry  -----

class Level3 extends Phaser.Scene {
    constructor(functions) {
        super({ key: 'lvl3', active: false })

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
    }

    create = () => {
        // ----- statyczne obrazki -----
        this.add.image(0, 0, 'background1').setOrigin(0) // tło
        this.add.image(950, 20, 'arrow1').setOrigin(0).setScale(1 / 3, 1 / 3) // trzałka

        // ----- obiekt gracza -----
        this.player = Characters.getPlayer(this, 50, 400, 'right')

        // ----- flakoniki z dodatkowym życiem/ wodą -----

        let lifeBottles = this.physics.add.staticGroup();
        lifeBottles.create(870, 448, 'lifeBottle').setOrigin(0);
        this.physics.add.overlap(this.player, lifeBottles, this.collectLife, null, this)

        let lifeBottles1 = this.physics.add.staticGroup();
        lifeBottles.create(970, 448, 'lifeBottle').setOrigin(0);
        this.physics.add.overlap(this.player, lifeBottles1, this.collectLife, null, this)

        let lifeBottles2 = this.physics.add.staticGroup();
        lifeBottles.create(50, 128, 'lifeBottle').setOrigin(0);
        this.physics.add.overlap(this.player, lifeBottles2, this.collectLife, null, this)

        let waterBottles = this.physics.add.staticGroup();
        waterBottles.create(920, 444, 'waterBottle').setOrigin(0);
        this.physics.add.overlap(this.player, waterBottles, this.collectWater, null, this)

        // ----- przeciwnicy(chodzący na platformach) -----

        this.enemyKrok= Characters.getEnemyCrock(this,300, 446, 'right') // krokodyl
        this.enemyKrok2= Characters.getEnemyCrock(this,1000, 446, 'right') // krokodyl

        // ----- przesówalne pudełka

        // ----- podstawa (ziemia ) i platformy (statyczne obiekty) -----

        this.add.sprite(512, 537, 'ground')
        this.add.sprite(1050, 397, 'platform1')
        this.add.sprite(500, 286, 'platform1')
        this.add.sprite(-100,186, 'platform1')
        this.add.sprite(600,91, 'platform1')
        this.add.sprite(800,91, 'platform1')

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(512, 546, 'ground');
        this.platforms.create(1050, 406, 'platform1');
        this.platforms.create(500, 295, 'platform1');
        this.platforms.create(-100, 195, 'platform1');
        this.platforms.create(600, 100, 'platform1');
        this.platforms.create(800, 100, 'platform1');

        // ----- przeciwnicy (latający) -----

        this.enemyBat= Characters.getEnemyBat(this, 900, 200, 'left') // nietoperz
        this.enemyBat2= Characters.getEnemyBat(this, 100, 200, 'left') // nietoperz 2
        this.enemyBat3= Characters.getEnemyBat(this, 600, 0, 'right') // nietoperz
        this.enemyBat4= Characters.getEnemyBat(this, 600, 0, 'left') // nietoperz 2

        // ----- obiekt oblsugi klawiatury -----
        this.cursors = this.input.keyboard.createCursorKeys();


        // ----- kolizje -----

        this.physics.add.collider(this.player, this.platforms); // gracza z platformami

        this.physics.add.overlap(this.player, this.enemyBat, () => { actions.batHit(this.enemyBat, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu nietoperza
        this.physics.add.overlap(this.player, this.enemyBat2, () => { actions.batHit(this.enemyBat2, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu nietoperza
        this.physics.add.overlap(this.player, this.enemyBat3, () => { actions.batHit(this.enemyBat3, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu nietoperza
        this.physics.add.overlap(this.player, this.enemyBat4, () => { actions.batHit(this.enemyBat4, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu nietoperza
        this.physics.add.overlap(this.player, this.enemyKrok, () => { actions.batHit(this.enemyKrok, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu krokodyla
        this.physics.add.overlap(this.player, this.enemyKrok2, () => { actions.batHit(this.enemyKrok2, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu krokodyla

    }

    update = () => {
        //  ---------- przesowanie obiektów ----------



        // ---------- dodatkowe poprawki zachowań elementów ----------


        this.physics.world.overlap(this.player, this.lava, () => { this.hit(this.scene.key); this.player.x = 100; this.player.y = 400 }) // toniecie w lawie 


        // ---------- strzały gracza ----------

        if (this.cursors.space.isDown && !this.player.reload) {
            actions.shoot(this, this.player.direction, this.player, this.speed * 300, 'playerBullet', 0, [this.platforms], [
                { element: this.enemyBat, func: () => { actions.hittedOpponent(this.enemyBat, this) } },
                { element: this.enemyBat2, func: () => { actions.hittedOpponent(this.enemyBat2, this) }},
                { element: this.enemyBat3, func: () => { actions.hittedOpponent(this.enemyBat3, this) }},
                { element: this.enemyBat4, func: () => { actions.hittedOpponent(this.enemyBat4, this) }},
                { element: this.enemyKrok, func: () => { actions.hittedOpponent(this.enemyKrok, this) }},
                { element: this.enemyKrok2, func: () => { actions.hittedOpponent(this.enemyKrok2, this) }},
            ]);
        }

        // ---------- obsługa klawiatury i animacji gracza ----------

        actions.playerMovingAndAnimations(this.cursors, this.player, this.speed)

        // ---------- zachowanie przeciwników ----------


        actions.batMoves(this.enemyBat,'')
        actions.batMoves(this.enemyBat2,'')
        actions.batMoves(this.enemyBat3,'')
        actions.batMoves(this.enemyBat4,'')
        actions.kroksMoves(this.player, this.enemyKrok)
        actions.kroksMoves(this.player, this.enemyKrok2)

        // ----------- wygranko  i przejscie do nastepnej sceny ----------

        if (this.player.y <= 46 && this.player.x >= 910) {
            this.goToNextScene(this.scene.key, 'lvl4')
        }

    }
}

export default Level3;