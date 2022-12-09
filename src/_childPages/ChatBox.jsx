import React from 'react';
import { connect } from 'react-redux';
import {sendImage} from '../_assets';
import { userActions,commonActions } from '../_actions';
import { getLoginUserId, socket} from '../_helpers';
import { default as paperClipSVG } from '../_assets/images/paperclip.svg';
class ChatBox extends React.Component {
    messagesEnd = React.createRef();
    constructor(props) {
        super(props);
        socket.on('new-message', async (response) => {
            let {userId, locationId} = await  getLoginUserId();
            if(!userId || !locationId) {
                return;
            }
            if(userId === response.clientId && locationId ==  response.locationId) {
                const patientId = (this.props.popupData && this.props.popupData.patientId && this.props.popupData.patientId._id) ? this.props.popupData.patientId._id : null;
                if(patientId == response.patientId) {
                    this.props.fetchPatientChat(patientId);
                    this.props.markNotifications(patientId);
                }
            }
        })

        this.state = {
            message:'',
            isError:false,
            submitted:false,
            patientId:null
        };
    }
    componentDidMount() {
        this.props.onRef(this);
        this.scrollToBottom();
        const patientId = (this.props.popupData && this.props.popupData.patientId && this.props.popupData.patientId._id) ? this.props.popupData.patientId._id : null;
        this.setState({patientId:patientId});
        if(patientId) {
            this.props.fetchPatientChat(patientId);
            this.props.markNotifications(patientId);
            this.scrollToBottom();
        }
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
        this.setState({patientId:null});
    }
    componentDidUpdate() {
        const {patientId} = this.state;
        this.scrollToBottom();
        /* if(patientId) {
            this.props.markNotifications(patientId);
        } */
    }
    async handleChange(event) {
        try {
            let { value} = event.target;
            let {isError} = this.state;
            isError= false;
            if(!value || value == '') {
                isError =true;
            }
            this.setState({message:value, isError})
        } catch (error) {
            console.log('\n error:', error.message || error);
        }
    }
    async handleSubmit() {
        try {
            let {message, isError, patientId} = this.state;
            if(isError) {
                return;
            }
            if(!message || message == '') {
                isError =true;
                this.setState({isError});
                return;
            }
            if(!patientId) {
                return;
            }
            const requestPayload = {
                patientId: patientId,
                message: message
            }
            this.props.addChatMessage(requestPayload)
            this.setState({isError:false, message:''});
        } catch (error) {
            console.log('\n error:', error.message || error);
        }
    }
    getAlert(message) {
        this.setState({message:message,isError:false})
    }
    toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    async onMMSMedia(files) {
        let {patientId} = this.state;
        const requestPayload = {
            patientId,
            message: '',
            media: await this.toBase64(files[0]),
        }
        this.props.addChatMessage(requestPayload)
    }
    scrollToBottom() {
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
    render() {
        const {message, isError} = this.state;
        const {fetchingChat,chatData,creatingChat} = this.props;
        return (<div className="col-md-4">
        <div className="chatbx-holder">
            <div className="inner-container">
                <div className="chat-header">
                    <div className="toprow">
                        <h1>Chat</h1>
                    </div>
                </div>
                <div className="chat-body">
                    <div className="chatboxes">
                        <ul id="chat-box">
                        {!fetchingChat && chatData && chatData.length > 0 ?
                                  chatData.map((value, index) => (
                                    <li className={(value.type === 1 ? 'lftchat' : 'rgtchat')} key={'c_'+index}>
                                    { value.type === 2 && <span>{this.props.getMomentTime(3, value.createdAt)}</span>}
                                    <div className="thread-entry">
                                        {!!value.content &&
                                        <div className="thread-entry-inner">
                                           {value.content}
                                        </div>}
                                        { value.media.map(file =>
                                        <div>
                                            {file.isImage ?
                                            <img className='img-thumbnail' src={file.link} />
                                            : <a href={file.link} download target='_blank'>{file.name}</a>
                                            }
                                        </div>)}
                                    </div>
                                    { value.type === 1 && <span>{this.props.getMomentTime(3, value.createdAt)}</span>}
                                   </li>
                                 )) : <li className="txt-center">
                                  {fetchingChat && <div className="thread-entry"><div className="thread-entry-inner">Loading....</div></div>}
                                   {!fetchingChat && <div className="thread-entry"><div className="thread-entry-inner">No Chat Found..</div></div>}
                                  </li>
                            }
                        </ul>
                        <div style={{ float:"left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>
                    <div className="float-inputbx" style={{paddingLeft: '55px'}}>
                        <label className='btn-paperpin'>
                            <img src={paperClipSVG} alt="" />
                            <input type="file" onChange={(e) => this.onMMSMedia(e.target.files)} style={{display: 'none'}} />
                        </label>
                        <input type="text" name="" value={message} className="form-control" placeholder="Type your message.."  onChange={(e)=>this.handleChange(e)} />
                        {isError && 
                           <label htmlFor="" className='error-alert error help-block'>required</label>
                        }                                                            
                        <button type="button" name="button" className="btn" onClick={() =>this.handleSubmit()} disabled={isError || creatingChat}>
                            <img src={sendImage} alt="" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>)
    }
}

function mapState(state) {
    const { chat } = state;
    const {fetchingChat, chatData, creatingChat} = chat;
    return {fetchingChat,chatData,creatingChat}
}

const actionCreators = {
    fetchPatientChat: commonActions.fetchPatientChat,
    addChatMessage:commonActions.addChatMessage,
    markNotifications:userActions.markNotifications
}

const connectedChatBox = connect(mapState, actionCreators)(ChatBox);
export { connectedChatBox as ChatBox };