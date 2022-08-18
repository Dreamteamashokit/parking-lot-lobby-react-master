import React from 'react';
import { connect } from 'react-redux';

class ModalPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
    render() {
        return (<div>ModelPage....</div>)
    }
}

function mapState(state) {
    return {}
}

const actionCreators = {}

export default connect(mapState, actionCreators)(ModalPage);