import React from 'react';
import { connect } from 'react-redux';
import { userActions, commonActions } from '../_actions';
import {
    logoImage,
    clockImage,
    searchImage,
    notifyImage,
    settingImage,
    blueNotification
} from '../_assets'
import { formConstants } from '../_constants';
import { capitalize, history, fetchAPIEndpoint, getLoginUserId, socket, errorToast} from '../_helpers';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import Notification from "react-web-notification";
import QRCode from "react-qr-code";
import * as htmlToImage from 'html-to-image';
import { default as usersGroupSVG } from '../_assets/images/users-group.svg';
import { default as mapSignsSVG } from '../_assets/images/map-signs.svg';
import Modal from "react-bootstrap/Modal";
import { default as plusSVG } from '../_assets/images/plus.svg';
import "../_assets/css/sass/_location.scss";
import { default as deleteSVG } from '../_assets/images/delete.svg';
import { default as qrSVG } from '../_assets/images/qrcode.svg';
import { default as downloadSVG } from '../_assets/images/download.svg';
import config from 'config';


class HeaderPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationTitle: null,
            notificationBody: null,
            isModelShow: false,
            isQrShow: false,
            qrString: '',
            locations: [
                { name: 'Location 1' },
                { name: 'Location 2' },
                { name: 'Location 3' },
            ],
            selectedLocation: null,
            addlocation: '',
            error_addlocation: false
        };

        socket.on('remove-patient', async (response) => {
            let {userId, locationId} = await getLoginUserId();
            if (!userId || !locationId) {
                return;
            }
            if (userId === response.clientId && locationId === response.locationId) {
                this.props.fetchNotifications();
            }
        })
        socket.on('new-message', async (response) => {
            let {userId, locationId} = await getLoginUserId();
            if (!userId || !locationId) {
                return;
            }

            if (userId === response.clientId && locationId === response.locationId) {
                if (this.props.settingData && this.props.settingData.desktopAdditional && this.props.settingData.desktopAdditional.is_active) {
                    this.setState({ notificationTitle: 'New message', notificationBody: response.message });
                }
                this.props.fetchNotifications();
            }
        })
        socket.on('new-patient', async (response) => {
            let {userId, locationId} = await getLoginUserId();
            if (!userId || !locationId) {
                return;
            }
            if (userId === response.clientId && locationId == response.locationId) {
                this.props.fetchNotifications();
            }
        })
        socket.on('location-open', async (response) => {
            let {userId, locationId} = await getLoginUserId();
            if (!userId || !locationId) {
                return;
            }
            if (locationId == response.locationId && this.props.user.locationIsOpen !== response.isOpen) {
                this.props.updateIsOpenSetting('updateIsOpenSetting', {isOpen:response.isOpen});
            }
        })
    }
    async componentDidMount() {
        const apiEndpoint = await fetchAPIEndpoint(formConstants.GET_Settings);
        this.props.getSettings(apiEndpoint);
        this.props.fetchNotifications();
        this.props.getPlan();
        this.getUserIdAndSubscribe(1);
        /* if(this.props.user &&  !this.props.user.default_location) {
            this.openModal();
        } */
    }
    componentWillUnmount() {
        this.getUserIdAndSubscribe(2);
    }
    async getUserIdAndSubscribe(type = 0) {
        try {
            let {userId, locationId} = await getLoginUserId();
            if (!userId) {
                return;
            }
            switch (type) {
                case 1:
                    socket.emit('subscribe', userId, locationId);
                    break;
                case 2:
                    socket.emit('unsubscribe', userId, locationId);
                    break;
                default:
                    break;
            }
        } catch (err) {
            console.log('\n error in getUserIdAndSubscribe:', err.message || err);
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.hasOwnProperty('openLocationModel') &&(prevProps.openLocationModel !== this.props.openLocationModel)) {
            if(this.props.openLocationModel == true) {
                this.openModal();
            } 
        }
    }

    async handleChange(event) {
        try {
            let { value } = event.target;
            if (!value || value == '') {
                this.fetchAllSectionData(false, value);
                return;
            }
            this.fetchAllSectionData(true, value);
        } catch (error) {
            console.log('\n error:', error.message || error);
        }
    }
    fetchAllSectionData = (isSearch, searchBy) => {
        this.props.getwaitingList(isSearch, searchBy);
        this.props.getCheckInOutList(isSearch, searchBy);
        this.props.getServedPatientList(isSearch, searchBy);
    }

    handleLogout() {
        this.props.logout();
        history.push('/');
    }
    getNotificationContent(index) {
        try {
            const selectedData = (this.props.notification && this.props.notification.length > index) ? this.props.notification[index] : {};
            const firstname = (selectedData.patientId && selectedData.patientId.first_name) ? capitalize(selectedData.patientId.first_name) : null;
            const lastname = (selectedData.patientId && selectedData.patientId.last_name) ? capitalize(selectedData.patientId.last_name) : '';
            const fullNumber = (selectedData.patientId && selectedData.patientId.fullNumber) ? selectedData.patientId.fullNumber : '';
            let fullName = (!firstname) ? fullNumber : `${firstname} ${lastname}`;
            let count = (selectedData.count) ? selectedData.count : 0;
            let patientId = (selectedData.patientId && selectedData.patientId._id) ? selectedData.patientId._id : null;
            let messageContent = (selectedData.content && selectedData.content.length > 0) ? selectedData.content[selectedData.content.length - 1] : null;
            if (messageContent) {
                let splitedMessage = (messageContent.length > 10) ? `${messageContent.split(' ').slice(0, 2).join(' ')}.....` : messageContent;
                return (
                    <div key={'n_' + index}>
                        <span>
                            <a className="dropdown-item" onClick={() => this.markRead(patientId)}>{count} new message from {fullName}</a>
                        </span>
                        <span className="latest-message"><b>latest message is:</b> {splitedMessage}</span>
                        <div className="dropdown-divider"></div>
                    </div>
                );
            } else {
                return (
                    <div key={'n_' + index}>
                        <span><a className="dropdown-item" onClick={() => this.markRead(patientId)}>{count} new message from {fullName}</a></span>
                        <div className="dropdown-divider"></div>
                    </div>);
            }
        } catch (err) {
            console.log('\n getNotificationContent err:', err.message || err);
        }
    }
    async markRead(patientId) {
        let {userId, locationId} = await getLoginUserId();
        socket.emit('open-notification', patientId, userId, locationId);
    }
    async setNotificationTitle() {
        try {
            this.setState({ notificationTitle: null, notificationBody: null })
        } catch (err) {
            console.log('\n setNotificationTitle:', err.message || err);
        }
    }
    async markAllRead() {
        try {
            this.props.markAllNotifications();
        } catch (err) {
            console.log('\n markAllRead error section :', err.message || err);
        }
    }
    hideModal = () => {
        this.setState({ isModelShow: false});
        this.props.closeLocationModelAction();
    }
    modalLoaded = () => {
        console.log('\n on modal load...')
    }
    openModal = () => {
        console.log('\n this.props.user.default_location:', this.props.user.default_location)
        if(this.props.user &&  this.props.user.default_location) {
            this.setState({selectedLocation: this.props.user.default_location})
        }
        this.props.fetchlocations();
        this.setState({ isModelShow: true });
    }
    openQr = () => {
        const qrString = config.apiUrl + '/twilio/jotform/' + this.props.user.default_location;
        console.log(qrString);
        this.setState({ isQrShow: true, qrString });
    }
    saveQr = () => {
        htmlToImage.toJpeg(document.getElementById('qrElement'), {pixelRatio: 5}).then(dataUrl => {
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `qr-${this.props.user.default_location}.jpg`;
            link.click();
        }).catch(err => console.log(err))
    }
    async handleSelection(index) {
        try {
            const selectedData = this.props.clinic_locations[index];
            let locationId = selectedData._id;
            let locationIsOpen = (selectedData.hasOwnProperty('isOpen') && selectedData.isOpen) ? true :false;
            const userData = this.props.user;
            userData.default_location = locationId;
            userData.locationIsOpen = locationIsOpen;
            localStorage.setItem('user', JSON.stringify(userData));
            this.setState({selectedLocation: locationId})
            this.hideModal();
        } catch (error) {
            console.log('\n error:', error.message || error);
        }
    }
    async handleAddLocation(event) {
        try {
            let { value } = event.target;
            if (!value || value == '') {
                this.setState({ error_addlocation: true, addlocation: value });
            } else {
                this.setState({ error_addlocation: false, addlocation: value, selectedLocation: { name: '' } })
            }
        } catch (error) {
            console.log('\n error:', error.message || error);
        }
    }
    async addLocation(event) {
        try {
            const { addlocation } = this.state;
            if (!addlocation || addlocation == '' || addlocation == null) {
                this.setState({ error_addlocation: true });
                return;
            }
            const payload = {
                name: addlocation
            }
            this.props.addlocationAction(payload);
        } catch (error) {
            console.log('\n addLocation error:', error.message || error);
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        try {
            if ((nextProps.hasOwnProperty('isAddLocationComplete') && nextProps.isAddLocationComplete)) {
                console.log('\n call fetch.......')
                this.setState({ error_addlocation: false, addlocation: '' });
                this.props.fetchlocations();
            }
        } catch (err) {
            let message = (err && err.message) ? err.message : 'Something went wrong';
            console.log('\n message:', message)
            errorToast(message)
        }
    }

    handleClinicOpen = async(event) => {
        try {
             this.props.updateIsOpenSetting('updateIsOpenSetting', {isOpen:event.target.checked});
        } catch(err) {
            let message = (err && err.message) ? err.message : 'Something went wrong';
            console.log('\n message:', message)
            errorToast(message);
        }
    }


    render() {
        const { settingData, notification, plan } = this.props;
        const { notificationTitle, notificationBody,
            qrString,
            selectedLocation,
            error_addlocation, addlocation } = this.state;
        return (
            <section className="header-container">
                {
                    plan.isActive === false
                    &&
                    <div className='text-center bg-warning'>
                        <Link className='text-white' to="/membership">Activate Plan - Click Here</Link>
                    </div>
                }
                <header className="header">
                    <div className="container-fluid">
                        <nav className="navbar navbar-expand-lg">
                            <Link className="navbar-brand" to="/"><img src={logoImage} alt="" /></Link>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav m-auto">
                                    <li htmlFor="drop-timer" className="nav-item dropdown timer">
                                        <a className="nav-link" href="#" id="clockDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img src={clockImage} alt="" className="clock" />
                                            <span>
                                                <Moment interval={1000} format="h:mm a"></Moment>
                                            </span>
                                        </a>
                                        <div className="dropdown-menu" aria-labelledby="clockDropdown">
                                            <a className="dropdown-item" href="#">Action</a>
                                            <div className="dropdown-divider"></div>
                                        </div>
                                    </li>
                                </ul>
                                <div className="rightbx">
                                    <form className="form-inline my-2 my-lg-0">
                                        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onChange={(e) => this.handleChange(e)} />
                                        <button className="btn my-2 my-sm-0" type="submit">
                                            <img src={searchImage} alt="" />
                                        </button>
                                    </form>
                                    <div className="notify">
                                        <div className="nav-item dropdown">
                                            <a className="nav-link" href="#" id="notifyDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <img src={notifyImage} alt="" className="notify" />
                                                {notification && notification.length > 0 && <span className="number">{notification.length}</span>}
                                            </a>
                                            <div className="dropdown-menu" aria-labelledby="notifyDropdown">
                                                <div className="clear-notify"><span onClick={() => this.markAllRead()}>Clear all</span></div>
                                                <div className="dropdown-divider"></div>
                                                {notification && notification.length > 0 && notification.map((value, index) => (
                                                    this.getNotificationContent(index)
                                                ))}
                                                {((notification && notification.length === 0) || !notification) &&
                                                    <div className="no-notification" key="n-0">No notifications</div>
                                                }
                                                {/* <a className="dropdown-item" href="#">Action</a>
                                          <a className="dropdown-item" href="#">Another action</a>
                                          <div className="dropdown-divider"></div>
                                          <a className="dropdown-item" href="#">Something else here</a> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="settings">
                                        <div className="nav-item dropdown">
                                            <Link to="/settings" className="nav-link" id="settingsDropdown">
                                                <img src={settingImage} alt="" className="settings" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="userinfo">
                                        <div className="nav-item dropdown">
                                            <a className="nav-link user" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <span>JD</span>
                                            </a>
                                            <div className="dropdown-menu" aria-labelledby="userDropdown">
                                                <Link to="/membership" className="dropdown-item" >Membership</Link>
                                                <div className="dropdown-divider"></div>
                                                <a className="dropdown-item" onClick={this.openModal} >Locations</a>
                                                <div className="dropdown-divider"></div>
                                                <a className="dropdown-item" onClick={() => this.handleLogout()}>Logout</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                    {notificationTitle ? (
                        <Notification
                            title={notificationTitle}
                            options={{
                                body: notificationBody,
                                icon: blueNotification
                            }}
                            onClose={() => this.setNotificationTitle()}
                        />
                    ) : null}
                </header>
                <section className="sub-header">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-6">
                                {settingData && settingData.businessInformation && settingData.businessInformation.companyName &&
                                    <div className="company-name">
                                        <p>{settingData.businessInformation.companyName}</p>
                                    </div>
                                }
                                {!settingData || !settingData.businessInformation || !settingData.businessInformation.companyName &&
                                    <div className="company-name">
                                        <p>Company Name Goes here...</p>
                                    </div>
                                }
                            </div>
                            <div className="col-md-6">
                                <div className="actionbtns-wrapper">
                                    <button type="button" name="button" className="btn"  onClick={this.openModal}>
                                        <span className="icon"> <img src={mapSignsSVG} alt="" /> </span>
                                    </button>
                                    <button type="button" name="button" className="btn">
                                        <span className="icon">
                                            <Link className="navbar-brand" to="/visitor-list">
                                                <img src={usersGroupSVG} alt="" /></Link> </span>
                                    </button>
                                    <button type="button" name="button" className="btn"  onClick={this.openQr}>
                                        <span className="icon"> <img src={qrSVG} alt="" /> </span>
                                    </button>
                                    {this.props.user.hasOwnProperty('locationIsOpen') && this.props.user.locationIsOpen !== null && 
                                    <div className="togglebtn-holder">
                                        <div className="btn-holder ynobtn-holder">
                                            <label className="switch">
                                                <input type="checkbox"
                                                name="waitingOrCheckIn"
                                                checked={this.props.user.locationIsOpen}
                                                value={this.props.user.locationIsOpen}
                                                onChange={(e) => this.handleClinicOpen(e)}
                                                readOnly={this.props.isOpenRequest}
                                                 />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                            {/* <div className="col-md-6">
                                <div className="row">
                                    <div className="col-md-4"></div>
                                    <div className="col-md-4"></div>
                                    <div className="col-md-4">
                                        <span><img className="icon-images" src={mapSignsSVG} alt="" /></span>

                                        <Link className="navbar-brand" to="/visitor-list"><img className="icon-images" src={usersGroupSVG} alt="" />
                                        </Link>

                                    </div>
                                </div>

                                 <div className="add-client">
                                <button type="button" name="button" className="btn">
                                    <span className="icon"> <img src={addImage} alt="" /> </span>
                                    <span className="tx">Add client</span>
                                </button>
                            </div>
                            </div> */}
                        </div>
                    </div>
                </section>
                <Modal
                    show={this.state.isModelShow}
                    onHide={() => this.hideModal()}
                    onEntered={() => this.modalLoaded()}
                    dialogClassName={"chatbx-container locationbx-container"}
                    contentClassName={"cstm-overlay"}
                >
                    <div className="cancel-chatbtn">
                        <a className="btn" onClick={() => this.hideModal()}>
                            <img src={deleteSVG} alt="" />
                        </a>
                    </div>
                    <div className="cstm-container">
                        <div className="row justify-content-center">
                            <div className="col-md-9">
                                <div className="infobx-holder">
                                    <div className="inner-container">
                                        <div className="modal-header chat-header">
                                            <div className="toprow">
                                                <h3>Currently Selected Location Name</h3>
                                                <div className="profile-drop user-drop">
                                                    <div className="nav-item">
                                                        <a className="nav-link green" id="clockDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            JD
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="clockDropdown">
                                                            <a className="dropdown-item" >Action</a>
                                                            <a className="dropdown-item" >Another action</a>
                                                            <div className="dropdown-divider"></div>
                                                            <a className="dropdown-item" >Something else here</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-body chat-body location-body">
                                            <div className="atchment_flowwrap">
                                                <div className="locontbx-holder">
                                                    {!this.props.fetching_locations && this.props.clinic_locations && this.props.clinic_locations.length > 0 && this.props.clinic_locations.map((location, index) => (
                                                        <div className="locrow-holder" key={`location-${index}`}>
                                                            <div className="lftbx" >
                                                                <div className="inner" >
                                                                    <div onClick={() => this.handleSelection(index)} className={selectedLocation == location._id ? 'infocon active' : 'infocon'} >
                                                                        <span></span>
                                                                    </div>
                                                                    <div className="infotxbx">
                                                                        <h1>{location.name}</h1>
                                                                        {/* <div className="contbx">
                                                                        <p>Use Location Settings From: </p>
                                                                        <select className="form-control" 
                                                                        name="selectedLocation"
                                                                        onChange={(e) => this.handleSelection(e)}
                                                                        >
                                                                            { this.props.clinic_locations.map((singleLocation, index) => (
                                                                            <option value={singleLocation.name} key={singleLocation.name} >
                                                                            {(singleLocation.name === selectedLocation) ? 
                                                                            'Default': singleLocation.name}</option>
                                                                            ))}                                                                           
                                                                        </select>
                                                                    </div> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="rgtbx">
                                                                <ul>
                                                                    <li key="{index}-waiting"> <span>0</span> waiting</li>
                                                                    <li key="{index}-after-waiting">-</li>
                                                                    <li key="{index}-serving"> <span>0</span> serving</li>
                                                                    <li key="{index}-after-serving">- </li>
                                                                    <li key="{index}-existed"><span>0</span> exited</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {!this.props.fetching_locations && (!this.props.clinic_locations || this.props.clinic_locations.length == 0) && (
                                                        <h6 className="text-center">No Location found. Please Add using below input box.</h6>
                                                    )}
                                                    {this.props.fetching_locations && (<h5 className="text-center">Loading....</h5>)}
                                                    <div className="inputrow-holder">
                                                        <div className="inputbx">
                                                        {this.props.user?.allowLocationAdd && <div className="form-group">
                                                                <input type="text" name="addlocation" value={addlocation} className={error_addlocation ? "form-control error-box" : "form-control"} placeholder="NEW LOCATION" onChange={(e) => this.handleAddLocation(e)} />
                                                                <span className="addbtn">
                                                                    <button type="button" name="button" className="btn" disabled={this.props.islocationRegister} onClick={(e) => this.addLocation(e)} > <img src={plusSVG} alt="" /> </button>
                                                                </span>
                                                            </div>}
                                                            {this.props.user?.allowLocationAdd && this.props.addLocationError &&
                                                                <span className="error help-block">{this.props.addLocationError}</span>}
                                                            {!this.props.user?.allowLocationAdd &&
                                                                <span className="error help-block">
                                                                    <b>Add New Location feature is Disabled for your Clinic. Please contact to Admin for enable Add location feature.Once Admin update Please logout and login again.</b>
                                                                </span>}
                                                        </div>
                                                        {/* <div className="btnbx">
                                                            <button type="button" name="button" className="btn" onClick={() => this.handleLogout()} >Log Out</button>
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div></div></div></div></div>
                </Modal>
                <Modal
                    show={this.state.isQrShow}
                    onHide={() => this.setState({ isQrShow: false })}
                    dialogClassName={"chatbx-container locationbx-container"}
                    contentClassName={"cstm-overlay"}
                >
                    <div className="cancel-chatbtn">
                        <a className="btn" onClick={() => this.saveQr()}>
                            <img src={downloadSVG} alt="" />
                        </a>
                        <a className="btn" onClick={() => this.setState({ isQrShow: false })}>
                            <img src={deleteSVG} alt="" />
                        </a>
                    </div>
                    <div style={{ height: "100%", margin: "0 auto", maxHeight: 400, width: "auto" }}>
                        <QRCode
                            id="qrElement"
                            size={400}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={qrString}
                            viewBox={`0 0 400 400`}
                        />
                    </div>
                </Modal>
            </section>

        );
    }
}

function mapState(state) {
    const { users, authentication, settings, commons } = state;
    const { settingData } = settings;
    const { user, openLocationModel, isOpenRequest } = authentication;
    const { notification } = users;
    const { plan } = state.plan
    const { islocationRegister, fetching_locations, clinic_locations, isAddLocationComplete, addLocationError } = commons;
    return { plan, user,openLocationModel, notification, settingData, islocationRegister, isAddLocationComplete, fetching_locations, clinic_locations, isOpenRequest, addLocationError };
}

const actionCreators = {
    getUsers: userActions.getAll,
    deleteUser: userActions.delete,
    getPlan: userActions.getPlan,
    logout: userActions.logout,
    getSettings: userActions.getSettings,
    getwaitingList: commonActions.fetchWaitingList,
    getCheckInOutList: commonActions.fetchCheckInOutList,
    getServedPatientList: commonActions.fetchServedPatientList,
    fetchNotifications: userActions.fetchNotifications,
    markNotifications: userActions.markNotifications,
    markAllNotifications: userActions.markAllNotifications,
    addlocationAction: commonActions.addlocationAction,
    fetchlocations: commonActions.fetchlocations,
    updateIsOpenSetting: userActions.updateIsOpenSetting,
    closeLocationModelAction :userActions.closeLocationModelAction
}

export default connect(mapState, actionCreators)(HeaderPage);

