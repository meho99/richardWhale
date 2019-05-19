import React, { Component } from 'react';
import Phaser from 'phaser' // silnik gry
import MapLevel from './levelComponent'
import './Game.css'

// ----- import scen gry -----
import Load from './scenes/load'
import Menu from './scenes/menu'
import Win from './scenes/win'
import Level1 from './scenes/lvl1'
import Level2 from './scenes/lvl2';
import Level3 from './scenes/lvl3';
import Level4 from './scenes/lvl4';
import Level5 from './scenes/lvl5';
import Level6 from './scenes/lvl6';

import lifeBottleImage from '../sprites/life.img' // obrazek serca
import waterBottleImage from '../sprites/waterBottle.img' // obrazek wody

// ----- głowny component gry -----

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {

            // ----- configuracja gry -----
            config: {
                type: Phaser.AUTO,
                width: 1024,
                height: 576,
                parent: 'phaser',
                backgroundColor: '#132639',
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 400 }
                    }
                },
                // ----- tworzenie scen gry -----
                scene: [
                    new Load(this.functions),
                    new Menu(this.functions),
                    new Level1(this.functions),
                    new Level2(this.functions),
                    new Level3(this.functions),
                    new Level4(this.functions),
                    new Level5(this.functions),
                    new Level6(this.functions),
                    new Win(this.functions),
                ]


            },

            lifes: 3, // aktualna ilosc 
            startLifes: 3, // poczatkowa ilosc

            water: 10,
            maxWater: 10,
            startWater: 10,

            level: -2, // aktualny level
            allLevels: 6, // ilosc wszystkich leveli

            actualScene: 'load',
        };


    }


    // ------ funckje wykonywane podczas gry -----

    functions = {

        // ----- funkcja zmiany scen -----

        goToNextScene: (from, to) => {
            console.log(from, to)

            if (this.reducing || to=='lvl6') clearInterval(this.reducing) // usuniecie ubywania wody

            var sceneA = this.game.scene.getScene(from);
            var sceneB = this.game.scene.getScene(to);
            this.setState({ actualScene: to, level: this.state.level + 1, water: this.state.maxWater }) // utawiam aktualna scenę, jesli zebralismy flakoniki z zyciem/woda w nastepnym lewelu zaczynamy z wieksza iloscia
            if(to!='lvl6')this.functions.reduceWater(this.state.actualScene)
            if(from === 'lvl6') // zaczęcie od nowa
            {
                this.setState({ level: -1 });
                this.setState({ lifes: this.state.startLifes })
                this.setState({ water: this.state.startWater, maxWater: this.state.startWater })
            }
            sceneB.scene.restart()
            sceneA.scene.switch(to)

            return this.game.scene;
        },


        // ----- utrata jednego życia -----

        hit: (scene) => {
            var lifex = this.state.lifes;
            this.setState({ lifes: lifex - 1 })
            if (lifex == 1) // restart levelu
            {
                clearInterval(this.reducing)
                this.functions.goToNextScene(scene, 'lvl1') // zaczecie od 1 poziomu
                this.setState({ level: 0 });
                this.setState({ lifes: this.state.startLifes })
                this.setState({ water: this.state.startWater, maxWater: this.state.startWater })
            }
        },

        // ----- zmniejszanie ilosci pozostałej wody -----

        reduceWater: (scene) => {

            this.reducing = setInterval(() => {
                var water = this.state.water;
                this.setState({ water: water - 1 })
                if (this.state.water == 0)// restart levelu
                {
                    clearInterval(this.reducing)
                    this.game.scene.getScene(scene).scene.restart();
                    this.functions.reduceWater(scene) // ponowne włączenie obywania wody
                    this.setState({ water: this.state.startWater, maxWater: this.state.startWater })
                    this.functions.hit(scene)
                }
            }, 3500)

        },

        // ----- zebranie butelki z zyciem i wodą  -----

        collectLife: (player, bottle) => {
            var lifex = this.state.lifes;
            this.setState({ lifes: lifex + 1 })
            bottle.destroy();
        },
        collectWater: (player, bottle) => {
            var water = this.state.water;
            var maxWater = this.state.maxWater;
            this.setState({ maxWater: maxWater + 1, water: water + 1 })
            bottle.destroy();
        }

    }




    componentDidMount = () => {
        // ----- główny obiekt gry -----

        this.game = new Phaser.Game(this.state.config);

        // ----- załadowanie pierwszej sceny (ładowanie) -----

        this.game.scene.start('load')

    }


    render() {
        var lifes = [];
        for (let i = 0; i < this.state.lifes; i++) lifes.push(<img key={i} src={lifeBottleImage} />)
        var water = [];
        for (let i = 0; i < this.state.water; i++)water.push(<img className='lifes' key={i } src={waterBottleImage} />)

        return (
            <div className="phaserContainer" style={styles.gameDiv}>
                <div style={{ flexDirection: 'row', display: 'flex' }}>
                    <div ref='lifes' style={styles.lifesDiv}>
                        <p>
                            LIFES:
                    </p>
                        <div  >
                            {lifes}

                        </div>
                    </div>
                    <div id='phaser' style={{ border: '5px solid white' }}></div>
                    <div ref='lifes' style={styles.waterDiv}>
                        <p>
                            WATER:
                    </p>
                        <div>
                            {water}
                        </div>
                    </div>
                </div>
                <div style={styles.levelDiv}>
                    <MapLevel level={this.state.level} allLevels={this.state.allLevels} />
                </div>

            </div>
        );
    }

}

// ------- arkusz stylów ------

const styles = {
    gameDiv: {
        margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center'
    },
    lifesDiv: {
        display: 'flex', fontWeight: 'bold', fontSize: 30, flexDirection: 'column', margin: '0 auto', justifyContent: 'center', textAlign: 'center', borderLeft: '5px solid black', borderBottom: '5px solid black', width: 150, height: 300
    },
    waterDiv: {
        display: 'flex', fontSize: 30, flexDirection: 'column', margin: '0 auto', justifyContent: 'center', textAlign: 'center', borderRight: '5px solid black', borderBottom: '5px solid black', width: 150, height: 300
    },
    levelDiv: {
        display: 'flex', alignContent: 'center',
    }
}

