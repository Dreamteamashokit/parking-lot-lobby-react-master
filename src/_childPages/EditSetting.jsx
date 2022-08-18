import React from 'react';
import { connect } from 'react-redux';
import {editImage, canceldrop} from '../_assets'
class EditSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editSelection:0,
            selectPlaceHolder:0,
            message:'',
            errorMessage:null
        };
    }
    handleEditSelection = async (event, editFor) => {
        try {
            const {editSelection} = this.state;
            if(editSelection !== parseInt(editFor)) {
                const messageData = await this.props.onSelectMessage(parseInt(editFor));
                this.setState({message:messageData , editSelection:parseInt(editFor), selectPlaceHolder:0})
                this.props.onSelectChildEdit(parseInt(editFor))
            } else {
                this.setState({editSelection:0, selectPlaceHolder:0, message:''})
                this.props.onSelectChildEdit(parseInt(-1))
            }
        } catch (error) {
            console.log('\n error in editsetting:', error.message);
            this.setState({editSelection:0})
            this.props.onSelectChildEdit(parseInt(-1))
        }
    }
    selectPlacerholder = async (event, selectedChild) => {
        try {
            let {selectPlaceHolder, message, editSelection, childSelection} = this.state;
            if(selectPlaceHolder === selectedChild) {
                if(editSelection !== childSelection) {
                    message='';
                }
                this.setState({selectPlaceHolder:0, ...message});
                return;
            }
            this.setState({selectPlaceHolder:selectedChild})
        } catch (error) {
            console.log('\n error in editsetting:', error.message);
            this.setState({selectPlaceHolder:0, message:''});
        }
    }
    handleMessage =  async (event) => {
        try {
            let { value } = event.target;
            if(!value){
                this.setState({isError:true, errorMessage:'Required', message:''})
                return;
            }
            this.setState({isError:false, errorMessage:'',message:value});
        } catch (error) {
            console.log('\n error:', error.message || error);
        }
    }
    addPlaceHolder = async (placeHolder) => {
        try {
            let {message} = this.state;
            this.setState({isError:false, errorMessage:'',message:`${message} ${placeHolder}`});
        } catch (error) {
            console.log('\n addPlaceHolder error:', error.message || error);
        }
    }
    saveMessage = async () => {
        try {
            const {editSelection, isError, message} = this.state;
            if(editSelection == 0 || isError) {
                return;
            }
            if(!message || message == '') {
                this.setState({isError:true})
                this.setState({errorMessage:'Please provide a message'})
                return;
            }
            this.props.onSaveMessage(editSelection,message)
            this.setState({selectPlaceHolder:0, editSelection:0});
        } catch (error) {
            console.log('\n editSetting.saveMessage:', error.message || error);
        }
    }
    


    render() {
        const {selectedSection,childSelection} = this.props;
        const {editSelection, selectPlaceHolder, message, errorMessage, isError} = this.state;
        return (<div className={(selectedSection === "11") ? "alert_editdrop_one" : "alert_editdrop"}>
        <div className={"dropdown cstm-dropdown " + (editSelection == childSelection ? 'active' : '')} id="myDropdown1">
            <a className="nav-link editbtn" id="alertDropdown1" onClick={(e) =>this.handleEditSelection(e, selectedSection)} >
            {(selectedSection === "11") ?
                <span className="tx" >New</span> :
                (selectedSection === "1") ?  
                <span className="tx" >Existing</span> :
                <span className="tx" >Edit</span>
            }
                <span className="cancel-image">
                    <img src={canceldrop} alt="" />
                </span>
            </a>
            <div className="dropdown-menu dropdown-menu-lg-right">
                <div className="smsdrop-holder">
                    <div className="smsheader">
                        <h3>SMS Message</h3>
                    </div>
                    <div className="smsbody">
                        <div className="textarea-holder">
                            <div className="form-group">
                                <textarea name="message"
                                value={message}
                                onChange={(e) => this.handleMessage(e)}
                                 rows="4" cols=""
                                 className="form-control"
                                placeholder="Hi {name}! You’re waitlisted to {business} as #{order} in line. Reply ‘cancel’ if you can’t make it."></textarea>
                                <div className={"adrop-container " + (selectPlaceHolder === childSelection ? 'open' : '')} >
                                    <button type="button" name="button" className="editag" onClick={(e)=>this.selectPlacerholder(e, childSelection)}>
                                        <img src={editImage} alt="" />
                                    </button>
                                    <div className="adrop-holder">
                                    <div className="smsheader">
                                        <h3> 
                                            <span className="icons"><img src={editImage} alt="" /></span> 
                                            <span className="tx">Select Place Holders</span>
                                            <span className="cancelbtn" onClick={(e)=>this.selectPlacerholder(e, childSelection)}>
                                                <button className="btn" type="button" >
                                                    <img src={canceldrop} alt="" />
                                                </button>
                                            </span>
                                        </h3>
                                    </div>
                                    <div className="contbx">
                                    <div className="row-holder" onClick={() =>this.addPlaceHolder('{business}')}>
                                            <div className="lftbx">Business Name</div>
                                            <div className="rgtbx">business SS</div>
                                        </div>
                                        <div className="row-holder" onClick={() =>this.addPlaceHolder('{clinicNumber}')}>
                                            <div className="lftbx">Clinic Number</div>
                                            <div className="rgtbx">clinicPhone SS</div>
                                        </div>
                                        <div className="row-holder" onClick={() =>this.addPlaceHolder('{name}')}>
                                            <div className="lftbx">Customer Name</div>
                                            <div className="rgtbx">Name SS</div>
                                        </div>
                                        <div className="row-holder" onClick={() =>this.addPlaceHolder('{order}')}>
                                            <div className="lftbx">Customer Order Number</div>
                                            <div className="rgtbx">Order SS</div>
                                        </div>
                                        <div className="row-holder" onClick={() =>this.addPlaceHolder('{totalOrder}')} >
                                            <div className="lftbx">Total Order</div>
                                            <div className="rgtbx">totalOrder SS</div>
                                        </div>
                                        <div className="row-holder" onClick={() =>this.addPlaceHolder('{reviewLink}')}>
                                            <div className="lftbx">review Link</div>
                                            <div className="rgtbx">reviewLink SS</div>
                                        </div>
                                        <div className="row-holder" onClick={() =>this.addPlaceHolder('{jotUrl}')}>
                                            <div className="lftbx">jot Url</div>
                                            <div className="rgtbx">jotUrl SS</div>
                                        </div> 
                                    </div>
                                </div>
                                </div>
                                {isError && errorMessage && 
                                    <span className='error-alert error help-block'>{errorMessage}</span>}
                                
                            </div>
                            <div className="txbx">
                                <p>Must include a way to unsubscribe with Stop or Cancel.</p>
                                <p>Default Reply STOP to block further SMS.</p>
                            </div>
                            <div className="savebtn">
                                <button type="button" name="button" className="btn" onClick={()=>this.saveMessage()}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
    }
}

function mapState(state) {
    return {}
}

const actionCreators = {}

const connectedEditSetting = connect(mapState, actionCreators)(EditSetting);
export { connectedEditSetting as EditSetting };