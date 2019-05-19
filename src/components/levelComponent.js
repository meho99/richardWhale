import React, { Component } from 'react';
import n0 from '../sprites/n0.png'
import n1 from '../sprites/n1.png'
import f0 from '../sprites/f0.png'
import f1 from '../sprites/f1.png'

export default class MapLevel extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }

    render() {
        var levels = []// tablica z levelami
        for (let i = 0; i < this.props.allLevels; i++) {
            if (i === this.props.level) { 
                if (i <= 2)
                    levels.push(<img src={f1} alt='f1' />);
                else
                    levels.push(<img src={n1} alt='n1' />);
            }
            else {
                if (i <= 2)
                    levels.push(<img src={f0} alt='f0' />);
                else
                    levels.push(<img src={n0} alt='n0' />);
            }
        }

        var mapLevel = levels.map((i, index) => {
            return <div style={{ width: 1024 / this.props.allLevels, textAlign: 'center' }} key={index}>{i}</div>
        })

        return (
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 20, width: '1024' }}>
                {mapLevel}
            </div>
        )


    }
}
