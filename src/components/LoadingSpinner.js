import React, { Component } from 'react';
import Spinner from 'react-bootstrap/Spinner';

class LoadingSpinner extends Component {
    render() {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" role="status" />
                <p>Por favor aguarde</p>
            </div>
        )
    }
}

export default LoadingSpinner;
