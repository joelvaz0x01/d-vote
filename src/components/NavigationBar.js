import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";

class NavigationBar extends Component {
    render() {
        const { endCountdown } = this.props;
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>dVote</Link></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text style={{ color: 'white' }}>
                        { !endCountdown.length
                            ? <>Carregando tempo restante para exercer o voto</>
                            : endCountdown.length === 1
                                ? <>{endCountdown[0]}</>
                                : <>Tempo restante para exercer o voto: {endCountdown[0]}h {endCountdown[1]}m {endCountdown[2]}s</>
                    }
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default NavigationBar;
