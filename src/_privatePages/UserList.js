import React from "react";
import { connect } from "react-redux";
import "../_assets/css/sass/visitor-review.scss";
import { Link } from "react-router-dom";
import { default as searchDark } from "../_assets/images/search-dark.svg";
import { default as dropdownSMSVG } from "../_assets/images/dropdown-sm.svg";
import { default as accessProfileSVG } from "../_assets/images/access-profile.svg";
import { errorToast, validateEmail, getLoginUserId, socket } from "../_helpers";
import { userActions } from "../_actions";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-bootstrap/Modal";
import { deleteImage } from "../_assets";
import Moment from 'react-moment';
import { ChatBox, QuickResponse } from '../_childPages';
import ReactPaginate from 'react-paginate';

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchBy: "",
      showUserInfo: false,
      selectedUserData: null,
      isDeleteShow: false,
    };
  }
  componentDidMount() {
    this.fetchData();
    if (this.props.user && !this.props.user.default_location) {
      this.props.OpenLocationModelAction();
    }
  }
  componentWillUnmount() {
    this.props.closeLocationModelAction();
  }

  fetchData = async (page = 1) => {
    try {
      this.props.fetchUserList({page, limit: 10, search: this.state.searchBy});
    } catch (err) {
      let message =
        err && err.message ? err.message : "Something went wrong in fetchData";
      errorToast(message);
    }
  };
  async handleChange(event) {
    try {
      let { value } = event.target;
      if (!value || value == "") {
        this.setState({ searchBy: "" }, () => {
          this.fetchData();
        });
        return;
      } else {
        this.setState({ searchBy: value }, () => {
          this.fetchData();
        });
        return;
      }
    } catch (error) {
      console.log("\n error:", error.message || error);
    }
  }
  async hidePatientInfoModal() {
    this.setState({ showUserInfo: false, selectedUserData: null, listType: null });
  }
  openUserInfoModel = (index) => {
    try {
      let listType = null;
      let selectedUserData = null;
      let { showUserInfo } = this.state;
      if (!showUserInfo) {
        selectedUserData = this.props.userList.data[index];
      }
      this.setState({ showUserInfo: !showUserInfo, selectedUserData, listType });
    } catch (e) {
      console.log('error in openUserInfoModel:', e.message || e)
      let message = e.message || 'Something went wrong in openUserInfoModel';
      errorToast(message)
    }
  }
  modalChatLoaded = () => {
    console.log('\n on modal chat load...')
  }
  onRemoveProfileFromChat = (selectedUserData, listType) => {
    // currently not add remove feature...
    console.log("\n on remove ...", selectedUserData, listType)
    return;
  }
  confirmToMove = async (patientId = '', type = 0) => {
    // currently not add move patient feature...
    console.log("\n on confirm To Move ...", patientId, type)
    return;
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

  onSelectQuickResponse = (quickMessage = '') => {
    try {
      this.chatChild.getAlert(quickMessage);
    } catch (err) {
      console.log('\n onSelectQuickResponse error:', err.message || err);
      let message = err.message || 'Something went wrong in onSelectQuickResponse';
      errorToast(message)
    }
  }

  render() {
    const {
      showUserInfo,
      selectedUserData,
      listType
    } = this.state;
    const { fetchingUserList, userList } = this.props;
    return (
      <div>
        <section className="visitor-review-holder">
          <div className="cstm-container">
            <div className="topbx-holder">
              <div className="row">
                <div className="col-md-12">
                  <div className="headingbx">
                    <div className="headcontbx">
                      <h1>User List:</h1>
                    </div>
                    <div className="visitor-filters">
                      <div className="filters-wrapper">
                        <div className="serachbx-holder">
                          <form className="form-inline my-2 my-lg-0">
                            <input
                              className="form-control"
                              type="search"
                              placeholder=""
                              aria-label="Search"
                              onChange={(e) => this.handleChange(e)}
                            />
                            <button className="btn my-2 my-sm-0" type="submit">
                              <img src={searchDark} alt="" />
                            </button>
                          </form>
                        </div>
                        <div className="drop_btns-holder">
                          <div className="btn-holder">
                            <button
                              type="button"
                              name="button"
                              className="btn review-btn activebtn"
                            >
                              <Link
                                className="navbar-brand review-link"
                                to="/visitor-reviews"
                              >
                                <span className="txbx"> Reviews </span>
                              </Link>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tablebx-holder">
              <div className="table-inner">
                <div className="table-responsive">
                  <table className="table" width="100%" height="auto">
                    <thead>
                      <tr key="head">
                        <th className="name" key="name">
                          Name
                        </th>
                        <th className="ratings" key="number">
                          Phone Number
                        </th>
                        <th className="comments" key="reason">
                          Date of Birth
                        </th>
                        <th className="submit" key="visit">
                          First Visit
                        </th>
                        <th className="actions" key="action">
                          {" "}
                          &nbsp;{" "}
                        </th>
                        -                    </tr>
                    </thead>
                    <tbody>
                      {!fetchingUserList ? (
                        userList.data.map((value, index) => (
                          <tr key={index}>
                            <td className="name" key="nameValue_{index}">
                              <div className="name-inner">
                                <h3>
                                  {`${value.first_name || ''} ${value.first_name || ''}`.trim() || '- - -'}
                                </h3>
                              </div>
                            </td>
                            <td className="name" key="numberValue_{index}">
                              <div className="name-inner">
                                {value?.fullNumber}
                              </div>
                            </td>
                            <td className="name" key="reasonValue_{index}">
                              <div className="name-inner">
                                {value?.dob ? <Moment format="ll">{value.dob}</Moment> : '- -'}
                              </div>
                            </td>
                            <td className="name" key="dateValue_{index}">
                              <div className="name-inner">
                                <Moment format="lll" local>{value.createdAt}</Moment>
                              </div>
                            </td>
                            <td className="actions" key="actionFields_{index}">
                              <div className="filerdrop-holder">
                                <div className="dropdown">
                                  <a
                                    className="nav-link"
                                    href="#"
                                    id="nameDropdown2"
                                    role="button"
                                    data-display="static"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    <span className="dropbtn">
                                      <span className="icon">
                                        {" "}
                                        <img src={dropdownSMSVG} alt="" />{" "}
                                      </span>
                                    </span>
                                  </a>
                                  <div
                                    className="dropdown-menu dropdown-menu-lg-right"
                                    aria-labelledby="nameDropdown2"
                                  >
                                    <div className="smsdrop-holder">
                                      <div className="smsbody">
                                        <label htmlFor="setting-action">
                                          Actions
                                        </label>
                                        <ul className="test,....">
                                          <li key="_sub1_{index}">
                                            <a
                                              className={
                                                showUserInfo
                                                  ? "btn disable-click"
                                                  : "btn"
                                              }
                                              onClick={() =>
                                                this.openUserInfoModel(index)
                                              }
                                            >
                                              <span className="icon">
                                                {" "}
                                                <img
                                                  src={accessProfileSVG}
                                                  alt=""
                                                />{" "}
                                              </span>
                                              <span className="txbx">
                                                Conversation
                                              </span>
                                            </a>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="txt-center">
                          {fetchingUserList && (
                            <td
                              key="loading"
                              className="text-center"
                              colSpan="6"
                            >
                              <h3>Loading....</h3>
                            </td>
                          )}
                          {!fetchingUserList && (
                            <td
                              key="no_value"
                              className="text-center"
                              colSpan="6"
                            >
                              <h3>No User Found..</h3>
                            </td>
                          )}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            { !!Math.ceil(userList.total / userList.limit) &&
            <ReactPaginate
              className="pagination justify-content-center py-4"
              previousClassName="page-item"
              pageClassName="page-item"
              nextClassName="page-item"
              previousLinkClassName="page-link"
              pageLinkClassName="page-link"
              nextLinkClassName="page-link"
              activeClassName="active"
              breakLabel=""
              onPageChange={e => this.fetchData(e.selected + 1)}
              pageRangeDisplayed={5}
              pageCount={Math.ceil(userList.total / userList.limit)}
              renderOnZeroPageCount={null}
            />}
          </div>
        </section>
        <Modal
          show={showUserInfo}
          onHide={() => this.hidePatientInfoModal()}
          onEntered={() => this.modalChatLoaded()}
          dialogClassName={"modal-dialog-centered"}
          className="checkin-popup-box show"
        >
          <div className="modal-header">
            <div className="cancel-chatbtn">
              <button type="button" className="close" onClick={() => this.hidePatientInfoModal()}>
                <img src={deleteImage} alt="" />
              </button>
            </div>
          </div>
          <div className="modal-body">
            <div className="chatbx-container">
              <div className="cstm-overlay">
                <div className="cstm-container">
                  <div className="row justify-content-center">
                    <ChatBox isUser={true} popupData={selectedUserData} listType={listType} onRef={ref => (this.chatChild = ref)} getMomentTime={this.getMomentTime} />
                    <QuickResponse popupData={selectedUserData} listType={listType} onSelectQuickResponse={this.onSelectQuickResponse} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapState(state) {
  const { fetchingUserList, userList } = state.users;
  const { user } = state.authentication;
  return { user, fetchingUserList, userList };
}

const actionCreators = {
  fetchUserList: userActions.fetchUserList,
  OpenLocationModelAction: userActions.OpenLocationModelAction,
  closeLocationModelAction: userActions.closeLocationModelAction,
};

export default connect(mapState, actionCreators)(UserList);
