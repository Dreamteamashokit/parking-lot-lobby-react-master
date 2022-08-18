import React from 'react';
import { connect } from 'react-redux';
import "../_assets/css/sass/visitor-review.scss";
import {Link} from 'react-router-dom'
import {
    errorToast,
} from '../_helpers';
import { adminActions } from '../_actions';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
        
    }

    componentDidMount(){
        this.props.fetchDashboardCount()
    }

    
    

    confirmDeleteProfile = async () => {
        try {
            const { selectedPatientId} = this.state;
            console.log('\n selectedPatientId:', selectedPatientId);
            await this.props.removePatient({id:selectedPatientId, deleteType:3})
            this.hideDeleteModal();
        } catch (e) {
            console.log('error in confirmDeleteProfile:', e.message || e)
            let message = e.message || 'Something went wrong in confirmDeleteProfile';
            errorToast(message)
        }

    }

    render() {
        const {totalLocations, totalProvider} = this.props.dashboardCount;
        return (<div>
            <section className="visitor-review-holder">
                <div className="cstm-container">
                    <div className="topbx-holder">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="headingbx">
                                    <div className="headcontbx">
                                        <h1>Dashboard:</h1>
                                    </div>
                                  
                                </div>
                            </div>
                        </div>
                    </div>
                   <div className="row">
                   <div className="col-sm-2"></div>
                       <div className="col-sm-4">
                        <Link to="/admin/client-list" style={{width:"100%"}}>
                       <div className="tablebx-holder">
                        <div className="table-inner">
                               <div className="row">
                                   <div className="col-sm-6">
                                   <div className="panel">
                                        <div className="panel">
                                            Total Clients 
                                            <h2>{totalProvider}</h2>
                                        </div>
                                    </div>
                                   </div>
                            </div>
                        </div>
                    </div>
                    </Link>
                       </div>
                   
                       <div className="col-sm-4">
                       <Link to="/admin/client-list" style={{width:"100%"}}>
                       <div className="tablebx-holder">
                        <div className="table-inner">
                               <div className="row">
                                   <div className="col-sm-6">
                                   <div className="panel">
                                        <div className="panel">
                                            Total Locations 
                                            <h2>{totalLocations}</h2>
                                        </div>
                                    </div>
                                   </div>
                            </div>
                        </div>
                    </div>
                    </Link>
                       </div>
                   </div>
                </div>
            </section>
        </div>)
    }
}

function mapState(state) {
    const {dashboardCount} = state.fetchDashboardCount;
    return { dashboardCount };
}

const actionCreators = {
    fetchDashboardCount: adminActions.fetchDashboardCount,
}


export default connect(mapState, actionCreators)(Dashboard);