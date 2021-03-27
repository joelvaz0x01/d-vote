import React, { Component } from 'react';

export class NotFound extends Component {
    render() {
        return (
            <div>
                <h2>404 - Not Found</h2>
                <p>A página <code>{this.props.match.url}</code> não foi encontrada.</p>
            </div>
        )
    }
}

export default NotFound;
