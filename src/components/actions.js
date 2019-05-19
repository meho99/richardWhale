// -------------------------------------------    akcje, animacje w grze ------------------------------------------------

const actions = {

    // -------------------------     obsługa klawiatury i animacji gracza     -------------------------

    playerMovingAndAnimations(cursors, player, speed) {
        if (cursors.left.isDown) {
            player.anims.isPlaying = true; // włączenie wykonywania animacji
            player.body.velocity.x = -90 * speed;

            if (player.direction != -1 || player.anims.isPlaying == false) // przy zmianie kierunku
            {
                player.anims.play('playerLeft'); // włączenie nowej animacji
                player.direction = -player.direction // zmiana kierunku
            }
        }
        else if (cursors.right.isDown) {
            player.anims.isPlaying = true;// włączenie wykonywania animacji
            player.body.velocity.x = 90 * speed;
            if (player.direction != 1) // przy zmianie kierunku
            {
                player.anims.play('playerRight');// włączenie nowej animacji
                player.direction = -player.direction // zmiana kierunku
            }
        }
        else {
            player.body.velocity.x = 0; // oby nie odpychaly go inne elementy
            player.anims.isPlaying = false; // blokada wykonywania animacji gdy nie trzymamy strzałek
        }

        if (cursors.up.isDown && player.body.touching.down) { // skok
            player.setVelocityY(-150 * speed);

        }

        if (player.body.velocity.y > 3 || player.body.velocity.y < -3) player.anims.isPlaying = false; // blokada wykonywania animacji gdy jest w powietrzu

    },



    // -------------------------     przesowanie elementu przez gracza     -------------------------

    moveElement(player, element) {
        if (player.y + player.height - 5 >= element.y && player.y < element.y + element.height * element.scaleY) {
            if (player.x < element.x) element.x = player.x + player.width
            else element.x = player.x - element.width * element.scaleX

        }
    },


    // -------------------------     spowalnianie  i zatrzymanie elementu     -------------------------

    slowDown(element, speed) {
        if (element.active == true) {
            let velocityX = element.body.velocity.x;

            if (velocityX > 0) velocityX -= speed; // spowolnianie
            else if ((velocityX < 0)) velocityX += speed

            if (velocityX > -5 && velocityX < 5) velocityX = 0; // kompletne zatrzymanie

            element.body.velocity.x = velocityX
        }

    },



    // -------------------------     strzał     -------------------------

    shoot: (scene, direction, element, speed, img, angle, defaultCollisionElements, diffrentCollisionElements) => {
        element.reload = true;  // blokada nastepnego strzału

        let bullet = scene.physics.add.sprite(element.x + element.width / 2, element.y + element.height / 2, img).setScale(1 / 7, 1 / 7) // tworze nowy pocisk
        bullet.body.allowGravity = false; // wyłaczam jego grawitację
        bullet.body.setMass(10)

        // ----- kolizje pocisku -----

        defaultCollisionElements.map((i) => {
            scene.physics.add.collider(i, bullet, () => { bullet.destroy() })
        })

        diffrentCollisionElements.map((i) => {
            scene.physics.add.collider(i.element, bullet, () => { bullet.destroy(); i.func() })
        })

        // -------- kierunek i predkosc strzału ------

        if (direction == 1) // strzał w prawo
        {
            bullet.x = element.x + 7 * element.width / 8 // suatwienie kulki
            bullet.body.setVelocityX(scene.speed * 250) // predkosc strzału
        }
        else if (direction == -1) // strzał w lewo
        {
            bullet.x = element.x + 1 * element.width / 8
            bullet.body.setVelocityX(-scene.speed * 250) // predkosc strzału
        }
        // ----- strzał pod kątem -----
        {
            bullet.setVelocityY(angle)
        }

        setTimeout(() => { // cza przeładowywania
            element.reload = false;
        }, speed)
    },



    // -------------------------     strzał w przeciwnika     -------------------------

    hittedOpponent(opponent, scene) {
        opponent.lifes -= 1;
        if (opponent.lifes <= 0) // zgon
        {
            opponent.data = null;
            var dead = scene.add.sprite(opponent.x + opponent.width / 3, opponent.y + 20, 'skull').setOrigin(0)
            dead.setScale(opponent.width / dead.width / 2, opponent.height / dead.height / 2);
            var zanikanie = setInterval(() => {  // zanikanie czaszki
                dead.alpha -= 0.1
            }, 100)
            opponent.destroy();
            setTimeout(() => { // usuniecie czaszki
                clearInterval(zanikanie)
                dead.destroy()
            }, 800)

        }
    },

    // ------------------------ strzał w zólwia

    hittedTurtle(opponent, scene) {
        opponent.lifes -= 1;
        if (opponent.lifes <= 0) // zgon
        {
            opponent.body.setBounce(0.6); // odepchniecie w poziomie
            opponent.live = false;
            opponent.body.setMass(10)// nadanie masy
            opponent.anims.play('turtleDead')
        }
    },

    // ------------------------- obsługa animacja lotu nietoperzy, chodu krokodyla i uderzenia w gracza -------------------------

    batMoves(bat,version) {
        if (bat.active === true) {
            if (bat.body.velocity.x > 0) // obługa animacji nietoperza
            {
                if (bat.anims.currentAnim.key != 'bat'+version+'Left')
                    bat.anims.play('bat'+version+'Left')
            }
            else {
                if (bat.anims.currentAnim.key != 'bat'+version+'Right')
                    bat.anims.play('bat'+version+'Right')
            }
        }

    },

    bossMoves(boss) {
        if (boss.active === true) {
            //console.log(boss.x)
            //  
            if (boss.x< 1) // obługa animacji bossa
            {
                if (boss.anims.currentAnim.key != 'bossLeft')
                {
                    boss.anims.play('bossLeft');
                    boss.body.velocity.x=550;

                }     
            }
            else if(boss.x> 793) {
                if (boss.anims.currentAnim.key != 'bossRight')
                {
                    boss.anims.play('bossRight');
                    boss.body.velocity.x=-550;

                }
                    
            }
        }

    },

    kroksMoves(player, krok) { // obracanie sie krokodyla
        if (krok.active === true) {
            if (player.x + player.width / 2 <= krok.x + krok.width / 2) {

                if (krok.anims.currentAnim.key != 'kroksLeft') {
                    setTimeout(() => { // opuznienie obracania sie
                        if (krok.active === true) {
                            krok.anims.play('kroksLeft')
                            krok.body.velocity.x = -115
                        }
                    }, 550)
                }
            }

            else {
                if (krok.anims.currentAnim.key != 'kroksRight') {
                    setTimeout(() => { // opuznienie obracania sie
                        if (krok.active === true) {
                            krok.anims.play('kroksRight')
                            krok.body.velocity.x = 115
                        }
                    }, 550)
                }
            }
        }

    },

    turtleMoves(player, turtle) // obracanie sie łółwia
    {
        if (turtle.active && turtle.live) {
            if (player.x + player.width / 2 <= turtle.x + turtle.width / 2) {

                if (turtle.anims.currentAnim.key != 'turtleLeft') {
                    setTimeout(() => { // opuznienie obracania sie
                        if (turtle.active) {
                            turtle.anims.play('turtleLeft')
                            turtle.body.velocity.x = -50
                        }
                    }, 550)
                }
            }

            else {
                if (turtle.anims.currentAnim.key != 'turtleRight') {
                    setTimeout(() => { // opuznienie obracania sie
                        if (turtle.active) {
                            turtle.anims.play('turtleRight')
                            turtle.body.velocity.x = 50
                        }
                    }, 550)
                }
            }
        }
    },

    batHit(bat, func) { // blokada kolejnego uderzenia w gracza
        if (bat.block == false) {
            bat.block = true;
            func();
            setTimeout(() => {
                bat.block = false;
            }, 1000)
        }

    },

    // ---------- wskakiwanie na zolwia ----------

    jumpOnTurtle(turtle, player, scene) {
        scene.physics.add.collider(player, turtle, () => {// wyskakiwanie na żółwia
            turtle.body.velocity.x = 0;
            if (player.y + player.height === turtle.y + turtle.height && turtle.live) {
                actions.batHit(turtle, () => {
                    scene.hit(scene.scene.key)
                })
            }
        })
    },


    // -------------------------      animacje     -------------------------

    // ----- gracza ----- 
    playerAnimations(scene) {
        scene.anims.create({ // chodzenie w prawo
            key: 'playerRight',
            frameRate: 5,
            repeat: -1, // forever
            frames: scene.anims.generateFrameNumbers('player', {
                frames: [2, 3]
            })
        });
        scene.anims.create({ // chodzenie w lewo
            key: 'playerLeft',
            frameRate: 5,
            repeat: -1, // forever
            frames: scene.anims.generateFrameNumbers('player', {
                frames: [0, 1]
            })
        });
        scene.anims.create({ // stanie w prawo
            key: 'playerStandRight',
            frameRate: 5,
            repeat: -1, // forever
            frames: scene.anims.generateFrameNumbers('player', {
                frames: [2]
            })
        });
        scene.anims.create({ // stanie w lewo
            key: 'playerStandLeft',
            frameRate: 5,
            repeat: -1, // forever
            frames: scene.anims.generateFrameNumbers('player', {
                frames: [0]
            })
        });
    },

    // ----- przeciwników -----
    enemy1Animation(scene) // przeciwnik 1 strzelający
    {
        scene.anims.create({ // chodzenie w prawo
            key: 'enemy1Shoot',
            frameRate: 1,
            repeat: -1, // forever
            frames: scene.anims.generateFrameNumbers('enemy1', {
                frames: [0, 1]
            })
        });
    },
    enemy2Actions(scene) // przeciwnik 2 (nietoperz)
    {
        scene.anims.create({ // chodzenie w prawo
            key: 'batLeft',
            frameRate: 10,
            repeat: -1, // forever
            frames: scene.anims.generateFrameNumbers('bat', {
                frames: [3, 4, 5, 4]
            })
        });
        scene.anims.create({ // chodzenie w prawo
            key: 'batRight',
            frameRate: 10,
            repeat: -1, // forever
            frames: scene.anims.generateFrameNumbers('bat', {
                frames: [0, 1, 2, 1]
            })
        });
    },
    enemyBat2Actions(scene) { // nietoper 2
        scene.anims.create({ // chodzenie w prawo
            key: 'bat2Left',
            frameRate: 15,
            repeat: -1, // forever
            frames: scene.anims.generateFrameNumbers('bat2', {
                frames: [3, 4, 5, 4]
            })
        });
        scene.anims.create({ // chodzenie w prawo
            key: 'bat2Right',
            frameRate: 15,
            repeat: -1, // forever
            frames: scene.anims.generateFrameNumbers('bat2', {
                frames: [0, 1, 2, 1]
            })
        });
    },
    enemyKrokActions(scene) {
        scene.anims.create({ // chodzenie w prawo
            key: 'kroksLeft',
            frameRate: 5,
            repeat: -1, // forever
            frames: scene.anims.generateFrameNumbers('kroks', {
                frames: [2, 3]
            })
        });
        scene.anims.create({ // chodzenie w prawo
            key: 'kroksRight',
            frameRate: 5,
            repeat: -1, // forever
            frames: scene.anims.generateFrameNumbers('kroks', {
                frames: [0, 1]
            })
        });
    },

    enemyTurtleActions(scene) {
        scene.anims.create({ // chodzenie w prawo
            key: 'turtleLeft',
            frameRate: 3,
            repeat: -1, // forever
            frames: scene.anims.generateFrameNumbers('turtle', {
                frames: [0, 1]
            })
        });
        scene.anims.create({ // chodzenie w prawo
            key: 'turtleRight',
            frameRate: 3,
            repeat: -1, // forever
            frames: scene.anims.generateFrameNumbers('turtle', {
                frames: [2, 3]
            })
        });
        scene.anims.create({ // chodzenie w prawo
            key: 'turtleDead',
            frameRate: 3,
            repeat: -1, // forever
            frames: scene.anims.generateFrameNumbers('turtle', {
                frames: [4]
            })
        });
    },

    enemyBossActions(scene) {
        scene.anims.create({ // chodzenie w prawo
            key: 'bossRight',
            frameRate: 3,
            repeat: -1, // forever
            frames: scene.anims.generateFrameNumbers('boss', {
                frames: [0, 1]
            })
        });
        scene.anims.create({ // chodzenie w prawo
            key: 'bossLeft',
            frameRate: 3,
            repeat: -1, // forever
            frames: scene.anims.generateFrameNumbers('boss', {
                frames: [2, 3]
            })
        });
        scene.anims.create({ // chodzenie w prawo
            key: 'turtleDead',
            frameRate: 3,
            repeat: -1, // forever
            frames: scene.anims.generateFrameNumbers('turtle', {
                frames: [4]
            })
        });
    }
}

export default actions;