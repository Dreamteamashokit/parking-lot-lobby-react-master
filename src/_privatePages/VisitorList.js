import React from "react";
import { connect } from "react-redux";
import "../_assets/css/sass/visitor-review.scss";
import { Link } from "react-router-dom";
import { default as searchDark } from "../_assets/images/search-dark.svg";
import { default as dropdownSMSVG } from "../_assets/images/dropdown-sm.svg";
import { default as editProfileSVG } from "../_assets/images/edit-profile.svg";
import { default as exportSVG } from "../_assets/images/export.svg";
import { default as settingSVG } from "../_assets/images/setting.svg";
import { default as cancelSVG } from "../_assets/images/cancel.svg";
import { default as accessProfileSVG } from "../_assets/images/access-profile.svg";
import { errorToast, validateEmail, getLoginUserId, socket } from "../_helpers";
import { userActions, commonActions } from "../_actions";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-bootstrap/Modal";
import Multiselect from "multiselect-react-dropdown";
import { dustbinImage, deleteImage } from "../_assets";
import Moment from 'react-moment';
import { ChatInformation, ChatBox, QuickResponse } from '../_childPages';

class VisitorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterStatus: "",
      visitDate: "",
      searchBy: "",
      statusContent: [
        { label: "Waiting", value: 1 },
        { label: "check-In/out", value: 2 },
        { label: "Served", value: 3 },
        { label: "Blocked", value: 4 },
        { label: "Delay", value: 5 },
      ],
      showPatientInfo: false,
      showPatientEdit: false,
      listType:null,
      selectedPatientData: null,
      updatePatient: {
        patientId: {
          first_name: "",
          last_name: "",
          email: "",
        },
        parkingSpot: "",
        visitType: [],
      },
      patientError: {
        first_name: false,
        last_name: false,
        email: false,
        parkingSpot: false,
        visitType: false,
      },
      visitOptions: [
        { name: "Imaging", id: 1 },
        { name: "Lab", id: 2 },
        { name: "Occupational Medicine", id: 3 },
        { name: "Surgery", id: 4 },
        { name: "Urgent Care", id: 5 },
      ],
      isDeleteShow: false,
      selectedPatientId: -1,
    };
    this.onSelectVisitType = this.onSelectVisitType.bind(this);
    this.onRemoveVisitType = this.onRemoveVisitType.bind(this);

    socket.on("update-patientInfomation", async (response) => {
      let { userId, locationId } = await getLoginUserId();
      if (!userId || !locationId) {
        return;
      }
      if (userId === response.clientId && locationId === response.locationId) {
        this.fetchData();
      }
    });
    socket.on("remove-patient", async (response) => {
      let { userId, locationId } = await getLoginUserId();
      if (!userId || !locationId) {
        return;
      }
      if (userId === response.clientId && locationId === response.locationId) {
        this.fetchData();
      }
    });
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

  fetchData = async () => {
    try {
      if (!this.props.user.default_location) {
        return;
      }
      const { filterStatus, visitDate, searchBy } = this.state;
      let searchQuery = ``;
      if (filterStatus && filterStatus !== "" && filterStatus.value) {
        if (searchQuery.length > 0) {
          searchQuery = searchQuery + `&filterStatus=${filterStatus}`;
        } else {
          searchQuery = `filterStatus=${filterStatus.value}`;
        }
      }
      if (visitDate && visitDate !== "") {
        if (searchQuery.length > 0) {
          searchQuery = searchQuery + `&visitDate=${visitDate}`;
        } else {
          searchQuery = `visitDate=${visitDate}`;
        }
      }
      if (searchBy && searchBy !== "") {
        if (searchQuery.length > 0) {
          searchQuery = searchQuery + `&searchBy=${searchBy}`;
        } else {
          searchQuery = `searchBy=${searchBy}`;
        }
      }
      this.setState({ selectedPatientData: null, listType:null });
      this.props.fetchVisitorList(searchQuery);
    } catch (err) {
      let message =
        err && err.message ? err.message : "Something went wrong in fetchData";
      errorToast(message);
    }
  };
  handleSelectedChange = async (event) => {
    try {
      let value = event;
      this.setState({ filterStatus: value }, () => {
        this.fetchData();
      });
      return;
    } catch (err) {
      let message =
        err && err.message
          ? err.message
          : "Something went wrong in handleSelectedChange";
      errorToast(message);
    }
  };
  onSelectDate = async (event) => {
    try {
      this.setState({ visitDate: event }, () => {
        this.fetchData();
      });
      return;
    } catch (err) {
      let message =
        err && err.message
          ? err.message
          : "Something went wrong in onSelectDate";
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
    this.setState({ showPatientInfo: false, selectedPatientData: null, listType: null });
  }
  openPatientInfoModel = (index) => {
    try {
        let listType = null;
        let selectedPatientData = null;
        let { showPatientInfo } = this.state;
        if (!showPatientInfo) {
          selectedPatientData = this.props.visitorList[index];
          console.log("\n selectedPatientData::", selectedPatientData);
          let type = "test"; // check user type here
            switch (type) {
                case 'waiting':
                    listType = 'waiting';
                    break;
                case 'checkInOut':
                    listType = 'checkInOut';
                    break;
                case 'servedSection':
                    listType = 'servedSection';
                    break;
                default:
                    break;
            }
        }
        this.setState({ showPatientInfo: !showPatientInfo, selectedPatientData, listType });
    } catch (e) {
        console.log('error in openPatientInfoModel:', e.message || e)
        let message = e.message || 'Something went wrong in openPatientInfoModel';
        errorToast(message)
    }
}
modalChatLoaded = () => {
  console.log('\n on modal chat load...')
}
onRemoveProfileFromChat = (selectedPatientData, listType) => {
	// currently not add remove feature...
  console.log("\n on remove ...", selectedPatientData, listType)
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
  
  handlePatientSelection = async (event) => {
    try {
      let value = event;
      console.log("\n value:::", value);
      return;
    } catch (err) {
      let message =
        err && err.message
          ? err.message
          : "Something went wrong in handlePatientSelection";
      errorToast(message);
    }
  };
  hidePatientUpdateModal() {
    this.setState({
      showPatientEdit: false,
      updatePatient: {
        patientId: {
          first_name: "",
          last_name: "",
          email: "",
        },
        parkingSpot: "",
        visitType: [],
      },
    });
  }
  async openPatientUpdateModel(index) {
    try {
      0;
      const selectedData = this.props.visitorList[index];
      const updatePayload = {
        _id: selectedData._id,
        patientId: {
          _id:
            selectedData.patientId && selectedData.patientId._id
              ? selectedData.patientId._id
              : "",
          first_name:
            selectedData.patientId && selectedData.patientId.first_name
              ? selectedData.patientId.first_name
              : "",
          last_name:
            selectedData.patientId && selectedData.patientId.last_name
              ? selectedData.patientId.last_name
              : "",
          email:
            selectedData.patientId && selectedData.patientId.email
              ? selectedData.patientId.email
              : "",
        },
        parkingSpot: selectedData.parkingSpot ? selectedData.parkingSpot : "",
        visitType: selectedData.visitType ? selectedData.visitType : [],
      };
      this.setState({ updatePatient: updatePayload }, () => {
        this.setState({ showPatientEdit: true });
      });
    } catch (err) {
      let message = err && err.message ? err.message : "Something went wrong";
      console.log("\n message:", message);
      errorToast(message);
    }
  }
  updatePatientInfo = async (e) => {
    console.log("\n update patient form....");
    try {
      const { updatePatient, patientError } = this.state;
      if (
        patientError.first_name ||
        patientError.last_name ||
        patientError.email ||
        patientError.parkingSpot ||
        patientError.visitType
      ) {
        errorToast("Please select a visit type");
        return;
      }
      if (updatePatient.visitType && updatePatient.visitType.length == 0) {
        return;
      }
      console.log("\n updatePatient:", updatePatient);
      // send to add api for update...
      this.props.updatePatientInfor(updatePatient);
      this.hidePatientUpdateModal();
    } catch (err) {
      let message = err && err.message ? err.message : "Something went wrong";
      console.log("\n message:", message);
      errorToast(message);
    }
  };
  handlePatientChange = async (event) => {
    try {
      const { updatePatient, patientError } = this.state;
      let { name, value } = event.target;
      patientError[name] = false;
      if (name == "first_name" || name == "last_name" || name == "email") {
        if (name === "email") {
          const checkEmail = await validateEmail(value);
          if (!checkEmail) {
            patientError.email = true;
          } else {
            patientError.email = false;
          }
        }
        if (!value) {
          patientError[name] = true;
        }
        updatePatient.patientId[name] = value;
      } else {
        updatePatient[name] = value;
      }
      this.setState({ ...updatePatient, ...patientError });
    } catch (err) {
      let message = err && err.message ? err.message : "Something went wrong";
      console.log("\n message:", message);
      errorToast(message);
    }
  };

  onSelectVisitType(selectedList, selectedItem) {
    try {
      console.log("\n on select", selectedList, selectedItem);
      const { updatePatient, patientError } = this.state;
      updatePatient.visitType = selectedList;
      patientError.visitType = false;
      this.setState({ ...updatePatient, ...patientError });
    } catch (err) {
      console.log("\n error in select visit:", err.message || err);
      let message = err && err.message ? err.message : "Something went wrong";
      console.log("\n message:", message);
      errorToast(message);
    }
  }

  onRemoveVisitType(selectedList, removedItem) {
    try {
      console.log("\n on remove", removedItem);
      const { updatePatient, patientError } = this.state;
      updatePatient.visitType = selectedList;
      if (updatePatient.visitType.length === 0) {
        patientError.visitType = true;
      }
      this.setState({ ...updatePatient, ...patientError });
    } catch (err) {
      console.log("\n error in select visit:", err.message || err);
      let message = err && err.message ? err.message : "Something went wrong";
      console.log("\n message:", message);
      errorToast(message);
    }
  }

  hideDeleteModal = () => {
    this.setState({ isDeleteShow: false, selectedPatientId: -1 });
  };
  async openPatientDeleteModel(index) {
    try {
      console.log("\n openPatientDeleteModel:", index);
      const selectedData = this.props.visitorList[index];
      this.setState({ selectedPatientId: selectedData._id }, () => {
        this.setState({ isDeleteShow: true });
      });
    } catch (err) {
      let message = err && err.message ? err.message : "Something went wrong";
      console.log("\n message:", message);
      errorToast(message);
    }
  }

  confirmDeleteProfile = async () => {
    try {
      const { selectedPatientId } = this.state;
      console.log("\n selectedPatientId:", selectedPatientId);
      await this.props.removePatient({ id: selectedPatientId, deleteType: 3 });
      this.hideDeleteModal();
    } catch (e) {
      console.log("error in confirmDeleteProfile:", e.message || e);
      let message = e.message || "Something went wrong in confirmDeleteProfile";
      errorToast(message);
    }
  };

  render() {
    const {
      filterStatus,
      visitDate,
      showPatientInfo,
      statusContent,
      updatePatient,
      patientError,
      selectedPatientData,
      listType
    } = this.state;
    const { fetchingVisitorList, visitorList } = this.props;
    return (
      <div>
        <section className="visitor-review-holder">
          <div className="cstm-container">
            <div className="topbx-holder">
              <div className="row">
                <div className="col-md-12">
                  <div className="headingbx">
                    <div className="headcontbx">
                      <h1>Daily Visitor List:</h1>
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
                          <div className="btn-holder dob-holder">
                            <DatePicker
                              calendarClassName="dob-calender"
                              className="btn dob-input"
                              placeholderText="Past Date"
                              dateFormat="dd-MM-yyyy"
                              selected={visitDate}
                              onChange={(date) => this.onSelectDate(date)}
                            />
                            {/* <span className="calender-icon icon"> <img src={calendarSVG} alt="" /> </span>
                                                        <span className="txbx"> Past Visits </span>
                                                        <span className="drop-icon icon"> <img src={dropdownSVG} alt="" /> </span> */}
                          </div>
                          <div className="btn-holder btn visit-outer">
                            <Select
                              value={filterStatus}
                              onChange={(e) => this.handleSelectedChange(e)}
                              options={statusContent}
                              className="visit-status txbx"
                              name="Status"
                              placeholder="Status"
                            />
                            {/* <button type="button" name="button" className="btn">
                                                        <span className="txbx"> Status </span>
                                                        <span className="drop-icon icon"> <img src={dropdownSVG} alt="" /> </span>
                                                    </button> */}
                          </div>
                          <div className="btn-holder">
                            <button type="button" name="button" className="btn">
                              <span className="txbx"> Export </span>
                              <span className="icon">
                                {" "}
                                <img src={exportSVG} alt="" />{" "}
                              </span>
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
                        <th className="check-container" key="all">
                          <div className="check-holder">
                            <div className="check-form-group">
                              <input
                                type="checkbox"
                                id="all"
                                onChange={(e) => this.handlePatientSelection(e)}
                              />
                              <label htmlFor="all">ALL </label>
                            </div>
                          </div>
                        </th>
                        <th className="name" key="name">
                          Name
                        </th>
                        <th className="ratings" key="number">
                          Phone Number
                        </th>
                        <th className="comments" key="reason">
                          Reason for Visit
                        </th>
                        <th className="submit" key="visit">
                          Visit
                        </th>
                        <th className="actions" key="action">
                          {" "}
                          &nbsp;{" "}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {!fetchingVisitorList &&
                      visitorList &&
                      visitorList.length > 0 ? (
                        visitorList.map((value, index) => (
                          <tr key={index}>
                            <td
                              className="check-container"
                              key="allValue_{index}"
                            >
                              <div className="check-holder">
                                <div className="check-form-group">
                                  <input
                                    type="checkbox"
                                    id={index}
                                    onChange={(e) =>
                                      this.handlePatientSelection(e)
                                    }
                                  />
                                  <label htmlFor={index}> </label>
                                </div>
                              </div>
                            </td>
                            <td className="name" key="nameValue_{index}">
                              <div className="name-inner">
                                <h3>
                                  {value?.patientId?.first_name}{" "}
                                  {value?.patientId?.last_name}
                                </h3>
                              </div>
                            </td>
                            <td className="name" key="numberValue_{index}">
                              <div className="name-inner">
                                {value?.patientId?.fullNumber}
                              </div>
                            </td>
                            <td className="name" key="reasonValue_{index}">
                              <div className="name-inner">
                                {value.visitReason}
                              </div>
                            </td>
                            <td className="name" key="dateValue_{index}">
                              <div className="name-inner">
                                {value.visitDate}
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
                                          Profile Settings
                                        </label>
                                        <ul className="test,....">
                                          <li key="_sub1_{index}">
                                            <a
                                            className={
                                              showPatientInfo
                                                  ? "btn disable-click"
                                                  : "btn"
                                              }
                                              onClick={() =>
                                                this.openPatientInfoModel(index)
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
                                                Access Profile
                                              </span>
                                            </a>
                                          </li>
                                          <li key="_sub2_{index}">
                                            <a
                                              className={
                                                showPatientInfo
                                                    ? "btn disable-click"
                                                    : "btn"
                                                }
                                              onClick={() =>
                                                this.openPatientUpdateModel(
                                                  index
                                                )
                                              }
                                            >
                                              <span className="icon">
                                                {" "}
                                                <img
                                                  src={editProfileSVG}
                                                  alt=""
                                                />{" "}
                                              </span>
                                              <span className="txbx">
                                                Edit Profile
                                              </span>
                                            </a>
                                          </li>
                                          <li key="_sub3_{index}">
                                            <a 
                                            className={
                                              showPatientInfo
                                                  ? "btn disable-click"
                                                  : "btn"
                                              }
                                            >
                                              <span className="icon">
                                                {" "}
                                                <img
                                                  src={settingSVG}
                                                  alt=""
                                                />{" "}
                                              </span>
                                              <span className="txbx">
                                                Custom Settings
                                              </span>
                                            </a>
                                          </li>
                                          <li key="_sub4_{index}">
                                            <a
                                              className={
                                                showPatientInfo
                                                    ? "btn disable-click"
                                                    : "btn"
                                                }
                                              onClick={() =>
                                                this.openPatientDeleteModel(
                                                  index
                                                )
                                              }
                                            >
                                              <span className="icon">
                                                {" "}
                                                <img
                                                  src={cancelSVG}
                                                  alt=""
                                                />{" "}
                                              </span>
                                              <span className="txbx">
                                                Delete Profile
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
                          {fetchingVisitorList && (
                            <td
                              key="loading"
                              className="text-center"
                              colSpan="6"
                            >
                              <h3>Loading....</h3>
                            </td>
                          )}
                          {!fetchingVisitorList && (
                            <td
                              key="no_value"
                              className="text-center"
                              colSpan="6"
                            >
                              <h3>No Visitor Found..</h3>
                            </td>
                          )}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Modal
                    show={showPatientInfo}
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
                                    <div className="row">
                                        <ChatInformation popupData={selectedPatientData} listType={listType} getMomentTime={this.getMomentTime} onRemoveProfileFromChat={this.onRemoveProfileFromChat} confirmToMove={this.confirmToMove} />
                                        <ChatBox popupData={selectedPatientData} listType={listType} onRef={ref => (this.chatChild = ref)} getMomentTime={this.getMomentTime} />
                                        <QuickResponse popupData={selectedPatientData} listType={listType} onSelectQuickResponse={this.onSelectQuickResponse} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
        <Modal
          show={this.state.showPatientEdit}
          onHide={() => this.hidePatientUpdateModal()}
          dialogClassName={"modal-dialog-centered patientInfo"}
          contentClassName={""}
        >
          <div className="modal-header">
            <h1>Edit Patient Detail</h1>
            <button
              type="button"
              className="close"
              onClick={() => this.hidePatientUpdateModal()}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body patient-info-body">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="first_name">First Name </label>
                <input
                  type="text"
                  name="first_name"
                  value={updatePatient.patientId.first_name}
                  className={
                    patientError.first_name
                      ? "form-control error-box"
                      : "form-control"
                  }
                  placeholder="First Name"
                  onChange={(e) => this.handlePatientChange(e)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="last_name">Last Name </label>
                <input
                  type="text"
                  name="last_name"
                  value={updatePatient.patientId.last_name}
                  className={
                    patientError.last_name
                      ? "form-control error-box"
                      : "form-control"
                  }
                  placeholder="Last Name"
                  onChange={(e) => this.handlePatientChange(e)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  value={updatePatient.patientId.email}
                  className={
                    patientError.email
                      ? "form-control error-box"
                      : "form-control"
                  }
                  placeholder="Email"
                  onChange={(e) => this.handlePatientChange(e)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="parkingSpot">Parking Spot number</label>
                <input
                  type="text"
                  name="parkingSpot"
                  value={updatePatient.parkingSpot}
                  className={
                    patientError.parkingSpot
                      ? "form-control error-box"
                      : "form-control"
                  }
                  placeholder="parking Spot"
                  onChange={(e) => this.handlePatientChange(e)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="">Visit type</label>
                <Multiselect
                  className={
                    patientError.visitType
                      ? "form-control error-box"
                      : "form-control"
                  }
                  options={this.state.visitOptions} // Options to display in the dropdown
                  selectedValues={updatePatient.visitType} // Preselected value to persist in dropdown
                  showCheckbox={true}
                  closeOnSelect={false}
                  placeholder="Select visit type"
                  onSelect={this.onSelectVisitType} // Function will trigger on select event
                  onRemove={this.onRemoveVisitType} // Function will trigger on remove event
                  displayValue="name" // Property name to display in the dropdown options
                />
              </div>
            </div>
          </div>
          <div className="modal-footer add-client-footer">
            <button
              type="button"
              className="btn bluebtn"
              onClick={() => this.updatePatientInfo()}
            >
              Update
            </button>
          </div>
        </Modal>
        <Modal
          show={this.state.isDeleteShow}
          onHide={() => this.hideDeleteModal()}
          dialogClassName={"modal-dialog-centered"}
          contentClassName={"delete-modal-content"}
        >
          <div className="modal-header">
            <button
              type="button"
              className="close"
              onClick={() => this.hideDeleteModal()}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="icon-holder">
              <img src={dustbinImage} alt="" />
            </div>
            <h1>You have chosen to remove patient profile.</h1>
            <p>
              Are you sure , you want to remove this profile from daily list
            </p>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn redbtn"
              onClick={() => this.confirmDeleteProfile()}
            >
              Remove profile
            </button>
            <button
              type="button"
              className="btn bluebtn"
              onClick={() => this.hideDeleteModal()}
            >
              DON'T DELETE
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapState(state) {
  const { fetchingVisitorList, visitorList, visitoListError } = state.users;
  const { user } = state.authentication;
  return { user, fetchingVisitorList, visitoListError, visitorList };
}

const actionCreators = {
  fetchVisitorList: userActions.fetchVisitorList,
  updatePatientInfor: commonActions.updatePatientInfor,
  removePatient: commonActions.removePatient,
  OpenLocationModelAction: userActions.OpenLocationModelAction,
  closeLocationModelAction: userActions.closeLocationModelAction,
};

export default connect(mapState, actionCreators)(VisitorList);
