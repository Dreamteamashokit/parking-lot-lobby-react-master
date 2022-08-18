import React from 'react';
import { connect } from 'react-redux';

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }
    async componentDidMount() {
    }
    
    render() {
        return (
            <div>
                <div className="steps-wrapper">
                    <div className="inner-container">
                        <div className="contbx-holder">
                            <div className="txbx-holder thank-you-section">
                                <div className="form-holder">
                                <h3> <strong>Thank you for submission. We will contact you Soon</strong></h3>

                                </div>
                      </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const actionCreators = {}

export default connect(mapStateToProps, actionCreators)(RegisterPage);