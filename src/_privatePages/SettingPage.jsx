import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { expandImage, canceldrop } from '../_assets';
import { formConstants } from '../_constants';
import config from 'config';
import {
    fetchFormType,
    validateFields,
    validateForm,
    fetchAPIEndpoint, errorToast
} from '../_helpers';
import { EditSetting } from '../_childPages';
import { userActions } from '../_actions';
import { default as cameraSVG } from '../_assets/images/camera.svg';


class SettingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: {
                BusinessInformation: {
                    companyName: '',
                    companyAddress: '',
                    companyNumber: '',
                    selectedTimeZone: '',
                    selectedLanguage: ''
                },
                ScheduleInformation: {
                    isScheduleOpen: false,
                    selectedTimeZone: '',
                    openingTime: '',
                    closingTime: '',
                },
                AlertSettings: {
                    confirmation: false,
                    nextInLine: false,
                    checkingIn: false,
                    checkOut: false,
                    noShow: false,
                    parkingSpot: false,
                    companyOff:true,
                    reviewLink:true,
                    providerNotAtDesk:false
                },
                AdditionalFeatures: {
                    desktopNotification: false,
                    clientPosition: false,
                    timer: false,
                    checkIn: false,
                    exit: false,
                    delay: false,
                    isSendStatus:false,
                    sendStatusTime: 0
                },
                Styling: {
                    stylingScreen: false
                },
                ClientInformation: {
                    name: true,
                    clientName: false,
                    firstLastName: false
                },
                SignageInformation: {
                    companyName: '',
                    companyAddress: '',
                    generatedPhoneNumber: '',
                    signNumber: ''
                },
            },
            errors: {
                BusinessInformation: {
                    companyName: { info: '', status: true },
                    companyAddress: { info: '', status: true },
                    companyNumber: { info: '', status: true },
                },
                ScheduleInformation: {
                },
                AlertSettings: {

                },
                AdditionalFeatures: {
                    sendStatusTime: false
                },
                Styling: {

                },
                ClientInformation: {

                },
                SignageInformation: {
                    companyName: { info: '', status: true },
                    companyAddress: { info: '', status: true },
                    generatedPhoneNumber: { info: '', status: true },
                    signNumber: { info: '', status: true }
                },
                certainTime:false
            },
            submitted: {
                BusinessInformation: false,
                ScheduleInformation: false,
                AlertSettings: false,
                AdditionalFeatures: false,
                Styling: false,
                ClientInformation: false,
                SignageInformation: false
            },
            timeZoneOptions: [],
            languages: [
                { value: 'english', name: 'English', label: 'English' },
                { value: 'hindi', name: 'Hindi', label: 'Hindi' },
            ],
            childSelection: -1,
            AlertMessages: {
                confirmation: '',
                confirmation_new: '',
                nextInLine: '',
                checkingIn: '',
                checkOut: '',
                noShow: '',
                parkingSpot: '',
                companyOff:'',
                reviewLink:'',
                providerNotAtDesk:''
            },
            isEdited: false,
            logoImage: '', 
            logoContent: null,
            companylogoContent:null,
            companylogoImage:'',
            certainTime: ''
        };
    }
    async componentDidMount() {
        this.getTimeZone();
        this.setFieldData(this.props.settingData);
    }
    componentWillReceiveProps(nextProps) {
        if (!nextProps.settingData) {
            return;
        }
        this.setFieldData(nextProps.settingData);
    }
    setFieldData(settingData = {}) {
        try {
            let { settings,companylogoImage,logoImage, AlertMessages, errors,certainTime } = this.state;
            if (!settingData) {
                return;
            }
            if (settingData.businessInformation) {
                const businessData = settingData.businessInformation;
                settings.BusinessInformation.companyName = (businessData.companyName) ? businessData.companyName : '';
                settings.BusinessInformation.companyAddress = (businessData.companyAddress) ? businessData.companyAddress : '';
                settings.BusinessInformation.companyNumber = (businessData.companyNumber) ? businessData.companyNumber : '';
                settings.BusinessInformation.selectedTimeZone = (businessData.timeZone) ? businessData.timeZone : '';
                settings.BusinessInformation.selectedLanguage = (businessData.language) ? businessData.language : '';
                companylogoImage =  (businessData.logo) ? `${config.apiUrl}/images/logo/${businessData.logo}`: '';

                errors.BusinessInformation.companyName.status = (businessData.companyName) ? false : true;
                errors.BusinessInformation.companyAddress.status = (businessData.companyAddress) ? false : true;
                errors.BusinessInformation.companyNumber.status = (businessData.companyNumber) ? false : true;
            }

            settings.ScheduleInformation.isScheduleOpen = settingData.scheduleInformation?.isScheduleOpen || false;
            settings.ScheduleInformation.openingTime = settingData.scheduleInformation?.openingTime || '';
            settings.ScheduleInformation.closingTime = settingData.scheduleInformation?.closingTime || '';
            settings.ScheduleInformation.selectedTimeZone = settingData.scheduleInformation?.selectedTimeZone || '';


            settings.AlertSettings.checkingIn = (settingData.checkInAlert && settingData.checkInAlert.is_active) ? settingData.checkInAlert.is_active : false;
            settings.AlertSettings.checkOut = (settingData.checkOutAlert && settingData.checkOutAlert.is_active) ? settingData.checkOutAlert.is_active : false;
            settings.AlertSettings.confirmation = (settingData.confirmationAlert && settingData.confirmationAlert.is_active) ? settingData.confirmationAlert.is_active : false;
            settings.AlertSettings.nextInLine = (settingData.confirmationAlert && settingData.nextInLineAlert.is_active) ? settingData.nextInLineAlert.is_active : false;
            settings.AlertSettings.noShow = (settingData.noShowAlert && settingData.noShowAlert.is_active) ? settingData.noShowAlert.is_active : false;
            settings.AlertSettings.parkingSpot = (settingData.parkingSpotAlert && settingData.parkingSpotAlert.is_active) ? settingData.parkingSpotAlert.is_active : false;
            settings.AlertSettings.providerNotAtDesk = (settingData.providerNotAtDeskAlert && settingData.providerNotAtDeskAlert.is_active) ? settingData.providerNotAtDeskAlert.is_active : false;


            AlertMessages.checkingIn = (settingData.checkInAlert && settingData.checkInAlert.message) ? settingData.checkInAlert.message : '';
            AlertMessages.checkOut = (settingData.checkOutAlert && settingData.checkOutAlert.message) ? settingData.checkOutAlert.message : '';
            AlertMessages.confirmation = (settingData.confirmationAlert && settingData.confirmationAlert.message) ? settingData.confirmationAlert.message : '';
            AlertMessages.confirmation_new = (settingData.confirmationAlert && settingData.confirmationAlert.new_message) ? settingData.confirmationAlert.new_message : '';
            AlertMessages.nextInLine = (settingData.nextInLineAlert && settingData.nextInLineAlert.message) ? settingData.nextInLineAlert.message : '';
            AlertMessages.noShow = (settingData.noShowAlert && settingData.noShowAlert.message) ? settingData.noShowAlert.message : '';
            AlertMessages.parkingSpot = (settingData.parkingSpotAlert && settingData.parkingSpotAlert.message) ? settingData.parkingSpotAlert.message : '';
            AlertMessages.companyOff = (settingData.companyOffAlert && settingData.companyOffAlert.message) ? settingData.companyOffAlert.message : '';
            AlertMessages.reviewLink = (settingData.reviewLinkAlert && settingData.reviewLinkAlert.message) ? settingData.reviewLinkAlert.message : '';
            AlertMessages.providerNotAtDesk = (settingData.providerNotAtDeskAlert && settingData.providerNotAtDeskAlert.message) ? settingData.providerNotAtDeskAlert.message : '';
            certainTime = (settingData.providerNotAtDeskAlert && settingData.providerNotAtDeskAlert.certainTime) ? settingData.providerNotAtDeskAlert.certainTime : '';
            
            
            settings.AdditionalFeatures.desktopNotification = (settingData.desktopAdditional && settingData.desktopAdditional.is_active) ? settingData.desktopAdditional.is_active : false;
            settings.AdditionalFeatures.clientPosition = (settingData.inforClientPositionLine) ? settingData.inforClientPositionLine : false;
            settings.AdditionalFeatures.timer = (settingData.desktopAdditional && settingData.desktopAdditional.is_timer) ? settingData.desktopAdditional.is_timer : false;
            settings.AdditionalFeatures.checkIn = (settingData.desktopAdditional && settingData.desktopAdditional.is_checkIn) ? settingData.desktopAdditional.is_checkIn : false;
            settings.AdditionalFeatures.exit = (settingData.desktopAdditional && settingData.desktopAdditional.is_exit) ? settingData.desktopAdditional.is_exit : false;
            settings.AdditionalFeatures.delay = (settingData.desktopAdditional && settingData.desktopAdditional.is_delayed) ? settingData.desktopAdditional.is_delayed : false;

            settings.AdditionalFeatures.isSendStatus = (settingData.statusSetting && settingData.statusSetting.isSendStatus) ? settingData.statusSetting.isSendStatus : false;
            settings.AdditionalFeatures.sendStatusTime = (settingData.statusSetting && settingData.statusSetting.sendStatusTime) ? settingData.statusSetting.sendStatusTime : 0;
            
            
            settings.Styling.stylingScreen = (settingData.stylingScreen) ? settingData.stylingScreen : false;

            settings.ClientInformation.name = (settingData.clientInformation && settingData.clientInformation.name) ? settingData.clientInformation.name : false;
            settings.ClientInformation.clientName = (settingData.clientInformation && settingData.clientInformation.is_required) ? settingData.clientInformation.is_required : false;
            settings.ClientInformation.firstLastName = (settingData.clientInformation && settingData.clientInformation.firstLastName) ? settingData.clientInformation.firstLastName : false;
            if (settingData.signageInformation) {
                const signageData = settingData.signageInformation;
                settings.SignageInformation.companyName = (signageData.companyName) ? signageData.companyName : '';
                settings.SignageInformation.companyAddress = (signageData.companyAddress) ? signageData.companyAddress : '';
                settings.SignageInformation.generatedPhoneNumber = (signageData.generatedPhoneNumber) ? signageData.generatedPhoneNumber : '';
                settings.SignageInformation.signNumber = (signageData.signNumber) ? signageData.signNumber : '';
                logoImage =  (signageData.logo) ? `${config.apiUrl}/images/logo/${signageData.logo}`: '';
                errors.SignageInformation.companyName.status = (signageData.companyName) ? false : true;
                errors.SignageInformation.companyAddress.status = (signageData.companyAddress) ? false : true;
                errors.SignageInformation.generatedPhoneNumber.status = (signageData.generatedPhoneNumber) ? false : true;
                errors.SignageInformation.signNumber.status = (signageData.signNumber) ? false : true;

            }
            this.setState({ settings, AlertMessages, errors, logoImage, companylogoImage,certainTime})
        } catch (e) {
            let message = e.message || 'Something went wrong in setFieldData';
            errorToast(message)
        }

    }
    getTimeZone() {
        try {
            const ct = require('countries-and-timezones');
            const timezones = ct.getAllTimezones();
            const timeZoneArray = [];
            Object.values(timezones).forEach(
                (val) => {
                    val['value'] = val.aliasOf;
                    val['label'] = val.name;
                    timeZoneArray.push(val);
                }
            );
            this.setState({ timeZoneOptions: timeZoneArray })

        } catch (e) {
            console.log('\n error in getTimeZone:', e.message || e);
            let message = e.message || 'Something went wrong in getTimeZone';
            errorToast(message)
        }
    }

    async handleChange(event, type, checked = false) {
        try {
            let { name, value } = event.target;
            if (checked) {
                name = event.target.name;
                value = event.target.checked
            }
            const { settings, errors } = this.state;
            const formType = await fetchFormType(type);
            const updatedErrors = validateFields(name, value, errors[formType]);
            errors[formType] = updatedErrors;
            settings[formType] = { ...settings[formType], [name]: value };
            this.setState({
                settings,
                errors
            });
        } catch (e) {
            let message = e.message || 'Something went wrong in handleChange';
            errorToast(message)
        }

    }

    async handleCertainTimeChange(event) {
        try {
            let { value} = event.target;
            let {errors} = this.state;
            errors.certainTime= false;
            if(!value || value == '') {
                errors.certainTime =true;
            }
            this.setState({certainTime:value, errors})
        } catch (e) {
            let message = e.message || 'Something went wrong in handleCertainTimeChange';
            errorToast(message)
        }

    }
    async handleStatusTimeChange(event) {
        try {
            let { value} = event.target;
            let {settings, errors} = this.state;
            errors.AdditionalFeatures.sendStatusTime= false;
            if(!value || value == '') {
                errors.AdditionalFeatures.sendStatusTime =true;
            }
            if(isNaN(value)) {
                settings.AdditionalFeatures.sendStatusTime = null;
            }
            if(!isNaN(value) && value) {
                settings.AdditionalFeatures.sendStatusTime = parseInt(value);
            }
            this.setState({settings, errors})
        } catch (e) {
            let message = e.message || 'Something went wrong in handleStatusTimeChange';
            errorToast(message)
        }

    }

    handleSelectedChange = async (event, form, type) => {
        try {
            const { settings } = this.state;
            let value = event;
            const name = (type === 1) ? 'selectedTimeZone' : 'selectedLanguage';
            const formType = await fetchFormType(form);
            if (name == 'selectedTimeZone') {
                let option = {
                    label: value.label,
                    value: (value.value) ? value.value : value.name
                };
                if(form === 'ScheduleInformation') {
                    option['offset'] = value.utcOffset || value.dstOffset || 0
                }
                settings[formType] = { ...settings[formType], [name]: option };
            } else {
                settings[formType] = { ...settings[formType], [name]: value };
            }
            this.setState({ settings });
        } catch (e) {
            let message = e.message || 'Something went wrong in handleSelectedChange';
            errorToast(message)
        }
    }


    handleSubmit = async (e, type) => {
        try {
            e.preventDefault();
            const { settings, errors, logoContent, companylogoContent,certainTime} = this.state;
            const formType = await fetchFormType(type);
            const apiEndpoint = await fetchAPIEndpoint(type);
            this.setState({ submitted: { [formType]: true } });
            const checkError = await validateForm(errors[formType]);
            console.log('\n apiEndpoint:', apiEndpoint , '\n checkError:', checkError) ;
            if (!checkError) {
                console.error('not valid form.')
                return;
            }
            if(type !== 'ScheduleInformation' && (formType.AlertSettings && errors.certainTime || (isNaN(parseInt(certainTime))))) {
                this.setState({certainTime:''})
                return;
            }
            let payload = settings[formType];

            switch (formType) {
                case 'AlertSettings':
                    const { AlertMessages } = this.state;
                    payload = await this.createAlertPayload(settings[formType], AlertMessages, certainTime);
                    break;
                case 'AdditionalFeatures':
                    payload = await this.createAdditionalPayload(settings[formType]);
                    break;
                case 'ScheduleInformation':
                    payload = {...settings[formType]}
                    break;
                case 'ClientInformation':
                    payload = {
                        clientInformation: {
                            name: settings[formType].name,
                            is_required: settings[formType].clientName,
                            firstLastName: settings[formType].firstLastName
                        }
                    }
                case 'SignageInformation':
                    payload['avatar'] = logoContent;
                
                case 'BusinessInformation':
                    // this for busness information section
                    payload['avatar'] = companylogoContent;
                default:
                    break;
            }
            console.log("\n apiEndpoint:", apiEndpoint, "payload:", payload);
            this.props.updateSettings(apiEndpoint, payload);
        } catch (error) {
            console.log('\n error.handleSubmit :', error.message || error);
            let message = error.message || 'Something went wrong in handleSubmit';
            errorToast(message)
        }

    }
    onSelectChildEditCallack = (childData) => {
        this.setState({ childSelection: parseInt(childData) })
    }
    onSaveChildMessage = (index, message) => {
        try {
            const { AlertMessages } = this.state;
            switch (index) {
                case 1:
                    AlertMessages.confirmation = message;
                    break;
                case 2:
                    AlertMessages.nextInLine = message;
                    break;
                case 3:
                    AlertMessages.checkingIn = message;
                    break;
                case 4:
                    AlertMessages.checkOut = message;
                    break;
                case 5:
                    AlertMessages.noShow = message;
                    break;
                case 6:
                    AlertMessages.parkingSpot = message;
                    break;
                case 11:
                    AlertMessages.confirmation_new = message;
                    break;
                case 12:
                    AlertMessages.companyOff = message;
                    break;
                case 13:
                    AlertMessages.reviewLink = message;
                    break;
                case 14:
                    AlertMessages.providerNotAtDesk = message;
                    break;
                default:
                    break;
            }
            this.setState({ ...AlertMessages, childSelection: -1 });
        } catch (error) {
            console.log('\n error settingpage.onSaveChildMessage:', error.message || error)
            let message = error.message || 'Something went wrong in handleSubmit';
            errorToast(message)
        }
    }
    onSelectChildMessage = async (index) => {
        return new Promise((resolve) => {
            try {
                const { AlertMessages } = this.state;
                switch (index) {
                    case 1:
                        return resolve(AlertMessages.confirmation);
                    case 2:
                        return resolve(AlertMessages.nextInLine);
                    case 3:
                        return resolve(AlertMessages.checkingIn);
                    case 4:
                        return resolve(AlertMessages.checkOut);
                    case 5:
                        return resolve(AlertMessages.noShow);
                    case 6:
                        return resolve(AlertMessages.parkingSpot);
                    case 11:
                        return resolve(AlertMessages.confirmation_new);
                    case 12:
                        return resolve(AlertMessages.companyOff);
                    case 13:
                        return resolve(AlertMessages.reviewLink);
                    case 14:
                        return resolve(AlertMessages.providerNotAtDesk);
                    default:
                        break;
                }
            } catch (error) {
                console.log('\n error settingpage.onSaveChildMessage:', error.message || error)
                let message = error.message || 'Something went wrong in onSelectChildMessage';
                errorToast(message)
                return resolve(null);
            }

        })
    }
    createAlertPayload = (formData, messageData,certainTime='') => {
        return new Promise((resolve, reject) => {
            try {
                const payload = {
                    confirmationAlert: {
                        is_active: formData.confirmation,
                        message: messageData.confirmation,
                        new_message: messageData.confirmation_new
                    },
                    nextInLineAlert: {
                        is_active: formData.nextInLine,
                        message: messageData.nextInLine
                    },
                    checkInAlert: {
                        is_active: formData.checkingIn,
                        message: messageData.checkingIn
                    },
                    checkOutAlert: {
                        is_active: formData.checkOut,
                        message: messageData.checkOut
                    },
                    noShowAlert: {
                        is_active: formData.noShow,
                        message: messageData.noShow
                    },
                    parkingSpotAlert: {
                        is_active: formData.parkingSpot,
                        message: messageData.parkingSpot
                    },
                    companyOffAlert:{
                        is_active: formData.companyOff,
                        message: messageData.companyOff
                    },
                    reviewLinkAlert:{
                        is_active: formData.reviewLink,
                        message: messageData.reviewLink
                    },
                    providerNotAtDeskAlert:{
                        is_active: formData.providerNotAtDesk,
                        message: messageData.providerNotAtDesk,
                        certainTime: certainTime
                    }
                }
                return resolve(payload);
            } catch (error) {
                return reject(error);
            }
        })
    }
    createAdditionalPayload = (formData) => {
        return new Promise((resolve, reject) => {
            try {
                const payload = {
                    desktopAdditional: {
                        is_active: formData.desktopNotification,
                        is_timer: formData.timer,
                        is_exit: formData.exit,
                        is_checkIn: formData.checkIn,
                        is_delayed: formData.delay
                    },
                    inforClientPositionLine: formData.clientPosition,
                    statusSetting: {
                        isSendStatus:formData.isSendStatus,
                        sendStatusTime: (formData.sendStatusTime) ? formData.sendStatusTime : 0
                    }
                }
                return resolve(payload);
            } catch (error) {
                return reject(error);
            }
        })
    }

    handleEditSelection = (e) => {
        const { isEdited } = this.state;
        this.setState({ isEdited: !isEdited });
    }

    onImageChange = (event, type) => {
        try {
            if (event.target.files && event.target.files[0]) {
                if(type == formConstants.Signage_Information) {
                    this.setState({
                        logoImage: URL.createObjectURL(event.target.files[0]),
                        logoContent: event.target.files[0]
                    });
                } else {
                    // this for busness information section
                    this.setState({
                        companylogoImage: URL.createObjectURL(event.target.files[0]),
                        companylogoContent: event.target.files[0]
                    });
                }
            }
        } catch (err) {
            let message = (err && err.message) ? err.message : 'Something went wrong in handleSelectedChange';
            errorToast(message)
        }
    }
    updateImageOnClickImage = async (event, type) => {
        try {
            if(type == formConstants.Signage_Information) {
                document.getElementById("file-name2").click();
            } else {
                // this for busness information section
                document.getElementById("file-name1").click();
            }
        } catch (err) {
            let message = (err && err.message) ? err.message : 'Something went wrong in handleSelectedChange';
            errorToast(message)
        }
    }
    resetSelectedImage = async (event, type) => {
        if(type == formConstants.Signage_Information) {
            this.setState({ logoImage: '', logoContent: null })
        } else {
            // this for busness information section
            this.setState({ companylogoImage: '', companylogoContent: null })
        }
    }

    render() {
        const { settingUpdating } = this.props;
        const { settings, submitted,
            errors, languages,
            timeZoneOptions, childSelection, isEdited,
            logoImage, companylogoImage,certainTime } = this.state;
        return (
            <section className="settings-contbx-wrap">
                <div className="cstm-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="collapseinfo-holder">
                                <div className="accordion" id="settingsAccordion">
                                    <div className="card">
                                        <div className="card-header" id="headingOne">
                                            <h2 className="mb-0">
                                                <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                    Your Business Information (About Your Company)
                                                    <span className="expand-arrow">
                                                        <img src={expandImage} alt="" />
                                                    </span>
                                                </button>
                                            </h2>
                                        </div>

                                        <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#settingsAccordion">
                                            <div className="card-body">
                                                <div className="companyinfo-holder">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <input type="text" name="companyName" value={settings.BusinessInformation.companyName} className="form-control" placeholder="Company Name" onChange={(e) => this.handleChange(e, formConstants.Business_Information)} />
                                                                {errors.BusinessInformation.companyName.info.length > 0 &&
                                                                    <span className='error-alert error help-block'>{errors.BusinessInformation.companyName.info}</span>}
                                                                {submitted.BusinessInformation && errors.BusinessInformation.companyName.info.length === 0 && errors.BusinessInformation.companyName.status &&
                                                                    <span className='error-alert error help-block'>required</span>}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <input type="text" name="companyAddress" value={settings.BusinessInformation.companyAddress} className="form-control" placeholder="Company Address" onChange={(e) => this.handleChange(e, formConstants.Business_Information)} />
                                                                {errors.BusinessInformation.companyAddress.info.length > 0 &&
                                                                    <span className='error-alert error help-block'>{errors.BusinessInformation.companyAddress.info}</span>}
                                                                {submitted.BusinessInformation && errors.BusinessInformation.companyAddress.info.length === 0 && errors.BusinessInformation.companyAddress.status &&
                                                                    <span className='error-alert error help-block'>required</span>}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <input type="text"
                                                                onKeyPress={(event) => {
                                                                    if (!/[0-9]/.test(event.key)) {
                                                                        event.preventDefault();
                                                                    }
                                                                }}
                                                                 name="companyNumber" value={settings.BusinessInformation.companyNumber} className="form-control" placeholder="Company Number" readOnly />
                                                                {/* onChange={(e) => this.handleChange(e, formConstants.Business_Information)} */}
                                                                {errors.BusinessInformation.companyNumber.info.length > 0 &&
                                                                    <span className='error-alert error help-block'>{errors.BusinessInformation.companyNumber.info}</span>}
                                                                {submitted.BusinessInformation && errors.BusinessInformation.companyNumber.info.length === 0 && errors.BusinessInformation.companyNumber.status &&
                                                                    <span className='error-alert error help-block'>required</span>}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="uploadbx-holder">
                                                                <div className="innerbx">
                                                                    <div className="upload-area">
                                                                    {companylogoImage ?
                                                                    (<span><img id="target" src={companylogoImage} onClick={(e) => this.updateImageOnClickImage(e, formConstants.Business_Information)} /></span>):
                                                                       (<span> <img src={cameraSVG} alt="" onClick={(e) => this.updateImageOnClickImage(e, formConstants.Business_Information)} /> </span>)}
                                                                    <input className="upload-file-input" id="file-name1" multiple="" onChange={(e) => this.onImageChange(e, formConstants.Business_Information)} type="file" accept=".jpg,.jpeg,.png" />
                                                                    </div>
                                                                    <div className="addbtn-area">
                                                                        <label htmlFor="file-name1">Add Your Company Logo</label>
                                                                        <div className="upload-holder">
                                                                            <span className="uploadbtn"> <button type="button" name="button" className="btn" onClick={(e)=>this.updateImageOnClickImage(e,formConstants.Business_Information)} >Upload</button> </span>
                                                                            <span className="txinfo">Must be Black and White Vector PDF</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                        <div className="col-md-12">
                                                            <div className="dropdown">
                                                                <Select
                                                                    value={settings.BusinessInformation.selectedTimeZone}
                                                                    onChange={(e) => this.handleSelectedChange(e, formConstants.Business_Information, 1)}
                                                                    options={timeZoneOptions}
                                                                    className="btn"
                                                                    name="selectedTimeZone"
                                                                    placeholder="Time Zone"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="dropdown">
                                                                <Select
                                                                    value={settings.BusinessInformation.selectedLanguage}
                                                                    onChange={(e) => this.handleSelectedChange(e, formConstants.Business_Information, 2)}
                                                                    options={languages}
                                                                    className="btn"
                                                                    name="selectedLanguage"
                                                                    placeholder="Language"
                                                                />
                                                            </div>
                                                        </div>
                                                        </div>
                                                        <div className="col-md-12 submitbtn-holder">
                                                            <button type="submit" name="button" className="submit-btn btn" onClick={(e) => this.handleSubmit(e, formConstants.Business_Information)} disabled={settingUpdating}>
                                                                Save
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="card-header" id="headingOne">
                                            <h2 className="mb-0">
                                                <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseOne2" aria-expanded="true" aria-controls="collapseOne">
                                                    Clinic Timing
                                                    <span className="expand-arrow">
                                                        <img src={expandImage} alt="" />
                                                    </span>
                                                </button>
                                            </h2>
                                        </div>

                                        <div id="collapseOne2" className="collapse" aria-labelledby="headingOne" data-parent="#settingsAccordion">
                                            <div className="card-body">
                                                <div className="companyinfo-holder">
                                                    <div className="row">
                                                        <div className="col-12 mb-3">
                                                            <div className="togglebtn d-flex align-items-center">
                                                                <label className="switch">
                                                                    <input type="checkbox"
                                                                        name="isScheduleOpen"
                                                                        checked={settings.ScheduleInformation.isScheduleOpen}
                                                                        onChange={(e) => this.handleChange(e, formConstants.ScheduleInformation, true)}
                                                                    />
                                                                    <span className="slider round"></span>
                                                                </label>
                                                                &nbsp; <label className='mb-0 ml-2'>Schedule Open/Close Clinic</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label>Opening Time</label>
                                                                <input type="time" name="openingTime" value={settings.ScheduleInformation.openingTime} className="form-control" onChange={(e) => this.handleChange(e, formConstants.ScheduleInformation)} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label>Closing Time</label>
                                                                <input type="time" name="closingTime" value={settings.ScheduleInformation.closingTime} className="form-control" onChange={(e) => this.handleChange(e, formConstants.ScheduleInformation)} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="dropdown">
                                                                <label>Timezone</label>
                                                                <Select
                                                                    value={settings.ScheduleInformation.selectedTimeZone}
                                                                    onChange={(e) => this.handleSelectedChange(e, formConstants.ScheduleInformation, 1)}
                                                                    options={timeZoneOptions}
                                                                    className="btn"
                                                                    name="selectedTimeZone"
                                                                    placeholder="Time Zone"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12 submitbtn-holder">
                                                            <button type="submit" name="button" className="submit-btn btn" onClick={(e) => this.handleSubmit(e, formConstants.ScheduleInformation)} disabled={settingUpdating}>
                                                                Save
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="card-header" id="headingTwo">
                                            <h2 className="mb-0">
                                                <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                    Alert Settings
                                                    <span className="expand-arrow">
                                                        <img src={expandImage} alt="" />
                                                    </span>
                                                </button>
                                            </h2>
                                        </div>
                                        <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#settingsAccordion">
                                            <div className="card-body">
                                                <div className="alertbx-container">

                                                    <div className="alertbx">
                                                        <div className="togglebtn">
                                                            <label className="switch">
                                                                <input type="checkbox"
                                                                    name="confirmation"
                                                                    checked={settings.AlertSettings.confirmation}
                                                                    value={settings.AlertSettings.confirmation}
                                                                    onChange={(e) => this.handleChange(e, formConstants.Alert_Settings, true)}
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div className="togglelabel">
                                                            Confirmation
                                                        </div>
                                                        <div className="alertinfo">
                                                            Sent when client is added to waitlist.
                                                        </div>
                                                        <EditSetting selectedSection="11" childSelection={childSelection} onSelectChildEdit={this.onSelectChildEditCallack} onSaveMessage={this.onSaveChildMessage} onSelectMessage={this.onSelectChildMessage} />
                                                        <EditSetting selectedSection="1" childSelection={childSelection} onSelectChildEdit={this.onSelectChildEditCallack} onSaveMessage={this.onSaveChildMessage} onSelectMessage={this.onSelectChildMessage} />
                                                    </div>

                                                    <div className="alertbx">
                                                        <div className="togglebtn">
                                                            <label className="switch">
                                                                <input type="checkbox"
                                                                    name="nextInLine"
                                                                    checked={settings.AlertSettings.nextInLine}
                                                                    value={settings.AlertSettings.nextInLine}
                                                                    onChange={(e) => this.handleChange(e, formConstants.Alert_Settings, true)}
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div className="togglelabel">
                                                            Next in Line
                                                        </div>
                                                        <div className="alertinfo">
                                                            Sent when client is next to come inside.
                                                        </div>
                                                        <EditSetting selectedSection="2" childSelection={childSelection} onSelectChildEdit={this.onSelectChildEditCallack} onSaveMessage={this.onSaveChildMessage} onSelectMessage={this.onSelectChildMessage} />
                                                    </div>

                                                    <div className="alertbx">
                                                        <div className="togglebtn">
                                                            <label className="switch">
                                                                <input type="checkbox"
                                                                    name="checkingIn"
                                                                    checked={settings.AlertSettings.checkingIn}
                                                                    value={settings.AlertSettings.checkingIn}
                                                                    onChange={(e) => this.handleChange(e, formConstants.Alert_Settings, true)}
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div className="togglelabel">
                                                            Checking In
                                                        </div>
                                                        <div className="alertinfo">
                                                            Sent when client is told to come in.
                                                        </div>
                                                        <EditSetting selectedSection="3" childSelection={childSelection} onSelectChildEdit={this.onSelectChildEditCallack} onSaveMessage={this.onSaveChildMessage} onSelectMessage={this.onSelectChildMessage} />
                                                    </div>

                                                    <div className="alertbx">
                                                        <div className="togglebtn">
                                                            <label className="switch">
                                                                <input type="checkbox"
                                                                    checked={settings.AlertSettings.checkOut}
                                                                    name="checkOut" value={settings.AlertSettings.checkOut}
                                                                    onChange={(e) => this.handleChange(e, formConstants.Alert_Settings, true)}
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div className="togglelabel">
                                                            Checking Out
                                                        </div>
                                                        <div className="alertinfo">
                                                            Sent when client has left.
                                                        </div>
                                                        <EditSetting selectedSection="4" childSelection={childSelection} onSelectChildEdit={this.onSelectChildEditCallack} onSaveMessage={this.onSaveChildMessage} onSelectMessage={this.onSelectChildMessage} />
                                                    </div>

                                                    <div className="alertbx">
                                                        <div className="togglebtn">
                                                            <label className="switch">
                                                                <input type="checkbox"
                                                                    checked={settings.AlertSettings.noShow}
                                                                    name="noShow"
                                                                    value={settings.AlertSettings.noShow}
                                                                    onChange={(e) => this.handleChange(e, formConstants.Alert_Settings, true)}
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div className="togglelabel">
                                                            No Show
                                                        </div>
                                                        <div className="alertinfo">
                                                            Client doesn’t show up/notify you they can’t make it.
                                                        </div>
                                                        <EditSetting selectedSection="5" childSelection={childSelection} onSelectChildEdit={this.onSelectChildEditCallack} onSaveMessage={this.onSaveChildMessage} onSelectMessage={this.onSelectChildMessage} />
                                                    </div>
                                                    <div className="alertbx">
                                                        <div className="togglebtn">
                                                            <label className="switch">
                                                                <input type="checkbox"
                                                                    checked={settings.AlertSettings.parkingSpot}
                                                                    name="parkingSpot"
                                                                    value={settings.AlertSettings.parkingSpot}
                                                                    onChange={(e) => this.handleChange(e, formConstants.Alert_Settings, true)}
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div className="togglelabel">
                                                            Parking Spot
                                                        </div>
                                                        <div className="alertinfo">
                                                            Ask client for their parking spot number (if available)
                                                        </div>
                                                        <EditSetting selectedSection="6" childSelection={childSelection} onSelectChildEdit={this.onSelectChildEditCallack} onSaveMessage={this.onSaveChildMessage} onSelectMessage={this.onSelectChildMessage} />
                                                    </div>
                                                    <div className="alertbx">
                                                        <div className="togglebtn">
                                                            <label className="switch">
                                                                <input type="checkbox"
                                                                    checked={settings.AlertSettings.companyOff}
                                                                    name="companyOff"
                                                                    value={settings.AlertSettings.companyOff}
                                                                    readOnly
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div className="togglelabel">
                                                         Clinic Off Message
                                                        </div>
                                                        <div className="alertinfo">
                                                            Send this message to patient during clinic off timing
                                                        </div>
                                                        <EditSetting selectedSection="12" childSelection={childSelection} onSelectChildEdit={this.onSelectChildEditCallack} onSaveMessage={this.onSaveChildMessage} onSelectMessage={this.onSelectChildMessage} />
                                                    </div>
                                                    <div className="alertbx">
                                                        <div className="togglebtn">
                                                            <label className="switch">
                                                                <input type="checkbox"
                                                                    checked={settings.AlertSettings.reviewLink}
                                                                    name="reviewLink"
                                                                    value={settings.AlertSettings.reviewLink}
                                                                    readOnly
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div className="togglelabel">
                                                        Custom Review Link
                                                        </div>
                                                        <div className="alertinfo">
                                                            Here we can set a custom link(like google review page) with message 
                                                        </div>
                                                        <EditSetting selectedSection="13" childSelection={childSelection} onSelectChildEdit={this.onSelectChildEditCallack} onSaveMessage={this.onSaveChildMessage} onSelectMessage={this.onSelectChildMessage} />
                                                    </div>
                                                    <div className="alertbx">
                                                        <div className="togglebtn">
                                                            <label className="switch">
                                                                <input type="checkbox"
                                                                    checked={settings.AlertSettings.providerNotAtDesk}
                                                                    name="providerNotAtDesk"
                                                                    value={settings.AlertSettings.providerNotAtDesk}
                                                                    onChange={(e) => this.handleChange(e, formConstants.Alert_Settings, true)}
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div className="togglelabel">
                                                        Provider not at Desk 
                                                        </div>
                                                        <div className="alertinfo">
                                                           If provider not open patient profile. This Message will send. 
                                                            <br/><span className="length-of-time">
                                                               <input type="number" name="certain_time" className={errors.certainTime ? 'form-control error-box' : 'form-control'} value={certainTime} onChange={(e) => this.handleCertainTimeChange(e)} placeholder="length of time in minutes" />
                                                            </span>
                                                        </div>
                                                        <EditSetting selectedSection="14" childSelection={childSelection} onSelectChildEdit={this.onSelectChildEditCallack} onSaveMessage={this.onSaveChildMessage} onSelectMessage={this.onSelectChildMessage} />
                                                    </div>
                                                    <div className="col-md-12 submitbtn-holder">
                                                        <button type="submit" name="button" className=" b-m submit-btn btn" onClick={(e) => this.handleSubmit(e, formConstants.Alert_Settings)} disabled={settingUpdating}>
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="card-header" id="headingThree">
                                            <h2 className="mb-0">
                                                <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                    Additional Buttons (Additional Features)
                                                    <span className="expand-arrow">
                                                        <img src={expandImage} alt="" />
                                                    </span>
                                                </button>
                                            </h2>
                                        </div>
                                        <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#settingsAccordion">
                                            <div className="card-body">
                                                <div className="additonal-container">
                                                    <div className="alertbx">
                                                        <div className="togglebtn">
                                                            <label className="switch">
                                                                <input type="checkbox"
                                                                    checked={settings.AdditionalFeatures.desktopNotification}
                                                                    name="desktopNotification" value={settings.AdditionalFeatures.desktopNotification}
                                                                    onChange={(e) => this.handleChange(e, formConstants.Additional_Features, true)}
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div className="togglelabel">
                                                            Turn On Desktop Notifications.
                                                        </div>
                                                        <div className="addition-checks">
                                                            <div className="check-holder">
                                                                <div className="check-form-group">
                                                                    <input type="checkbox" id="html"
                                                                        name="timer" value={settings.AdditionalFeatures.timer}
                                                                        checked={settings.AdditionalFeatures.timer}
                                                                        onChange={(e) => this.handleChange(e, formConstants.Additional_Features, true)}
                                                                    />
                                                                    <label htmlFor="html">Timer</label>
                                                                </div>
                                                                <div className="check-form-group">
                                                                    <input type="checkbox" id="css"
                                                                        checked={settings.AdditionalFeatures.exit}
                                                                        name="exit" value={settings.AdditionalFeatures.exit}
                                                                        onChange={(e) => this.handleChange(e, formConstants.Additional_Features, true)}
                                                                    />
                                                                    <label htmlFor="css">Exit</label>
                                                                </div>
                                                                <div className="check-form-group">
                                                                    <input type="checkbox" id="javascript"
                                                                        name="checkIn"
                                                                        checked={settings.AdditionalFeatures.checkIn}
                                                                        value={settings.AdditionalFeatures.checkIn}
                                                                        onChange={(e) => this.handleChange(e, formConstants.Additional_Features, true)}
                                                                    />
                                                                    <label htmlFor="javascript">Checked In</label>
                                                                </div>
                                                                <div className="check-form-group">
                                                                    <input type="checkbox" id="delayed"
                                                                        checked={settings.AdditionalFeatures.delay}
                                                                        name="delay" value={settings.AdditionalFeatures.delay}
                                                                        onChange={(e) => this.handleChange(e, formConstants.Additional_Features, true)}
                                                                    />
                                                                    <label htmlFor="delayed">Delayed</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="alertbx">
                                                        <div className="togglebtn">
                                                            <label className="switch">
                                                                <input type="checkbox"
                                                                    checked={settings.AdditionalFeatures.clientPosition}
                                                                    name="clientPosition" value={settings.AdditionalFeatures.clientPosition}
                                                                    onChange={(e) => this.handleChange(e, formConstants.Additional_Features, true)}
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div className="togglelabel">
                                                            Inform client of their position in line
                                                        </div>
                                                    </div>
                                                    <div className="alertbx">
                                                        <div className="togglebtn">
                                                            <label className="switch">
                                                                <input type="checkbox"
                                                                    checked={settings.AdditionalFeatures.isSendStatus}
                                                                    name="isSendStatus"
                                                                    value={settings.AdditionalFeatures.isSendStatus}
                                                                    onChange={(e) => this.handleChange(e, formConstants.Additional_Features, true)}
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div className="togglelabel">
                                                        Send Status To Patient
                                                        </div>
                                                        <div className="alertinfo">
                                                           After Every X Minute Patient Status Send 
                                                            <br/><span className="length-of-time">
                                                               <input type="number" name="certain_time" className={errors.AdditionalFeatures.sendStatusTime ? 'form-control error-box' : 'form-control'} value={settings.AdditionalFeatures.sendStatusTime} onChange={(e) => this.handleStatusTimeChange(e)} placeholder="send status after minutes" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 submitbtn-holder">
                                                        <button type="submit" name="button" className="b-m submit-btn btn" onClick={(e) => this.handleSubmit(e, formConstants.Additional_Features)} disabled={settingUpdating}>
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="card-header" id="headingFour">
                                            <h2 className="mb-0">
                                                <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                                    Styling (Customize your PLL screen)
                                                    <span className="expand-arrow">
                                                        <img src={expandImage} alt="" />
                                                    </span>
                                                </button>
                                            </h2>
                                        </div>
                                        <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#settingsAccordion">
                                            <div className="card-body">
                                                <div className="additonal-container">
                                                    <div className="alertbx">
                                                        <div className="togglebtn">
                                                            <label className="switch">
                                                                <input type="checkbox"
                                                                    checked={settings.Styling.stylingScreen}
                                                                    name="stylingScreen" value={settings.Styling.stylingScreen}
                                                                    onChange={(e) => this.handleChange(e, formConstants.Styling, true)}
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div className="togglelabel">
                                                            Customize your PLL screen
                                                        </div>

                                                    </div>
                                                    <div className="col-md-12 submitbtn-holder">
                                                        <button type="submit" name="button" className="b-m submit-btn btn" onClick={(e) => this.handleSubmit(e, formConstants.Styling)} disabled={settingUpdating}>
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="card-header" id="headingFive">
                                            <h2 className="mb-0">
                                                <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                                    Client Information Request List (allows to you ask for specific information from your clients)
                                                    <span className="expand-arrow">
                                                        <img src={expandImage} alt="" />
                                                    </span>
                                                </button>
                                            </h2>
                                        </div>
                                        <div id="collapseFive" className="collapse" aria-labelledby="headingFive" data-parent="#settingsAccordion">
                                            <div className="card-body">
                                                <div className="alertbx-container">
                                                    <div className="alertbx">
                                                        <div className="togglebtn">
                                                            <label className="switch">
                                                                <input type="checkbox"
                                                                    checked={settings.ClientInformation.name}
                                                                    name="name" value={settings.ClientInformation.name}
                                                                    onChange={(e) => this.handleChange(e, formConstants.Client_Information, true)}
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div className="togglelabel">
                                                            Name
                                                        </div>
                                                        <div className="alertinfo">
                                                            Clients Name
                                                        </div>
                                                        <div className="alert_editdrop">
                                                            <div className={"dropdown cstm-dropdown " + (isEdited ? 'active' : '')}>
                                                                <a className="nav-link editbtn" id="nameDropdown" onClick={(e) => this.handleEditSelection(e)} >
                                                                    <span className="tx" >Edit {isEdited}</span>
                                                                    <span className="cancel-image">
                                                                        <img src={canceldrop} alt="" />
                                                                    </span>
                                                                </a>
                                                                <div className="dropdown-menu dropdown-menu-lg-right client-dropdown" >
                                                                    <div className="smsdrop-holder">
                                                                        <div className="smsheader">
                                                                            <h3>Clients Name</h3>
                                                                        </div>
                                                                        <div className="smsbody">
                                                                            <ul>
                                                                                <li>
                                                                                    <div className="check-holder">
                                                                                        <div className="check-form-group">
                                                                                            <input type="checkbox"
                                                                                                id="namereq"
                                                                                                checked={settings.ClientInformation.clientName}
                                                                                                name="clientName"
                                                                                                value={settings.ClientInformation.clientName}
                                                                                                onChange={(e) => this.handleChange(e, formConstants.Client_Information, true)}
                                                                                            />
                                                                                            <label htmlFor="namereq">Required</label>
                                                                                        </div>
                                                                                    </div>
                                                                                </li>
                                                                                <li>
                                                                                    <div className="check-holder">
                                                                                        <div className="check-form-group">
                                                                                            <input type="checkbox"
                                                                                                id="name"
                                                                                                checked={settings.ClientInformation.firstLastName}
                                                                                                name="firstLastName"
                                                                                                value={settings.ClientInformation.firstLastName}
                                                                                                onChange={(e) => this.handleChange(e, formConstants.Client_Information, true)}
                                                                                            />
                                                                                            <label htmlFor="name">First and last name</label>
                                                                                        </div>
                                                                                    </div>
                                                                                </li>
                                                                            </ul>
                                                                            {/* <div className="savebtn">
                                                                        <button type="button" name="button" className="btn">Save</button>
                                                                    </div> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 submitbtn-holder">
                                                        <button type="submit"
                                                            name="button"
                                                            className="b-m submit-btn btn"
                                                            onClick={(e) => this.handleSubmit(e, formConstants.Client_Information)} disabled={settingUpdating}>
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="card signage_form-card">
                                        <div className="card-header" id="headingSign">
                                            <h2 className="mb-0">
                                                <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseSign" aria-expanded="false" aria-controls="collapseSign">
                                                    Custom Signage Form
                                                    <span className="expand-arrow">
                                                        <img src={expandImage} alt="" />
                                                    </span>
                                                </button>
                                            </h2>
                                        </div>
                                        <div id="collapseSign" className="collapse" aria-labelledby="headingSign" data-parent="#settingsAccordion">
                                            <div className="card-body">
                                                <div className="companyinfo-holder">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <input type="text" name="companyName" value={settings.SignageInformation.companyName} className="form-control" placeholder="Company Name" onChange={(e) => this.handleChange(e, formConstants.Signage_Information)} />
                                                                {errors.SignageInformation.companyName.info.length > 0 &&
                                                                    <span className='error-alert error help-block'>{errors.SignageInformation.companyName.info}</span>}
                                                                {submitted.SignageInformation && errors.SignageInformation.companyName.info.length === 0 && errors.SignageInformation.companyName.status &&
                                                                    <span className='error-alert error help-block'>required</span>}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <input type="text" name="companyAddress" value={settings.SignageInformation.companyAddress} className="form-control" placeholder="Company Address" onChange={(e) => this.handleChange(e, formConstants.Signage_Information)} />
                                                                {errors.SignageInformation.companyAddress.info.length > 0 &&
                                                                    <span className='error-alert error help-block'>{errors.SignageInformation.companyAddress.info}</span>}
                                                                {submitted.SignageInformation && errors.SignageInformation.companyAddress.info.length === 0 && errors.SignageInformation.companyAddress.status &&
                                                                    <span className='error-alert error help-block'>required</span>}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <input type="text"
                                                                onKeyPress={(event) => {
                                                                    if (!/[0-9]/.test(event.key)) {
                                                                        event.preventDefault();
                                                                    }
                                                                }}
                                                                 name="generatedPhoneNumber" value={settings.SignageInformation.generatedPhoneNumber} className="form-control" placeholder="your generated parking lot lobby phone umber" onChange={(e) => this.handleChange(e, formConstants.Signage_Information)} />
                                                                {errors.SignageInformation.generatedPhoneNumber.info.length > 0 &&
                                                                    <span className='error-alert error help-block'>{errors.SignageInformation.generatedPhoneNumber.info}</span>}
                                                                {submitted.SignageInformation && errors.SignageInformation.generatedPhoneNumber.info.length === 0 && errors.SignageInformation.generatedPhoneNumber.status &&
                                                                    <span className='error-alert error help-block'>required</span>}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <input type="text" 
                                                                onKeyPress={(event) => {
                                                                    if (!/[0-9]/.test(event.key)) {
                                                                        event.preventDefault();
                                                                    }
                                                                }}
                                                                name="signNumber" value={settings.SignageInformation.signNumber} className="form-control" placeholder="Number of Signs" onChange={(e) => this.handleChange(e, formConstants.Signage_Information)} />
                                                                {errors.SignageInformation.signNumber.info.length > 0 &&
                                                                    <span className='error-alert error help-block'>{errors.SignageInformation.signNumber.info}</span>}
                                                                {submitted.SignageInformation && errors.SignageInformation.signNumber.info.length === 0 && errors.SignageInformation.signNumber.status &&
                                                                    <span className='error-alert error help-block'>required</span>}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <div className="uploadbx-holder">
                                                                <div className="innerbx">
                                                                    <div className="upload-area">
                                                                    {logoImage ?
                                                                    (<span><img id="target" src={logoImage} onClick={(e) => this.updateImageOnClickImage(e, formConstants.Signage_Information)} /></span>):
                                                                       (<span> <img src={cameraSVG} alt="" onClick={(e) => this.updateImageOnClickImage(e, formConstants.Signage_Information)} /> </span>)}
                                                                    <input className="upload-file-input" id="file-name2" multiple="" onChange={(e) => this.onImageChange(e, formConstants.Signage_Information)} type="file" accept=".jpg,.jpeg,.png" />
                                                                    </div>
                                                                    <div className="addbtn-area">
                                                                        <label htmlFor="file-name2">Add Your Company Logo</label>
                                                                        <div className="upload-holder">
                                                                            <span className="uploadbtn"> <button type="button" name="button" className="btn" onClick={(e)=>this.updateImageOnClickImage(e,formConstants.Signage_Information)} >Upload</button> </span>
                                                                            <span className="txinfo">Must be Black and White Vector PDF</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-5">
                                                            <div className="subrgtbtn-holder">
                                                                <div className="layoutbtn">
                                                                    <a href="#" className="gotobtn">Go to Full Layout</a>
                                                                </div>
                                                                <div className="submitbtn-holder">
                                                                    <button className="btn" type="button" id="submitButton" name="button" onClick={(e) => this.handleSubmit(e, formConstants.Signage_Information)} disabled={settingUpdating} >
                                                                        Submit Request
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}
function mapState(state) {
    const { settingFetching, settingData, settingUpdating } = state.settings
    return { settingFetching, settingData, settingUpdating }
}

const actionCreators = {
    updateSettings: userActions.updateSettings
}

export default connect(mapState, actionCreators)(SettingPage);