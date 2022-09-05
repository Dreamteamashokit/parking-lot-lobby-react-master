import React from 'react';
import { connect } from 'react-redux';
import { commonActions,userActions } from '../_actions';
import Modal from "react-bootstrap/Modal";
import Moment from 'react-moment';
import moment from 'moment';
import {
    capitalize, errorToast,
    getLoginUserId,
    socket
} from '../_helpers';
import {
    cancelImage,
    chatImage,
    bellImage,
    checkImage,
    exploreImage,
    dustbinImage,
    plusBlue,
    deleteImage,
    documentImage
} from '../_assets';

import { ChatInformation, ChatBox, QuickResponse, Countdown } from '../_childPages';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { getMonth, getYear } from 'date-fns';
import { range } from 'underscore';



import { default as carSVG } from '../_assets/images/car.svg';
import { default as chairSVG } from '../_assets/images/chair.svg';

import { default as paperClipSVG } from '../_assets/images/paperclip-solid.svg';


class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifyDiv: -1,
            isModelShow: false,
            deleteType: 1,
            selected: {},
            isConfirmModelShow: false,
            isChatModelShow: false,
            iscollapsed: true,
            popupData: null,
            listType: null,
            isConfirmationModalShow: false,
            moveObject: { id: '', userName: '', columnType: 0 },
            manuallyNotify: '',
            manuallyNotifyError: false,
            manuallyNotifyErrorMessage: '',
            totalUnreadWaitingList: 0,
            totalUnreadCheckInOutList: 0,
            totalUnreadServedPatient: 0,
            isAddClientModelShow: false,
            client: {
                first_name: '',
                last_name: '',
                fullNumber: '',
                dob: '',
                visitNotes: '',
                waitingOrCheckIn:false,
                parkingSpot: ''
            },
            clientError: {
                first_name: false,
                last_name: false,
                fullNumber: false,
                dob: false,
                visitNotes: false,
                parkingSpot: false
            },
            years: range(1970, getYear(new Date()) + 1, 1),
            months: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ],
            intervalId:null
        };
        socket.on('new-patient', async (response) => {
            let {userId, locationId} = await getLoginUserId();
            if (!userId || !locationId) {
                return;
            }
            if (userId === response.clientId && locationId === response.locationId) {
                if (response.hasOwnProperty('from_web') && response.from_web) {
                    this.hideAddClientModal();
                }
                this.props.getwaitingList();
                let outerThis = this;
                setTimeout(function () {
                    outerThis.calculateTotalUnread();
                }, 1000);
            }
        })

        socket.on('move-patient', async (response) => {
            let {userId,locationId} = await getLoginUserId();
            if (!userId || !locationId) {
                return;
            }
            if (userId === response.clientId && locationId === response.locationId) {
                if (response.hasOwnProperty('type')) {
                    let outerThis = this;
                    switch (response.type) {
                        case 1:
                            await this.props.getCheckInOutList();
                            setTimeout(function () {
                                outerThis.calculateTotalUnread();
                            }, 2000);
                            break;
                        case 2:
                            await this.props.getServedPatientList();
                            setTimeout(function () {
                                outerThis.calculateTotalUnread();
                            }, 2000);
                            break;
                        default:
                            break;
                    }
                }
            }
        })
        socket.on('new-message', async (response) => {
            let {userId,locationId} = await getLoginUserId();
            if (!userId || !locationId) {
                return;
            }
            if (userId === response.clientId && locationId === response.locationId) {
                this.fetchAllSectionData();
            }
        })
        socket.on('mark-unread', async (response) => {
            let {userId,locationId} = await getLoginUserId();
            if (!userId || !locationId) {
                return;
            }
            if (userId === response.clientId && locationId === response.locationId) {
                await this.props.unreadMessage(response.patientId);
                let outerThis = this;
                setTimeout(function () {
                    outerThis.calculateTotalUnread();
                }, 1000);
            }
        })
        socket.on('mark-all-Unread', async (response) => {
            let {userId,locationId} = await getLoginUserId();
            if (!userId || !locationId) {
                return;
            }
            if (userId === response.clientId && locationId === response.locationId) {
                this.fetchAllSectionData();
            }
        })

        socket.on('open-notification-modal', async (patientId, resLocationId) => {
            let {locationId} = await getLoginUserId();
            if (userId === response.clientId && locationId === resLocationId) {
                this.openModalOnNotify(patientId)
            }
        });
    }

    componentDidMount() {
        if(this.props.user &&  !this.props.user.default_location) {
            this.props.OpenLocationModelAction();
        }
        this.fetchAllSectionData();
        const intervalId = setInterval(() => {
            this.fetchAllSectionData();
          }, 60000);
        this.setState({intervalId:intervalId})
    }
    componentWillUnmount() {
       try {
        this.props.closeLocationModelAction();
        if(this.state.intervalId) {
            clearInterval(this.state.intervalId);
        }
       } catch (err) {
         console.log('\n error in home.componentWillUnmount', err.message || err);
       }
    }

    fetchAllSectionData = async () => {
        try {
            if(!this.props.user.default_location) {
                return;
            }
            await Promise.all([
                this.props.getwaitingList(),
                this.props.getCheckInOutList(),
                this.props.getServedPatientList(),
            ]);
            let outerThis = this;
            setTimeout(function () {
                outerThis.calculateTotalUnread();
            }, 1000);
        } catch (err) {
            console.log('\n fetchAllSectionData error:', err.message || err);
        }

    }

    handleClickOnNotify = (selectedIndex) => {
        this.setState({ notifyDiv: selectedIndex, manuallyNotify: '' })
    }
    submitNotificationTime = (resetValue, selectedIndex) => {
        try {
            let { manuallyNotify, manuallyNotifyError, manuallyNotifyErrorMessage } = this.state;
            if (manuallyNotifyError) {
                return;
            }
            if (!manuallyNotify) {
                if (manuallyNotify !== 0) {
                    manuallyNotifyError = true;
                    manuallyNotifyErrorMessage = 'Please select any pre-define minute or enter manually.'
                    this.setState({ manuallyNotifyError, manuallyNotifyErrorMessage });
                    return;
                } else {
                    manuallyNotify = -1;
                }
            }
            const selectedPatient = this.props.waitingList[selectedIndex];
            const w_id = (selectedPatient.patientId && selectedPatient.patientId._id) ? selectedPatient.patientId._id : '';
            this.props.notifyPatient({ patientId: w_id, notifyTime: manuallyNotify })
            this.props.countDownFinish({ index: selectedIndex, countDownFinish: false })
            this.setState({ notifyDiv: resetValue, manuallyNotify: '', manuallyNotifyError: false, manuallyNotifyErrorMessage: '' });
        } catch (e) {
            console.log('\n error in submitNotificationTime:', e.message || e)
        }
    }

    notifyTime = (time) => {
        try {
            this.setState({ manuallyNotify: time, manuallyNotifyError: false, manuallyNotifyErrorMessage: '' });
        } catch (err) {
            console.log('\n err:', err.message || err);
        }
    }

    manuallyNotify = (event) => {
        try {
            let { value } = event.target;
            let {
                manuallyNotify,
                manuallyNotifyError,
                manuallyNotifyErrorMessage
            } = this.state;

            manuallyNotifyError = false;
            manuallyNotifyErrorMessage = '';

            if (isNaN(value)) {
                manuallyNotifyError = true;
                manuallyNotifyErrorMessage = 'Please use numarical value for minutes.'
            }
            manuallyNotify = value;
            this.setState({ manuallyNotify, manuallyNotifyError, manuallyNotifyErrorMessage })
        } catch (err) {
            console.log('\n err:', err.message || err);
        }
    }

    backDropModal = (index, type) => {
        try {
            const currenctModelStatus = this.state.isModelShow;
            if (!currenctModelStatus) {
                let selectedData = {};
                switch (type) {
                    case 1:
                        selectedData = (this.props.waitingList[index].patientId) ? this.props.waitingList[index].patientId : {};
                        const w_firstname = (selectedData.first_name) ? capitalize(selectedData.first_name) : null;
                        const w_lastname = (selectedData.last_name) ? capitalize(selectedData.last_name) : '';
                        const w_fullNumber = (selectedData.fullNumber) ? selectedData.fullNumber : '';
                        let w_fullName = (!w_firstname) ? w_fullNumber : `${w_firstname} ${w_lastname}`
                        selectedData['fullName'] = w_fullName;
                        selectedData['recordType'] = 1;
                        this.setState({ selected: selectedData })
                        break;
                    case 2:
                        selectedData = (this.props.checkInOutList[index].patientId) ? this.props.checkInOutList[index].patientId : {};
                        const c_firstname = (selectedData.first_name) ? capitalize(selectedData.first_name) : null;
                        const c_lastname = (selectedData.last_name) ? capitalize(selectedData.last_name) : '';
                        const c_fullNumber = (selectedData.fullNumber) ? selectedData.fullNumber : '';
                        let c_fullName = (!c_firstname) ? c_fullNumber : `${c_firstname} ${c_lastname}`
                        selectedData['fullName'] = c_fullName;
                        selectedData['recordType'] = 2;
                        this.setState({ selected: selectedData })
                        break;
                    case 3:
                        selectedData = (this.props.servedPatient[index].patientId) ? this.props.servedPatient[index].patientId : {};
                        const s_firstname = (selectedData.first_name) ? capitalize(selectedData.first_name) : null;
                        const s_lastname = (selectedData.last_name) ? capitalize(selectedData.last_name) : '';
                        const s_fullNumber = (selectedData.fullNumber) ? selectedData.fullNumber : '';
                        let s_fullName = (!s_firstname) ? s_fullNumber : `${s_firstname} ${s_lastname}`
                        selectedData['fullName'] = s_fullName;
                        selectedData['recordType'] = 3;
                        this.setState({ selected: selectedData })
                        break;
                    default:
                        this.setState({ selected: selectedData })
                        break;
                }

            }
            this.setState({ isModelShow: !currenctModelStatus, deleteType: 1 });
        } catch (e) {
            console.log('error in backDropModal:', e.message || e)
            let message = e.message || 'Something went wrong in backDropModal';
            errorToast(message)
        }
    }

    hideModal = () => {
        this.setState({ isModelShow: false, selected: {}, deleteType: 1 });
    }
    modalLoaded = () => {
        console.log('\n on modal load...')
    }
    handleClickOnNotShow = () => {
        this.setState({
            isModelShow: false,
            selected: {},
            deleteType: 1
        });
    }

    handleClickOnRemoveProfile = (type = 0) => {
        switch (type) {
            case 1:
                //this.setState({isConfirmModelShow : true});
                this.confirmDeleteProfile();
                return;
            case 2:
                this.confirmDeleteProfile();
                return;
            default:
                this.setState({ isConfirmModelShow: false });
        }
    }
    confirmDeleteProfile = async () => {
        try {
            const { selected, deleteType } = this.state;
            console.log('\n deleteType:', deleteType)
            const payload = {
                id: selected._id,
                type: selected.recordType,
                deleteType: deleteType
            }
            await this.props.removePatient(payload)
            this.setState({
                isConfirmModelShow: false,
                isModelShow: false,
                selected: {},
                deleteType: 1
            });
            let outerThis = this;
            setTimeout(function () {
                outerThis.calculateTotalUnread();
            }, 1000);

            this.hideChatModal();
        } catch (e) {
            console.log('error in confirmDeleteProfile:', e.message || e)
            let message = e.message || 'Something went wrong in confirmDeleteProfile';
            errorToast(message)
        }

    }

    backChatDropModal = (index, type) => {
        try {
            let { isChatModelShow, popupData, listType } = this.state;
            if (isChatModelShow) {
                popupData = null;
                listType = null;
            } else {
                switch (type) {
                    case 'waiting':
                        popupData = this.props.waitingList[index];
                        listType = 'waiting';
                        break;
                    case 'checkInOut':
                        popupData = this.props.checkInOutList[index];
                        listType = 'checkInOut';
                        break;
                    case 'servedSection':
                        popupData = this.props.servedPatient[index];
                        listType = 'servedSection';
                        break;
                    default:
                        break;
                }
            }
            this.setState({ isChatModelShow: !isChatModelShow, popupData, listType });
        } catch (e) {
            console.log('error in backChatDropModal:', e.message || e)
            let message = e.message || 'Something went wrong in backChatDropModal';
            errorToast(message)
        }
    }
    openModalOnNotify = (patientId) => {
        try {
            let { popupData, listType } = this.state;
            let { waitingList, checkInOutList, servedPatient } = this.props;
            let filterWaiting = [], filterCheckIn = [], filterServered = [];

            if (waitingList && waitingList.length > 0) {
                filterWaiting = waitingList.filter(function (content) {
                    return content.patientId && content.patientId._id === patientId;
                });
            }
            if (checkInOutList && checkInOutList.length > 0) {
                filterCheckIn = checkInOutList.filter(function (content) {
                    return content.patientId && content.patientId._id === patientId;
                });
            }
            if (servedPatient && servedPatient.length > 0) {
                filterServered = servedPatient.filter(function (content) {
                    return content.patientId && content.patientId._id === patientId;
                });
            }
            if (filterWaiting.length > 0) {
                this.setState({ isChatModelShow: true, popupData: filterWaiting[0], listType: 'waiting' });
            } else if (filterCheckIn.length > 0) {
                this.setState({ isChatModelShow: true, popupData: filterCheckIn[0], listType: 'checkInOut' });
            } else if (filterServered.length > 0) {
                this.setState({ isChatModelShow: true, popupData: filterServered[0], listType: 'servedSection' });
            }
            return;
        } catch (e) {
            console.log('error in openModalOnNotify:', e.message || e)
            let message = e.message || 'Something went wrong in openModalOnNotify';
            errorToast(message)
        }
    }

    hideChatModal = () => {
        this.setState({ isChatModelShow: false, popupData: null, listType: null });
    }
    modalChatLoaded = () => {
        console.log('\n on modal chat load...')
    }

    collapsedSection = () => {
        try {
            const currenctModelStatus = this.state.iscollapsed;
            this.setState({ iscollapsed: !currenctModelStatus });
        } catch (error) {
            let message = error.message || 'Something went wrong in collapsedSection';
            errorToast(message)
        }

    }

    getField = (index, field, type = '') => {
        try {
            const { waitingList, checkInOutList, servedPatient } = this.props;
            let selectedData = {};
            if (type == 'waiting') {
                selectedData = waitingList[index];
            } else if (type == 'checkInout') {
                selectedData = checkInOutList[index];
            } else if (type == 'served') {
                selectedData = servedPatient[index];
            }
            switch (field) {
                case 'name':
                    const firstname = (selectedData.patientId && selectedData.patientId.first_name) ? capitalize(selectedData.patientId.first_name) : null;
                    const lastname = (selectedData.patientId && selectedData.patientId.last_name) ? capitalize(selectedData.patientId.last_name) : '';
                    const fullNumber = (selectedData.patientId && selectedData.patientId.fullNumber) ? selectedData.patientId.fullNumber : '';
                    let fullName = (!firstname) ? fullNumber : `${firstname} ${lastname}`
                    return (fullName);
                case 'parkingSpot':
                    const spotNumber = (selectedData.parkingSpot) ? selectedData.parkingSpot : 'NA';
                    return (spotNumber);
                default:
                    return ('');
            }
        } catch (error) {
            let message = error.message || 'Something went wrong in getField';
            errorToast(message)
        }
    }

    calculateDiff(index, date) {
        const { isAddClientModelShow } = this.state;
        if (isAddClientModelShow) {
            return;
        }
        const interval = setInterval(() => {
            let duration = moment.duration(moment().diff(moment(date)))
            if (duration.asMinutes() > 10) {
                clearInterval(interval)
                const payload = {
                    index: index,
                    overFlow: true
                }
                this.props.overWaitingTimeForPatient(payload);
            }
        }, 1000);
        return true;
    }
    getMomentTime = (type, date) => {
        try {
            switch (type) {
                case 1:
                    return (<Moment format="h:mm a">{date}</Moment>)
                case 2:
                    return (<Moment interval={1000} local date={date} format="m [min]" durationFromNow />)
                case 3:
                    return (<Moment format="h:mm">{date}</Moment>)
                default:
                    return ('');
            }
        } catch (error) {
            let message = error.message || 'Something went wrong in getMomentTime';
            errorToast(message);
        }
    }
    hideShowConfirmationModal = async (isSet = false, index = 0, type = '') => {
        try {
            //this.setState({moveObject :{id:'' , userName: '', columnType:0}});
            if (isSet) {
                switch (type) {
                    case 'waiting':
                        const { waitingList } = this.props;
                        const w_id = (waitingList[index].patientId && waitingList[index].patientId._id) ? waitingList[index].patientId._id : '';
                        this.confirmToMove(w_id, 1)
                        /* const w_firstname = (waitingList[index].patientId && waitingList[index].patientId.first_name) ? waitingList[index].patientId.first_name : '';
                        const w_lastname = (waitingList[index].patientId && waitingList[index].patientId.last_name) ? waitingList[index].patientId.last_name:'';
                        const w_fullName = w_firstname + ' ' + w_lastname;
                        this.setState({moveObject : {id:w_id , userName: w_fullName, columnType:1}}); */
                        break;
                    case 'checkInOut':
                        const { checkInOutList } = this.props;
                        const c_id = (checkInOutList[index].patientId && checkInOutList[index].patientId._id) ? checkInOutList[index].patientId._id : '';
                        this.confirmToMove(c_id, 2)
                        /* const c_firstname = (checkInOutList[index].patientId && checkInOutList[index].patientId.first_name) ? checkInOutList[index].patientId.first_name : '';
                        const c_lastname = (checkInOutList[index].patientId && checkInOutList[index].patientId.last_name) ? checkInOutList[index].patientId.last_name:'';
                        const c_fullName = c_firstname + ' ' + c_lastname;
                        this.setState({moveObject : {id:c_id , userName: c_fullName, columnType:2}}); */
                        break;
                    default:
                        this.setState({ moveObject: { id: '', userName: '', columnType: 0 } });
                        break;
                }
            }
            //const {isConfirmationModalShow} = this.state;
            //this.setState({isConfirmationModalShow: !isConfirmationModalShow})
        } catch (err) {
            console.log('\n hideShowConfirmationModal error:', err.message || err);
            let message = err.message || 'Something went wrong in hideShowConfirmationModal';
            errorToast(message)
        }
    }
    confirmToMove = async (patientId = '', type = 0) => {
        try {
            if (!patientId || patientId == '') {
                return;
            }
            this.hideShowConfirmationModal();
            switch (type) {
                case 1:
                    await this.props.moveToCheckIn({ patientId: patientId });
                    break;
                case 2:
                    await this.props.moveToServed({ patientId: patientId });
                    break;
                default:
                    break;
            }
            return;
        } catch (error) {
            console.log('\n confirmToMove error:', error.message || error);
            let message = error.message || 'Something went wrong in confirmToMove';
            errorToast(message)
        }
    }

    onSelectQuickResponse = (quickMessage = '') => {
        try {
            this.chatChild.getAlert(quickMessage);
        } catch (err) {
            console.log('\n onSelectQuickResponse error:', err.message || err);
            let message = err.message || 'Something went wrong in onSelectQuickResponse';
            errorToast(message)
        }
    }

    onFinishCountDown = (index) => {
        try {
            if (index < 0) {
                return;
            }
            const payload = {
                index: index,
                countDownFinish: true
            }
            this.props.countDownFinish(payload);
        } catch (err) {
            console.log('\n onFinishCountDown err:', err.message || err);
        }
    }

    onRemoveProfileFromChat = (popupData, listType) => {
        try {
            let selectedData = (popupData.patientId) ? popupData.patientId : {};
            const firstname = (selectedData.first_name) ? capitalize(selectedData.first_name) : null;
            const lastname = (selectedData.last_name) ? capitalize(selectedData.last_name) : '';
            const fullNumber = (selectedData.fullNumber) ? selectedData.fullNumber : '';
            let fullName = (!firstname) ? fullNumber : `${firstname} ${lastname}`
            selectedData['fullName'] = fullName;
            switch (listType) {
                case 'waiting':
                    selectedData['recordType'] = 1;
                    break;
                case 'checkInOut':
                    selectedData['recordType'] = 2;
                    break;
                case 'servedSection':
                    selectedData['recordType'] = 3;
                    break;
                default:
                    break;
            }
            this.setState({ selected: selectedData, isModelShow: true, deleteType: 2 });

        } catch (err) {
            console.log('\n homePage.onRemoveProfileFromChat:', err.message || err);
        }
    }
    calculateTotalUnread = async () => {
        try {
            const { waitingList, checkInOutList, servedPatient } = this.props;
            console.log('\n waitingList:', waitingList)
            let { totalUnreadWaitingList, totalUnreadCheckInOutList, totalUnreadServedPatient } = this.state;
            totalUnreadWaitingList = 0, totalUnreadCheckInOutList = 0, totalUnreadServedPatient = 0;
            if (waitingList && waitingList.length > 0) {
                console.log('\n waitinglist section...', waitingList.length)
                waitingList.forEach(function (single) {
                    if (single.chat_messages && (single.chat_messages > 0)) {
                        totalUnreadWaitingList = totalUnreadWaitingList + 1;
                    }
                })
            }
            if (checkInOutList && checkInOutList.length > 0) {
                console.log('\n checkInOutList section...', checkInOutList.length)
                checkInOutList.forEach(function (single) {
                    if (single.chat_messages && (single.chat_messages > 0)) {
                        totalUnreadCheckInOutList = totalUnreadCheckInOutList + 1;
                    }
                })
            }
            if (servedPatient && servedPatient.length > 0) {
                console.log('\n servedPatient section...', servedPatient.length)
                servedPatient.forEach(function (single) {
                    if (single.chat_messages && (single.chat_messages > 0)) {
                        totalUnreadServedPatient = totalUnreadServedPatient + 1;
                    }
                })
            }
            this.setState({ totalUnreadWaitingList, totalUnreadCheckInOutList, totalUnreadServedPatient });
            return;
        } catch (e) {
            console.log('\n error in calculateTotalUnread:', e.message || e);
        }
    }
    addClientPopupOpen = async () => {
        if(this.props.user &&  !this.props.user.default_location) {
            this.props.OpenLocationModelAction();
            return;
        }
        this.setState({ isAddClientModelShow: true });
    }
    hideAddClientModal = () => {
        this.setState({
            isAddClientModelShow: false,
            client: { first_name: '', last_name: '', fullNumber: '', dob: '', visitNotes: '', parkingSpot: '' },
            clientError: { first_name: false, last_name: false, fullNumber: false, dob: false, visitNotes: false, parkingSpot: false }
        });
    }
    submitClientInfo = async () => {
        try {
            if(this.props.user &&  !this.props.user.default_location) {
                errorToast('Please select a location before add client.')
                return;
            }

            const { client, clientError } = this.state;
            if (!client.first_name || client.first_name == '') {
                clientError['first_name'] = true;
            }
            if (!client.last_name || client.last_name == '') {
                clientError['last_name'] = true;
            }
            if (!client.fullNumber || client.fullNumber == '') {
                clientError['fullNumber'] = true;
            }
            if (!client.dob || client.dob == '') {
                clientError['dob'] = true;
            }
            if (clientError.first_name || clientError.last_name || clientError.fullNumber || clientError.dob) {
                this.setState({ ...clientError });
                return;
            }
            const payload = {
                first_name: client.first_name,
                last_name: client.last_name,
                fullNumber: client.fullNumber,
                dob: moment(client.dob).format('MM/DD/yyyy'),
                waitingOrCheckIn: (client.waitingOrCheckIn) ? true : false
            }
            if (client.visitNotes && (client.visitNotes !== '')) {
                payload["visitNotes"] = client.visitNotes;
            }
            if (client.parkingSpot && (client.parkingSpot !== '')) {
                payload["parkingSpot"] = client.parkingSpot;
            }
            await this.props.createProfileAction(payload);
        } catch (err) {
            console.log('\n submitClientInfo error :', err.message || err);
        }
    }
    handleClientChange = (event, type = 1) => {
        try {
            if (type === 1) {
                let { name, value } = event.target;
                const { client, clientError } = this.state;
                clientError[name] = false;
                if (!value && (name !== 'visitNotes' && name !== 'parkingSpot')) {
                    clientError[name] = true;
                }
                client[name] = value;
                this.setState({ ...client, ...clientError });
            } else if (type === 2) {
                const { client, clientError } = this.state;
                clientError["fullNumber"] = false;
                if (!event) {
                    clientError["fullNumber"] = true;
                }
                client["fullNumber"] = event;
                this.setState({ ...client, ...clientError });
            } else if (type === 3) {
                console.log('\n event:', event);
                const { client, clientError } = this.state;
                clientError["dob"] = false;
                if (!event) {
                    clientError["dob"] = true;
                }
                client["dob"] = event;
                this.setState({ ...client, ...clientError });
            } else if(type === 4) {
                const { client } = this.state;
                client['waitingOrCheckIn'] = event.target.checked;
                this.setState({ ...client});
            }
        } catch (err) {
            console.log('\n err  in handleClientChange:', err.message || err);
        }

    }

    confirmDocumentReview = async (index = -1) => {
        try {
            if (index < 0) {
                return;
            }
            const id = this.props.waitingList[index]._id ;
            if(!id) return;
            await this.props.reviewDocument({ id: id });
            return;
        } catch (error) {
            console.log('\n confirmDocumentReview error:', error.message || error);
            let message = error.message || 'Something went wrong in confirmDocumentReview';
            errorToast(message)
        }
    }

    render() {
        const { notifyDiv, isChatModelShow,
            isModelShow, iscollapsed, deleteType,
            selected, isConfirmModelShow,
            popupData, listType,
            isConfirmationModalShow,
            manuallyNotify, manuallyNotifyError, manuallyNotifyErrorMessage,
            totalUnreadWaitingList, totalUnreadCheckInOutList, totalUnreadServedPatient,
            isAddClientModelShow, client, clientError } = this.state;
        const { waitingList, isWaiting,
            isCheckInOUT, checkInOutList,
            isServed, servedPatient, isNotifyProccess } = this.props;
        return (
            <section className={iscollapsed ? 'contbx-wrap relative-pos opened' : 'contbx-wrap relative-pos collapsed'}>
                <div className="add-client-btn-box">
                    <button type="button" className="client-btn btn btnn-hide" onClick={() => this.addClientPopupOpen()}>
                        <span> <img src={plusBlue} alt="" /></span>
                    </button>
                </div>
                <div className="serv-btn-box">
                    <button type="button" className="served-btn btn btnn-hide" onClick={() => this.collapsedSection()}>
                        <span> <img src={plusBlue} alt="" /></span>
                        <span className="tex-serv-btn">Served</span>
                    </button>
                </div>
                <div className="cstm-container">
                    <div className="row justify-center">
                        <div className="col-md-4">
                            <div className="back-holder">
                                <div className="box-head">
                                    <h1>Waiting in line</h1>
                                    {totalUnreadWaitingList > 0 &&
                                        <h1 className="chatno message-count">{totalUnreadWaitingList}</h1>
                                    }
                                    {waitingList &&
                                        <h6 className="darkblue">
                                            <span>{waitingList.length}</span> people
                                        </h6>}
                                </div>
                                <div className="bxflow-container">
                                    {!isWaiting && waitingList && waitingList.length > 0 ?
                                        waitingList.map((value, index) => (
                                            <div className={"action-footbx " + (value.uploadNotify ? 'box-holder patient-file-upload' : 'box-holder')} key={'w_' + index}>
                                                <div className="spot-row">
                                                    <h6>Spot: {this.getField(index, 'parkingSpot', 'waiting')}</h6>
                                                    <span>
                                                        <button type="button" name="button" className="btn" onClick={() => this.backDropModal(index, 1)}>
                                                            <img src={cancelImage} alt="" />
                                                        </button>
                                                    </span>
                                                </div>
                                                <div className="middlebx">
                                                    <div className="lftbx">
                                                        <h1 onClick={() => this.backChatDropModal(index, 'waiting')}>{this.getField(index, 'name', 'waiting')}</h1>
                                                        {this.calculateDiff(index, value.inQueueAt)}
                                                        <p className={(value.overFlow) ? 'red' : ''}>
                                                            {this.getMomentTime(1, value.inQueueAt)}
                                                            <span className="left-margin">({this.getMomentTime(2, value.inQueueAt)})</span>
                                                        </p>
                                                    </div>
                                                    <div className="iconbx">
                                                        <div className="grybxwrap">
                                                            <button type="button" name="button" className="chatbtn" onClick={() => this.backChatDropModal(index, 'waiting')}>
                                                                <img src={chatImage} alt="" />
                                                                {value.chat_messages > 0 &&
                                                                    <span className="chatno">{value.chat_messages}</span>
                                                                }
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={"action-footbx " + (notifyDiv === index ? 'alert-open' : '')}>
                                                    <div className="basic-infobx">
                                                        <div className="action-btns">
                                                            {/* {!value.isNotify ? <button type="button" name="button" className="notifybtn" onClick={() => this.handleClickOnNotify(index)} disabled={isNotifyProccess}>
                                                                <img src={bellImage} alt="" />
                                                            </button> :
                                                                <div className="count-down" onClick={() => this.handleClickOnNotify(index)}> <Countdown patientIndex={index} notifyMinutes={value.notifyTime} onFinishCountDown={this.onFinishCountDown} /></div>
                                                            } */}
                                                            {value.reviewDocument ? 
                                                            <button type="button" name="button" className="checkbtn" onClick={() => this.hideShowConfirmationModal(true, index, 'waiting')} disabled={this.props.isMoveToCheckIn} >
                                                                    <img src={checkImage} alt="" />
                                                            </button>
                                                            :
                                                            <button type="button" name="button" className="checkbtn" onClick={() => this.confirmDocumentReview(index)} disabled={this.props.isMoveToCheckIn} >
                                                                <img src={documentImage} alt="" />
                                                            </button>
                                                            }
                                                        </div>
                                                        {/* {value.noShow && <div className="notify-btn no-show-section">
                                                            <button type="button" name="button" className="btn redbtn">NO SHOW</button>
                                                        </div>} */}
                                                        <div className="notify-btn no-show-section">
                                                            {(value.patientId && value.patientId.carOrLobby && value.patientId.carOrLobby === 1) ?
                                                                <img src={chairSVG} alt="" /> : 
                                                                <img src={carSVG} alt="" />
                                                            }
                                                            {value.uploadNotify &&
                                                                <img className="paper-click-img" src={paperClipSVG} alt="" />
                                                            }
                                                        </div>
                                                        <div className={(value.is_delay || value.isNotify) ? "notify-btn" : ""}>
                                                            {value.is_delay ?
                                                                <button type="button" name="button" className="btn redbtn">Delay</button>
                                                                :
                                                                (value.countDownFinish && value.isNotify) ? <button type="button" name="button" className="btn">Notified at <span>{this.getMomentTime(1, value.notifyAt)}</span> </button> :
                                                                    <span></span>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="alert-infobx">
                                                        <span>
                                                            <button type="button" name="button" className="btn" onClick={() => this.handleClickOnNotify(-1)}>
                                                                <img src={cancelImage} alt="" />
                                                            </button>
                                                        </span>
                                                        <div className="alert-inner">
                                                            <ul className="timetags">
                                                                <li> <button type="button" name="button" className="btn" onClick={() => this.notifyTime(0, index)} disabled={isNotifyProccess}>Now</button> </li>
                                                                <li> <button type="button" name="button" className="btn" onClick={() => this.notifyTime(10, index)} disabled={isNotifyProccess}>10 Mins</button> </li>
                                                                <li> <button type="button" name="button" className="btn" onClick={() => this.notifyTime(15, index)} disabled={isNotifyProccess}>15 Mins</button> </li>
                                                                <li> <button type="button" name="button" className="btn" onClick={() => this.notifyTime(20, index)} disabled={isNotifyProccess}>20 Mins</button> </li>
                                                            </ul>
                                                            <ul className="date-inputs">
                                                                <li className="input-holder">
                                                                    <input type="text" name="" value={manuallyNotify} className="form-control" placeholder="Enter time in minutes..." onChange={(e) => this.manuallyNotify(e)} />
                                                                    {manuallyNotifyError &&
                                                                        <span className='error-alert error help-block'>{manuallyNotifyErrorMessage}</span>}
                                                                </li>
                                                                <li className="check-submit">
                                                                    <button type="button" name="button" className="btn subcheckbtn" onClick={() => this.submitNotificationTime(-1, index)} disabled={isNotifyProccess}>
                                                                        <img src={checkImage} alt="" />
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : <div className="box-holder txt-center">
                                            {isWaiting && <span>Loading....</span>}
                                            {!isWaiting && <span>No Patient InTo Waiting LIst For the Day</span>}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="back-holder">
                                <div className="box-head">
                                    <h1>Check-in/Check-out</h1>
                                    {totalUnreadCheckInOutList > 0 &&
                                        <h1 className="chatno message-count">{totalUnreadCheckInOutList}</h1>
                                    }
                                    {checkInOutList &&
                                        <h6 className="darkblue">
                                            <span>{checkInOutList.length}</span> people
                                        </h6>}
                                </div>
                                <div className="bxflow-container">
                                    {!isCheckInOUT && checkInOutList && checkInOutList.length > 0 ?
                                        checkInOutList.map((value, index) => (
                                            <div className="box-holder" key={'c_' + index}>
                                                <div className="spot-row">
                                                    <h6>Spot: {this.getField(index, 'parkingSpot', 'checkInout')}</h6>
                                                    <span>
                                                        <button type="button" name="button" className="btn" onClick={() => this.backDropModal(index, 2)}>
                                                            <img src={cancelImage} alt="" />
                                                        </button>
                                                    </span>
                                                </div>
                                                <div className="middlebx">
                                                    <div className="lftbx">
                                                        <h1 onClick={() => this.backChatDropModal(index, 'checkInOut')}>{this.getField(index, 'name', 'checkInout')}</h1>
                                                        <p>
                                                            {this.getMomentTime(1, value.checkIn)}
                                                            {/* <span className="left-margin">({this.getMomentTime(2, value.checkIn)})</span> */}
                                                        </p>
                                                    </div>
                                                    <div className="iconbx">
                                                        <div className="grybxwrap">
                                                            <div className="chatbtn" onClick={() => this.backChatDropModal(index, 'checkInOut')}>
                                                                <img src={chatImage} alt="" />
                                                                {value.chat_messages > 0 &&
                                                                    <span className="chatno">{value.chat_messages}</span>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={"action-footbx " + (notifyDiv === 10 ? 'alert-open' : '')}>
                                                    <div className="basic-infobx">
                                                        <div className="action-btns">
                                                            <button type="button" name="button" className="checkbtn" onClick={() => this.hideShowConfirmationModal(true, index, 'checkInOut')} disabled={this.props.isMoveToServed}>
                                                                <img src={exploreImage} alt="" />
                                                            </button>
                                                        </div>
                                                        <div className="notify-btn">
                                                            <button type="button" name="button" className="btn">With Provider</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : <div className="box-holder txt-center">
                                            {isCheckInOUT && <span>Loading....</span>}
                                            {!isCheckInOUT && <span>No Check In-Out Patient For the data</span>}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 hide-collapse">
                            <div className="back-holder">
                                <div className="closebtn-box">
                                    <button type="button" className="btn mins-btn" onClick={() => this.collapsedSection()}></button>
                                </div>
                                <div className="box-head">
                                    <h1>Clients served today
                                        <span>{servedPatient.length}</span>
                                    </h1>
                                    {totalUnreadServedPatient > 0 &&
                                        <h1 className="chatno message-count">{totalUnreadServedPatient}</h1>
                                    }
                                </div>
                                <div className="bxflow-container">
                                    {!isServed && servedPatient && servedPatient.length > 0 ?
                                        servedPatient.map((value, index) => (
                                            <div className="box-holder" key={'s_' + index}>
                                                <div className="spot-row">
                                                    <h6>Spot: {this.getField(index, 'parkingSpot', 'served')}</h6>
                                                    {/* <span>
                                            <button type="button" name="button" className="btn" onClick={()=> this.backDropModal(index, 3)}>
                                                <img src={cancelImage} alt=""/>
                                            </button>
                                        </span> */}
                                                </div>
                                                <div className="middlebx">
                                                    <div className="lftbx">
                                                        <h1 onClick={() => this.backChatDropModal(index, 'servedSection')}>{this.getField(index, 'name', 'served')}</h1>
                                                        <p>
                                                            {this.getMomentTime(1, value.checkOut)}
                                                            {/* <span className="left-margin">({this.getMomentTime(2, value.checkOut)})</span> */}
                                                        </p>
                                                    </div>
                                                    <div className="iconbx">
                                                        <div className="grybxwrap">
                                                            <button type="button" name="button" className="chatbtn" onClick={() => this.backChatDropModal(index, 'servedSection')}>
                                                                <img src={chatImage} alt="" />
                                                                {value.chat_messages > 0 &&
                                                                    <span className="chatno">{value.chat_messages}</span>
                                                                }
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={"action-footbx " + (notifyDiv === 11 ? 'alert-open' : '')}>
                                                    <div className="basic-infobx">
                                                        <div className="action-btns">

                                                        </div>
                                                        <div className="notify-btn">
                                                            <button type="button" name="button" className="btn">Exited</button>
                                                            <button type="button" name="button" className="btn ml-2">{value.isExisting ? 'Existing' : 'New'}</button>
                                                            {value.subPatientData.length === 0 ? '' : <button type="button" name="button" className="btn ml-2">Multi-patient</button>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )) :
                                        <div className="box-holder txt-center">
                                            {isServed && <span>Loading....</span>}
                                            {!isServed && <span>No Served Patient For the Day</span>}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <Modal
                    show={isModelShow}
                    onHide={() => this.hideModal()}
                    onEntered={() => this.modalLoaded()}
                    dialogClassName={"modal-dialog-centered"}
                    contentClassName={"delete-modal-content"}
                >
                    <div className="modal-header">
                        <button type="button" className="close" onClick={() => this.hideModal()}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    {deleteType === 1 &&
                        <div className="modal-body">
                            <div className="icon-holder">
                                <img src={dustbinImage} alt="" />
                            </div>
                            <h1>You have chosen to remove <br />{selected.fullName ? selected.fullName : ''} profile from the list.</h1>
                            <p>(Note: This does not permanently delete the profile)</p>
                        </div>
                    }
                    {deleteType === 2 &&
                        <div className="modal-body">
                            <h1>You have selected DELETE. Please Confirm.</h1>
                            <p>This will permanently delete the profile along with all its data</p>
                        </div>
                    }


                    {deleteType === 1 &&
                        <div className="modal-footer">
                            {/* <button type="button" className="btn bluebtn" onClick={()=> this.handleClickOnNotShow()}>No Show</button> */}
                            <button type="button" className="btn redbtn" onClick={() => this.handleClickOnRemoveProfile(1)}>Remove profile</button>
                        </div>
                    }
                    {deleteType === 2 &&
                        <div className="modal-footer">
                            <button type="button" className="btn redbtn" onClick={() => this.handleClickOnRemoveProfile(1)}>Delete</button>
                            <button type="button" className="btn bluebtn" onClick={() => this.hideModal()}>DON'T DELETE</button>
                        </div>
                    }
                </Modal>
                <Modal
                    show={isConfirmModelShow}
                    onHide={() => this.handleClickOnRemoveProfile(0)}
                    dialogClassName={"modal-dialog-centered"}
                    contentClassName={"delete-modal-content"}
                >
                    <div className="modal-header">
                        <button type="button" className="close" onClick={() => this.handleClickOnRemoveProfile(0)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="icon-holder">
                            <img src={dustbinImage} alt="" />
                        </div>
                        <h1>Are you sure<br />To Remove {selected.fullName ? selected.fullName : ''} profile permanently from the list.</h1>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn bluebtn" onClick={() => this.handleClickOnRemoveProfile(0)}>No</button>
                        <button type="button" className="btn redbtn" onClick={() => this.handleClickOnRemoveProfile(2)}>Confirm</button>
                    </div>
                </Modal>
                <Modal
                    show={isChatModelShow}
                    onHide={() => this.hideChatModal()}
                    onEntered={() => this.modalChatLoaded()}
                    dialogClassName={"modal-dialog-centered"}
                    className="checkin-popup-box show"
                >
                    <div className="modal-header">
                        <div className="cancel-chatbtn">
                            <button type="button" className="close" onClick={() => this.hideChatModal()}>
                                <img src={deleteImage} alt="" />
                            </button>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="chatbx-container">
                            <div className="cstm-overlay">
                                <div className="cstm-container">
                                    <div className="row">
                                        <ChatInformation popupData={popupData} listType={listType} getMomentTime={this.getMomentTime} onRemoveProfileFromChat={this.onRemoveProfileFromChat} confirmToMove={this.confirmToMove} />
                                        <ChatBox popupData={popupData} listType={listType} onRef={ref => (this.chatChild = ref)} getMomentTime={this.getMomentTime} />
                                        <QuickResponse popupData={popupData} listType={listType} onSelectQuickResponse={this.onSelectQuickResponse} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                <Modal
                    show={isConfirmationModalShow}
                    onHide={() => this.hideShowConfirmationModal()}
                    dialogClassName={"modal-dialog-centered"}
                    contentClassName={"delete-modal-content"}
                >
                    <div className="modal-header">

                        <button type="button" className="close" onClick={() => this.hideShowConfirmationModal()}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="icon-holder">
                            <img src={checkImage} alt="" />
                        </div>
                        <h1>Are You Sure you want to move <br />{this.state.moveObject.userName} profile to next Column.</h1>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn redbtn" onClick={() => this.hideShowConfirmationModal()}>No</button>
                        <button type="button" className="btn bluebtn" onClick={() => this.confirmToMove(this.state.moveObject.id, this.state.moveObject.columnType)}>Yes</button>
                    </div>
                </Modal>
                <Modal
                    show={isAddClientModelShow}
                    onHide={() => this.hideAddClientModal()}
                    dialogClassName={"modal-dialog-centered"}
                    contentClassName={"delete-modal-content profile-modal-content"}
                >
                    <div className="modal-header add-client-header">
                        <h1>Create Profile</h1>
                        <div className="statusbtns toogle-statusbtns">
                        <div className="togglebtn-holder">
                                <div className="btn-holder imgbtn-holder">
                                    <label className="switch">
                                        <input type="checkbox" 
                                        name="waitingOrCheckIn"
                                        checked={client.waitingOrCheckIn}
                                        value={client.waitingOrCheckIn}
                                        onChange={(e) => this.handleClientChange(e, 4)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                        </div>
                        </div>
                        <button type="button" className="close" onClick={() => this.hideAddClientModal()}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        
                    </div>
                    <div className="modal-body add-client-body">
                        <div className="row">

                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" name="first_name" value={client.first_name} className={clientError.first_name ? 'form-control error-box' : 'form-control'} placeholder="First Name" onChange={(e) => this.handleClientChange(e)} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" name="last_name" value={client.last_name} className={clientError.last_name ? 'form-control error-box' : 'form-control'} placeholder="Last Name" onChange={(e) => this.handleClientChange(e)} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <PhoneInput
                                        name="fullNumber"
                                        className={clientError.fullNumber ? 'form-control error-box' : 'form-control'}
                                        international
                                        defaultCountry="US"
                                        value={client.fullNumber}
                                        onChange={value => this.handleClientChange(value, 2)} />
                                    {/* <input type="text" name="fullNumber" value={client.fullNumber} className="form-control" placeholder="Phone Number:(222)-555-2323" onChange={(e) => this.handleClientChange(e)} /> */}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <div className='react-date-picker'>
                                        <DatePicker
                                        calendarClassName="dob-calender"
                                        placeholderText='Date of birth'
                                        dateFormat="dd-MM-yyyy"
                                            className={clientError.dob ? 'form-control error-box dob-main' : 'form-control dob-main'}
                                            renderCustomHeader={({
                                                date,
                                                changeYear,
                                                changeMonth,
                                                decreaseMonth,
                                                increaseMonth,
                                                prevMonthButtonDisabled,
                                                nextMonthButtonDisabled,
                                            }) => (
                                                <div className='calender-popup-box' >
                                                    <button className='left-date-slider' onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                                        {"<"}
                                                    </button>
                                                    <select
                                                        className='year-selecter'
                                                        value={getYear(date)}
                                                        onChange={({ target: { value } }) => changeYear(value)}
                                                    >
                                                        {this.state.years.map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <select
                                                       className='month-selecter'
                                                        value={this.state.months[getMonth(date)]}
                                                        onChange={({ target: { value } }) =>
                                                            changeMonth(this.state.months.indexOf(value))
                                                        }
                                                    >
                                                        {this.state.months.map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <button className='right-date-slider' onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                                        {">"}
                                                    </button>


                                                </div>
                                            )}
                                            selected={client.dob}
                                            onChange={(date) => this.handleClientChange(date, 3)}
                                        />
                                        {/* <input type="text" name="dob" value={client.dob} className="form-control" placeholder="Date of Birth(01/01/2021)" onChange={(e) => this.handleClientChange(e)} /> */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <textarea name="visitNotes" rows="6" cols="" value={client.visitNotes} className={clientError.visitNotes ? 'form-control error-box' : 'form-control'} placeholder="Reason for visit" onChange={(e) => this.handleClientChange(e)}></textarea>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="parkinSpot">
                                    <div className="form-group">
                                        <input 
                                        type="text" 
                                        onKeyPress={(event) => {
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                        name="parkingSpot" value={client.parkingSpot} className={clientError.parkingSpot ? 'form-control error-box' : 'form-control'} placeholder="Parking Spot Number(if applicable)" onChange={(e) => this.handleClientChange(e)} />
                                    </div>
                                </div>
                                {/* <div className="attachment  ">
                                    <div className="form-group">
                                        <div className="form-control atchment-holder">
                                            <label htmlFor="atachment">Attachments:</label>
                                            <div className="atchment-body">
                                                <ul>
                                                    <li>
                                                        <div className="atchpill">
                                                            <span>ID</span>
                                                            <span className="icon">
                                                                <img src={userImage} alt="" />
                                                            </span>
                                                        </div>
                                                        <div className="atchmentinfo">JohnDoe_ID.jpg</div>
                                                    </li>
                                                    <li>
                                                        <div className="atchpill insur">
                                                            <span> <img src={medicalImage} alt="" /> </span>
                                                            <span className="icon">
                                                                <img src={userImage} alt="" />
                                                            </span>
                                                        </div>
                                                        <div className="atchmentinfo">JohnDoe_Insurance.jpg</div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer add-client-footer">
                        <button type="button" className="btn bluebtn" onClick={() => this.submitClientInfo()} disabled={clientError.first_name || clientError.last_name || clientError.fullNumber || clientError.dob}>Save</button>
                    </div>
                </Modal>
            </section>
        );
    }
}

function mapState(state) {
    const { commons, authentication } = state;
    const { waitingList, isWaiting,
        isCheckInOUT, checkInOutList,
        isServed, servedPatient, isMoveToCheckIn, isMoveToServed, isNotifyProccess, updatedPatient, addClientProccess } = commons;
    const { user } = authentication;
        return {
        waitingList, isWaiting,
        isCheckInOUT, checkInOutList,
        isServed, servedPatient,
        isMoveToCheckIn,
        isMoveToServed,
        isNotifyProccess,
        updatedPatient,
        addClientProccess,
        user
    };
}

const actionCreators = {
    getwaitingList: commonActions.fetchWaitingList,
    getCheckInOutList: commonActions.fetchCheckInOutList,
    getServedPatientList: commonActions.fetchServedPatientList,
    moveToCheckIn: commonActions.waitingToCheckIn,
    moveToServed: commonActions.checkInToCheckOut,
    notifyPatient: commonActions.notifyPatient,
    overWaitingTimeForPatient: commonActions.overWaitingTimeForPatient,
    removePatient: commonActions.removePatient,
    countDownFinish: commonActions.countDownFinish,
    unreadMessage: commonActions.unreadMessage,
    createProfileAction: commonActions.createProfileAction,
    OpenLocationModelAction : userActions.OpenLocationModelAction,
    closeLocationModelAction :userActions.closeLocationModelAction,
    reviewDocument: commonActions.reviewDocument,
}

export default connect(mapState, actionCreators)(HomePage);