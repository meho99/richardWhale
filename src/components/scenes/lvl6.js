import Phaser from 'phaser' // silnik gry
import actions from '../actions'; // akcje, animacje gry
import Characters from '../characters' // wszelkie postacie w grze


// ----- rozgrywka gry  -----

class Level6 extends Phaser.Scene {
    constructor(functions) {
        super({ key: 'lvl6', active: false })

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

        actions.enemyBat2Actions(this)
        actions.enemyBossActions(this)
    }

    create = () => {
        // ----- statyczne obrazki -----
        this.add.image(0, 0, 'background2').setOrigin(0) // tło
        this.add.image(970, 20, 'arrow1').setOrigin(0).setScale(1 / 3, 1 / 3) // trzałka

        // ----- obiekt gracza -----
        this.player = Characters.getPlayer(this, 340, 200, 'right')


        // ----- flakoniki z dodatkowym życiem/ wodą -----

        // -----  pudełka

        this.box = this.physics.add.staticGroup() // grupa pudełek
        this.box.create(400, 460, 'box')
        this.box.create(480, 460, 'box')
        this.box.create(560, 460, 'box')
        this.box.create(440, 390, 'box')
        this.box.create(520, 390, 'box')
        this.box.create(480, 320, 'box')


        // ----- przeciwnicy(chodzący na platformach) -----
        this.boss = Characters.getEnemyBoss(this, 700, 300, 'left')

        if(this.superAtack) {clearInterval(this.superAtack)}

        // ----- pojawianie nietoperza -----

        this.superAtack = setInterval(() => { // pętla zatrzymująca co dany czas na chwile boosa i pojawiająca nowe nietoperze

            let actualVelocity = this.boss.body.velocity.x;
            this.boss.body.velocity.x = 0;

            setTimeout(() => { // po jakims czasie wrocenie do poruszania sie
                if(this.boss.active== true)
                    this.boss.body.velocity.x = actualVelocity;
                 // ----- odrodzenie nietoperzy -----
                if(!this.enemyBat.active)
                {
                    this.enemyBat = Characters.getEnemyBat2(this, 700, 210, 'left') // nietoperz
                    this.physics.add.overlap(this.player, this.enemyBat, () => { actions.batHit(this.enemyBat, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu nietoperza
                }
                if(!this.enemyBat2.active)
                {
                    this.enemyBat2 = Characters.getEnemyBat2(this, 200, 290, 'right') // nietoperz
                    this.physics.add.overlap(this.player, this.enemyBat2, () => { actions.batHit(this.enemyBat2, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu nietoperza
                }
            }, 2000)

        }, 15000)

        // ----- podstawa (ziemia ) i platformy (statyczne obiekty) -----

        this.add.sprite(512, 537, 'ground')

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(512, 546, 'ground');


        // ----- przeciwnicy (latający) -----

        this.enemyBat = Characters.getEnemyBat2(this, 500, 210, 'left') // nietoperz
        this.enemyBat2 = Characters.getEnemyBat2(this, 300, 290, 'right') // nietoperz

        // ----- obiekt oblsugi klawiatury -----
        this.cursors = this.input.keyboard.createCursorKeys();


        // ----- kolizje -----

        this.physics.add.collider(this.player, this.platforms); // gracza z platformami
        this.physics.add.collider(this.boss, this.platforms); // bossa z platformami


        this.physics.add.collider(this.player, this.box); // pudełka z platformami



        this.physics.add.overlap(this.player, this.enemyBat, () => { actions.batHit(this.enemyBat, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu nietoperza
        this.physics.add.overlap(this.player, this.enemyBat2, () => { actions.batHit(this.enemyBat2, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu nietoperza

        this.physics.add.overlap(this.player, this.boss, () => { actions.batHit(this.boss, () => { this.hit(this.scene.key) }) }) // utrata zycia po dodtknieciu bossa

    }

    update = () => {
        //  ---------- przesowanie obiektów ----------


        // ---------- dodatkowe poprawki zachowań elementów ----------


        // ---------- strzały gracza ----------

        if (this.cursors.space.isDown && !this.player.reload) {
            actions.shoot(this, this.player.direction, this.player, this.speed * 300, 'playerBullet', 0, [this.platforms], [
                { element: this.enemyBat, func: () => { actions.hittedOpponent(this.enemyBat, this) } },
                { element: this.enemyBat2, func: () => { actions.hittedOpponent(this.enemyBat2, this) } },
                { element: this.boss, func: () => { actions.hittedOpponent(this.boss, this) } },


            ]);
        }

        // ---------- obsługa klawiatury i animacji gracza ----------

        actions.playerMovingAndAnimations(this.cursors, this.player, this.speed)

        // ---------- zachowanie przeciwników ----------

        actions.batMoves(this.enemyBat, 2)
        actions.batMoves(this.enemyBat2, 2)
        actions.bossMoves(this.boss, 2)

        // ----------- wygranko  i przejscie do nastepnej sceny ----------

        if (!this.boss.active) {
            if(this.superAtack) {clearInterval(this.superAtack)}

            this.goToNextScene(this.scene.key, 'win')

            
        }
        if (this.player.y > 455) this.player.y = 455 // aby nie wpadali w dolna platforme
    }
}

export default Level6;