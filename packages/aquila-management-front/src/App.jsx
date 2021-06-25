import React from 'react';
import PropTypes from 'prop-types';

import { Container } from '@material-ui/core';
import Router from './core/Router';

function App() {
    return (
        <Container maxWidth="lg" className="App">
            <Router />
        </Container>
    );
}

App.propTypes = {
    children: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    index: PropTypes.string.isRequired,
};

export default App;
