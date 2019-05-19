// ------------------- gracz, przeciwnicy(wszytskie postacie w grze) ----------------------


const Characters = {

    // ---------- gracz ----------

    getPlayer: (scene, x, y, direction) => {
        let player = scene.physics.add.sprite(x, y, 'player').setOrigin(0); // obiekt gracza dodany do sceny
        player.body.collideWorldBounds = true; // ustawienie kolizji z krawędziami 
        player.reload = false; // blokada strzału 
        player.body.setBounce(0.05); // odepchniecie w poziomie
        if (direction === 'right')// kierunek
        {
            player.direction = 1// kierunek gracza (1- w prawo, -1 - w lewo) 
            player.anims.play('playerRight'); // pierwsza domysla animacja
        }
        else {
            player.direction = -1// kierunek gracza (1- w prawo, -1 - w lewo) 
            player.anims.play('playerLeft'); // pierwsza domysla animacja
        }

        return player;
    },


    // ---------- szczelający koń ----------

    getEnemyChorse: (scene, x, y, direction) => {
        let enemy = scene.physics.add.sprite(x, y, 'enemy1').setOrigin(0); // obiekt gracza
        enemy.lifes = 2 // ilość żyć przeciwkina
        enemy.body.collideWorldBounds = true; // ustawienie kolizji z krawędziami 
        enemy.body.setBounce(0.05); // odepchniecie w poziomie
        enemy.body.setMass(40)// nadanie masy 
        enemy.reload = false; // blokada strzału 
        enemy.anims.play('enemy1Shoot')

        return enemy;
    },


    // ----------- nietoperz ----------

    getEnemyBat: (scene, x, y, direction) => {
        let enemyBat = scene.physics.add.sprite(x, y, 'bat').setOrigin(0); // nietoperz
        enemyBat.lifes = 1; // ilość żyć
        enemyBat.body.collideWorldBounds = true; // ustawienie kolizji z krawędziami 
        enemyBat.body.allowGravity = false; // aby nie spadał
        enemyBat.body.setBounce(1); // odepchniecie w poziomie
        enemyBat.block = false;
        if (direction === 'left') {
            enemyBat.anims.play('batLeft')
            enemyBat.body.velocity.x = 150;
        }
        else {
            enemyBat.anims.play('batRight')
            enemyBat.body.velocity.x = -150;
        }

        return enemyBat;
    },

    // ----------- nietoperz 2 ----------

    getEnemyBat2: (scene, x, y, direction) => {
        let enemyBat = scene.physics.add.sprite(x, y, 'bat2').setOrigin(0); // nietoperz
        enemyBat.lifes = 1; // ilość żyć
        enemyBat.body.collideWorldBounds = true; // ustawienie kolizji z krawędziami 
        enemyBat.body.allowGravity = false; // aby nie spadał
        enemyBat.body.setBounce(1); // odepchniecie w poziomie
        enemyBat.block = false;
        if (direction === 'left') {
            enemyBat.anims.play('bat2Left')
            enemyBat.body.velocity.x = 300;
        }
        else {
            enemyBat.anims.play('bat2Right')
            enemyBat.body.velocity.x = -300;
        }

        return enemyBat;
    },

    // ---------- krokodyl ----------

    getEnemyCrock: (scene, x, y, direction) => {
        let enemy = scene.physics.add.sprite(x, y, 'kroks').setOrigin(0); // nietoperz
        enemy.lifes = 3; // ilość żyć
        enemy.body.collideWorldBounds = true; // ustawienie kolizji z krawędziami 
        enemy.body.allowGravity = false; // aby nie spadał
        enemy.body.setBounce(0); // odepchniecie w poziomie
        enemy.body.setMass(280)// nadanie masy 
        enemy.block = false;
        if (direction === 'left') {
            enemy.anims.play('kroksLeft')
            enemy.body.velocity.x = -115;
        }
        else {
            enemy.anims.play('kroksRight')
            enemy.body.velocity.x = 115;
        }

        return enemy;
    },

    // --------- zółw --------

    getEnemyTurtle: (scene, x, y, direction) => {
        let enemy = scene.physics.add.sprite(x, y, 'turtle').setOrigin(0); // nietoperz
        enemy.lifes = 5; // ilość żyć
        enemy.body.collideWorldBounds = true; // ustawienie kolizji z krawędziami 
        enemy.body.setBounce(0); // odepchniecie w poziomie
        enemy.body.setMass(200)// nadanie masy 
        enemy.block = false;
        enemy.live = true;
        if (direction === 'left') {
            enemy.anims.play('turtleLeft')
            enemy.body.velocity.x = -50;
        }
        else {
            enemy.anims.play('turtleRight')
            enemy.body.velocity.x = 50;
        }

        return enemy;
    },

    // ---------- BOSS ----------

    getEnemyBoss: (scene, x, y, direction) => {
        let enemy = scene.physics.add.sprite(x, y, 'boss').setOrigin(0); // nietoperz
        enemy.lifes = 9; // ilość żyć
        enemy.body.collideWorldBounds = true; // ustawienie kolizji z krawędziami 
        enemy.body.setBounce(0); // odepchniecie w poziomie
        enemy.body.setMass(200)// nadanie masy 
        enemy.block = false;
        enemy.live = true;
        if (direction === 'left') {
            enemy.anims.play('bossLeft')
            enemy.body.velocity.x = 100;
        }
        else {
            enemy.anims.play('bossRight')
            enemy.body.velocity.x = -100;
        }
        

        return enemy;
    }
}
export default Characters;