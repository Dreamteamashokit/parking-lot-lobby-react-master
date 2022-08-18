import React from 'react';
import { connect } from 'react-redux';
import {dropWhiteMenu} from '../_assets';
import { commonActions } from '../_actions';
import {
    checkImage, cancelImage
} from '../_assets';

class QuickResponse extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message:'',
            isError:false,
            submitted:false,
            editRecordIndex:-1,
            editRecordMessage:null,
            isUpdateError:false
        };
    }
    componentDidMount() {
        this.props.getQuickResponse();
    }
    async handleChange(event) {
        try {
            let { value, isError } = event.target;
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
            let {message, isError} = this.state;
            if(isError) {
                return;
            }
            if(!message || message == '') {
                isError =true;
                this.setState({isError});
                return;
            }
            this.props.addQuickResponse({message:message})
            this.setState({message:''});
        } catch (error) {
            console.log('\n error:', error.message || error);
        }
    }
    async onSelectQuickMessage(message) {
        this.props.onSelectQuickResponse(message)
    }
    async selectForEdit(index, message) {
        try {
            this.setState({editRecordIndex:index, editRecordMessage:message, isUpdateError:false});
        } catch (err) {
          console.log('\n selectForEdit error:', err.message || err) ; 
        }
    }
    async handleUpdateMessageChange(event) {
        try {
            let { value} = event.target;
            let {isUpdateError} = this.state;
            isUpdateError= false;
            if(!value || value == '') {
                isUpdateError =true;
            }
            this.setState({editRecordMessage:value, isUpdateError})
        } catch (error) {
            console.log('\n error:', error.message || error);
        }
    }
    async onSubmitUpdate(index, id) {
       try {
           if(!id) {
               return;
           }
           let {isUpdateError, editRecordMessage, editRecordIndex} = this.state;
            if(index !== editRecordIndex) {
                console.log('\n index are not match...')
                return;
            }
            if(isUpdateError) {
                return;
            }
            if(!editRecordMessage) {
                this.setState({isUpdateError:true});
                return;
            }
            console.log('\n final message for end...', editRecordMessage, 'id:', id)
            const payload = {responseId: id, message:editRecordMessage};
            await this.props.updateQuickResponse(payload,index);
            this.selectForEdit(-1,null);
        } catch (err) {
           console.log('\n error in onSubmitUpdate:', err.message || err);
       }
    }
    async removeQuickResponse(id) {
        try {
            console.log('\n removeQuickResponse:', id)
            this.props.removeQuickResponse({id:id});
        } catch (err) {
            console.log('\n err:', err.message || err);
        }
    }
    render() {
        const {message, isError, editRecordIndex, editRecordMessage, isUpdateError} = this.state;
        const {fetchingQuick, quickResponseData,creatingQuick} = this.props;
        return (<div className="col-md-4">
        <div className="chatbx-holder">
            <div className="inner-container">
                <div className="chat-header">
                    <div className="toprow">
                        <h3>Quick Responses</h3>
                    </div>
                </div>
                <div className="chat-body">
                    <div className="response_boxes">
                        <ul>
                        {!fetchingQuick && quickResponseData && quickResponseData.length > 0 ?
                                  quickResponseData.map((value, index) => (
                                <li className="response-edits" key={"q_"+index}>
                                    <div className="responsetx" onClick={()=> this.onSelectQuickMessage(value.message)}>
                                        {(editRecordIndex !== index) && <span id="message-box">{value.message} </span>}
                                        {(editRecordIndex == index)  && <span id="message-edit-box"><input className={isUpdateError ? 'error-box' : ''} name="message" value={editRecordMessage} onChange={(e)=>this.handleUpdateMessageChange(e)} /> <img src={checkImage} alt="" onClick={()=> this.onSubmitUpdate(index, value._id)}   /> <img src={cancelImage} alt="" onClick={() => this.selectForEdit(-1, null)} /></span> }
                                    </div>
                                    <div className="response_drop">
                                        <div className="nav-item">
                                            <a className="nav-link"  id="responseDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <img src={dropWhiteMenu} alt="" className="" />
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="responseDropdown">
                                                <a className="dropdown-item" onClick={()=> this.onSelectQuickMessage(value.message)} >Select</a>
                                                <a className="dropdown-item" onClick={() => this.selectForEdit(index, value.message)} >Edit</a>
                                                <div className="dropdown-divider"></div>
                                                <a className="dropdown-item" onClick={() => this.removeQuickResponse(value._id)} >Remove</a>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                  )) : <li className="response-edits">
                                  {fetchingQuick && <div className="responsetx txt-center">Loading....</div>}
                                   {!fetchingQuick && <div className="responsetx">No Quick Response. Please add your own quick response.</div>}
                                  </li>
                            }
                        </ul>
                    </div>
                    <div className="float-inputbx">
                        <label htmlFor="">Create your own customized responses</label>
                        <input type="text" name="" value={message} className="form-control" placeholder="+ Add Text Here" onChange={(e)=>this.handleChange(e)} />
                        {isError && 
                           <label htmlFor="" className='error-alert error help-block'>required</label>
                        }
                        <button type="button" name="button" className="btn addbtn" onClick={() =>this.handleSubmit()} disabled={isError || creatingQuick}>Add</button>
                    </div>
                </div>
            </div>
        </div>
    </div>)
    }
}

function mapState(state) {
    const { quickResponse } = state;
    const {fetchingQuick, quickResponseData, creatingQuick} = quickResponse;
    return {fetchingQuick, quickResponseData,creatingQuick};
    
}

const actionCreators = {
    getQuickResponse: commonActions.getQuickResponse,
    addQuickResponse: commonActions.addQuickResponse,
    updateQuickResponse: commonActions.updateQuickResponse,
    removeQuickResponse: commonActions.removeQuickResponse
}

const connectedQuickResponse = connect(mapState, actionCreators)(QuickResponse);
export { connectedQuickResponse as QuickResponse };