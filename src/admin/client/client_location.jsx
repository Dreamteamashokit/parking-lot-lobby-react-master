import React from "react";
import { connect } from "react-redux";
import "../../_assets/css/sass/visitor-review.scss";
import { default as dropdownSMSVG } from "../../_assets/images/dropdown-sm.svg";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Modal from "react-bootstrap/Modal";
import { default as accessProfileSVG } from "../../_assets/images/access-profile.svg";
import { adminActions } from "../../_actions";
import { Link } from "react-router-dom";
import { errorToast } from "../../_helpers";
import { default as documentImg } from "../../_assets/images/file.svg";
import { history } from "../../_helpers";
class ClientLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      twilioNumber: "",
      jotformId: "",
      locationId: "",
      isAddLocationOpen: false,
      isJotformOpen: false,
      isAnalyticDataShow: false,
      client: {
        name: "",
        jotformId: "",
        twilioNumber: "",
        clientId: null,
      },
      errors: {
        name: false,
        twilioNumber: false,
        jotformId: false,
      },
    };
    this.submitTwilioNumber = this.submitTwilioNumber.bind(this);
    this.editTwilioNumber = this.editTwilioNumber.bind(this);
    this.submitTwilioNumber = this.submitTwilioNumber.bind(this);
    this.editJotform = this.editJotform.bind(this);
  }

  componentDidMount() {
    const href = window.location.href;
    const clientId = href.substring(href.lastIndexOf("/") + 1);
    const { client } = this.state;
    client.clientId = clientId;
    this.setState({ client });
    this.props.fetchLocationList(clientId);
    this.props.fetchJotformList();
  }

  async submitTwilioNumber() {
    this.props.addTwilioNumber({
      locationId: this.state.locationId,
      twilio_number: this.state.twilioNumber,
    });
    this.setState({ isOpen: false });
  }

  async submitLocationJotform() {
    this.props.addLocationJotform({
      locationId: this.state.locationId,
      jotformId: this.state.jotformId,
    });
    this.setState({ isJotformOpen: false });
  }

  editTwilioNumber(twilioNumber, locationId) {
    this.setState({
      isOpen: true,
      twilioNumber: twilioNumber,
      locationId: locationId,
    });
  }

  editJotform(jotformId, locationId) {
    this.setState({
      isJotformOpen: true,
      jotformId: jotformId,
      locationId: locationId,
    });
  }

  handlePhoneChange = async (value) => {
    try {
      const { client, errors } = this.state;
      errors.twilioNumber = false;
      if (!value) {
        errors.twilioNumber = true;
      }
      client.twilioNumber = value;
      this.setState({ ...client, ...errors });
    } catch (err) {
      console.log("\n handlePhoneChange error:", err.message || err);
      let message = err && err.message ? err.message : "Something went wrong";
      errorToast(message);
    }
  };
  handleChange = async (event) => {
    try {
      const { name, value } = event.target;
      const { client, errors } = this.state;
      errors.name = false;
      if (!value) {
        errors.name = true;
      }
      this.setState({
        errors,
        client: {
          ...client,
          [name]: value,
        },
      });
    } catch (err) {
      console.log("\n error handleChange:", err.message || err);
      let message = err && err.message ? err.message : "Something went wrong";
      errorToast(message);
    }
  };
  handleJotformChange = async (event) => {
    try {
      const { value } = event.target;
      const { errors } = this.state;
      errors.jotformId = false;
      if (!value) {
        errors.jotformId = true;
      }
      this.setState({
        errors,
        jotformId: value
      });
    } catch (err) {
      console.log("\n error handleJotformChange:", err.message || err);
      let message = err && err.message ? err.message : "Something went wrong";
      errorToast(message);
    }
  };
  addNewLocation = async () => {
    try {
      const { client, errors } = this.state;
      if (errors.name || errors.twilioNumber) {
        return;
      }
      if (!client.name || client.name == "") {
        errors.name = true;
        this.setState({ errors });
        return;
      }
      if (!client.twilioNumber || client.twilioNumber == "") {
        errors.twilioNumber = true;
        this.setState({ errors });
        return;
      }
      console.log("\n client:", client, "errors:", errors);
      const response = await this.props.addLocation(client);
      console.log("\n response:", response);
    } catch (err) {
      console.log("\n error handleChange:", err.message || err);
      let message = err && err.message ? err.message : "Something went wrong";
      errorToast(message);
    }
  };
  UNSAFE_componentWillReceiveProps(nextProps) {
    try {
      console.log(
        "\n nextProps.locationRegistered:",
        nextProps.locationRegistered
      );
      const outerThis = this;
      if (
        nextProps.hasOwnProperty("locationRegistered") &&
        nextProps.locationRegistered
      ) {
        console.log("\n when location register change....");
        const { client } = this.state;
        this.props.fetchLocationList(client.clientId);
        this.props.resetLocation();
        this.setState({
          isAddLocationOpen: false,
          client: {
            ...client,
            name: "",
            twilioNumber: "",
          },
          errors: {
            name: false,
            twilioNumber: false,
          },
        });
      }
    } catch (err) {
      let message = err && err.message ? err.message : "Something went wrong";
      console.log("\n message:", message);
      errorToast(message);
    }
  }
  handleFeature = async (locationId, clinicId, event) => {
    try {
      if (!clinicId || this.props.updateSmsLoader) return;
      this.props.smsFeatureAllowDisallow({
        allowSmsFeature: event.target.checked,
        location: locationId,
        clientId: clinicId,
      });
    } catch (err) {
      let message = err && err.message ? err.message : "Something went wrong";
      errorToast(message);
    }
  };

  handleLocationAnalytic = async (locationId) => {
    try {
      const endPoint = `admin/clinic-analytics-data?locationId=${locationId}`;
      this.props.fetchAnalyticData(endPoint);
      this.setState({ isAnalyticDataShow: true });
    } catch (e) {}
  };
  onCloseAnalyticPopup = async () => {
    try {
      this.setState({ isAnalyticDataShow: false });
      this.props.resetAnalyticData();
    } catch (e) {}
  };

  render() {
    const { client, errors, jotformId } = this.state;
    const {
      fetchingLocationList,
      locationList,
      jotformList,
      isLocationRegistering,
      analyticLoader,
      locationAnalyticData,
    } = this.props;
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    return (
      <div>
        <section className="visitor-review-holder">
          <div className="cstm-container">
            <div className="topbx-holder">
              <div className="row">
                <div className="col-md-6">
                  <div className="add-location-link">
                    <Link
                      to="#"
                      onClick={() => {
                        this.setState({ isAddLocationOpen: true });
                        this.props.resetLocation();
                      }}
                    >
                      Add Location
                    </Link>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="back-to-previous">
                    <Link to="/admin/client-list">Back To Previous Page</Link>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="headingbx">
                    <div className="headcontbx">
                      <h1>Location List:</h1>
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
                          ClinicName
                        </th>
                        <th className="ratings" key="number">
                          Open/close
                        </th>
                        <th className="comments" key="reason_active">
                          Active
                        </th>
                        <th className="comments" key="sms_feature">
                          Sms Enable/Disable
                        </th>
                        <th className="comments" key="reason_number">
                          Twilio Number
                        </th>
                        <th className="comments" key="jotform_id">
                          Jotform ID
                        </th>
                        <th className="actions" key="action">
                          {" "}
                          &nbsp;{" "}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {locationList && locationList.length > 0 ? (
                        locationList.map((value, index) => (
                          <tr key={index}>
                            <td className="name" key="nameValue_{index}">
                              <div className="name-inner">
                                <h3>{value.name}</h3>
                              </div>
                            </td>
                            <td className="name" key="isopen_{index}">
                              <div className="name-inner">
                                {value.isOpen ? (
                                  <h3>Opened</h3>
                                ) : (
                                  <h3 style={{ color: "red" }}>Closed</h3>
                                )}
                              </div>
                            </td>
                            <td className="name" key="isactive{index}">
                              <div className="name-inner">
                                {value.isActive ? <h3>Active</h3> : null}
                              </div>
                            </td>
                            <td className="name" key="smsValue_{index}">
                              <div className="status-inner togglebtn-holder">
                                <div className="btn-holder ynobtn-holder">
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      name="smsFeature"
                                      checked={value?.allowSmsFeature}
                                      value={value?.allowSmsFeature}
                                      disabled={this.props.updateSmsLoader}
                                      onChange={(e) =>
                                        this.handleFeature(
                                          value?._id,
                                          value?.clinicId?._id,
                                          e
                                        )
                                      }
                                    />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                            </td>
                            <td className="name" key="twiliono_{index}">
                              <div className="name-inner">
                                {value.twilioNumber}
                              </div>
                            </td>
                            <td className="name" key="jotformid_{index}">
                              <div className="name-inner">
                                {value.jotformId?.jotformId}
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
                                              className="btn"
                                              onClick={() =>
                                                this.handleLocationAnalytic(
                                                  value._id
                                                )
                                              }
                                            >
                                              <span className="icon">
                                                <img
                                                  src={documentImg}
                                                  alt=""
                                                  className="file-img-analytic"
                                                />
                                              </span>
                                              <span className="txbx">
                                                Analytic Info
                                              </span>
                                            </a>
                                          </li>
                                          <li key="_sub2_{index}">
                                            <a
                                              className="btn"
                                              onClick={() =>
                                                this.editTwilioNumber(
                                                  value.twilioNumber,
                                                  value._id
                                                )
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
                                                Edit Twilio No.
                                              </span>
                                            </a>
                                          </li>
                                          <li key="_sub3_{index}">
                                            <a
                                              className="btn"
                                              onClick={() =>
                                                this.editJotform(
                                                  value.jotformId?._id,
                                                  value._id
                                                )
                                              }
                                            >
                                              <span className="icon">
                                                {" "}
                                                <img
                                                  src={documentImg}
                                                  alt=""
                                                  className="file-img-analytic"
                                                />{" "}
                                              </span>
                                              <span className="txbx">
                                                Edit Jotform
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
                          {fetchingLocationList && (
                            <td
                              key="loading"
                              className="text-center"
                              colSpan="6"
                            >
                              <h3>Loading....</h3>
                            </td>
                          )}
                          {!fetchingLocationList && (
                            <td
                              key="no_value"
                              className="text-center"
                              colSpan="6"
                            >
                              <h3>No Location Found..</h3>
                            </td>
                          )}
                        </tr>
                      )}

                      {/* <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
      /> */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Modal
          onHide={() => this.setState({ isJotformOpen: false })}
          show={this.state.isJotformOpen}
          dialogClassName={"modal-dialog-centered"}
          contentClassName={"delete-modal-content"}
        >
          <div className="modal-header">
            <button
              type="button"
              className="close"
              onClick={() => this.setState({ isJotformOpen: false })}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <h1 className="add-twilio-number">Update Jotform</h1>
            <select 
              name="jotformId"
                value={jotformId}
                className={
                  errors.jotformId ? "form-control error-box" : "form-control"
                }
                placeholder="Jotform"
                onChange={(e) => this.handleJotformChange(e)}
                >
                  <option value="" hidden>Select Jotform Id</option>
                  {
                    jotformList.map(el => (<option key={el._id} value={el._id}>{el.jotformId} - {el.name}</option>))
                  }
                    </select>
          </div>

          <div className="modal-footer">
            <button
              onClick={() => this.submitLocationJotform()}
              type="button"
              className="btn bluebtn"
            >
              Submit Now
            </button>
          </div>
        </Modal>
        <Modal
          onHide={() => this.setState({ isOpen: false })}
          show={this.state.isOpen}
          dialogClassName={"modal-dialog-centered"}
          contentClassName={"delete-modal-content"}
        >
          <div className="modal-header">
            <button
              type="button"
              className="close"
              onClick={() => this.setState({ isOpen: false })}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <h1 className="add-twilio-number">Add Twilio Number</h1>
            <div className="icon-holder">
              <PhoneInput
                name="fullNumber"
                className="form-control"
                international
                defaultCountry="US"
                value={this.state.twilioNumber}
                onChange={(value) => this.setState({ twilioNumber: value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              onClick={() => this.submitTwilioNumber()}
              type="button"
              className="btn bluebtn"
            >
              Submit Now
            </button>
          </div>
        </Modal>
        <Modal
          onHide={() => this.setState({ isAddLocationOpen: false })}
          show={this.state.isAddLocationOpen}
          dialogClassName={"modal-dialog-centered"}
          contentClassName={"delete-modal-content"}
        >
          <div className="modal-header">
            <button
              type="button"
              className="close"
              onClick={() => this.setState({ isAddLocationOpen: false })}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="form-holder add-location">
            <form className="form" action="" method="post">
              <div className="modal-body">
                <div className="row">
                  <div className="form-group col-md-12">
                    <label htmlFor="practice-name" className="location-label">
                      Location Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={client.name}
                      className={
                        errors.name ? "form-control error-box" : "form-control"
                      }
                      placeholder="Location Name"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-12">
                    <label htmlFor="practice-name" className="location-label">
                      jotform
                    </label>
                    <select 
                          name="jotformId"
                          value={client.jotformId}
                          className={
                            errors.jotformId ? "form-control error-box" : "form-control"
                          }
                          placeholder="Jotform"
                          onChange={(e) => this.handleChange(e)}
                          >
                            <option value="" hidden>Select Jotform Id</option>
                            {
                              jotformList.map(el => (<option key={el._id} value={el._id}>{el.jotformId} - {el.name}</option>))
                            }
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-12">
                    <label htmlFor="create-password" className="location-label">
                      Twilio Number
                    </label>
                    <PhoneInput
                      name="twilioNumber"
                      className={
                        errors.twilioNumber
                          ? "form-control error-box"
                          : "form-control"
                      }
                      international
                      defaultCountry="US"
                      value={client.twilioNumber}
                      onChange={(value) => this.handlePhoneChange(value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => this.addNewLocation()}
                  disabled={isLocationRegistering}
                  type="button"
                  className="btn bluebtn"
                >
                  Submit Now
                </button>
              </div>
            </form>
          </div>
        </Modal>

        <Modal
          onHide={() => this.onCloseAnalyticPopup()}
          show={this.state.isAnalyticDataShow}
          dialogClassName={"modal-dialog-centered"}
          contentClassName={"show-analytic-data"}
        >
          <div className="modal-header">
            <button
              type="button"
              className="close"
              onClick={() => this.onCloseAnalyticPopup()}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="form-holder">
            {analyticLoader && (
              <div className="row">
                <div className="col-12 analytic-loader">Loading....</div>
              </div>
            )}
            {!analyticLoader && (
              <div className="main-container">
                <div className="row location-name">
                  <h4 className="col-6">Location Name</h4>
                  <span className="col-6 content">
                    {locationAnalyticData?.locationData?.name}
                  </span>
                </div>
                <div className="row content-section">
                  <h5 className="col-6">Total Patient</h5>
                  <span className="col-6 content">
                    {locationAnalyticData?.totalPatient}
                  </span>
                </div>
                <div className="row content-section">
                  <h5 className="col-6">Weekly Sms</h5>
                  <span className="col-6 content">
                    {locationAnalyticData?.weeklySms}
                  </span>
                </div>
                <div className="row content-section">
                  <h5 className="col-6">Monthly Sms</h5>
                  <span className="col-6 content">
                    {locationAnalyticData?.monthlySms}
                  </span>
                </div>
                <div className="row content-section">
                  <h5 className="col-6">Yearly Sms</h5>
                  <span className="col-6 content">
                    {locationAnalyticData?.yearlySms}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

function mapState(state) {
  const {
    locationList,
    fetchingLocationList,
    isLocationRegistering,
    locationRegisterError,
    locationRegistered,
    updateSmsLoader,
    analyticLoader,
    locationAnalyticData,
  } = state.fetchLocationList;
  const {
    jotformList,
    fetchingJotformList,
  } = state.adminJotformlist;
  return {
    locationList,
    fetchingLocationList,
    isLocationRegistering,
    locationRegisterError,
    locationRegistered,
    updateSmsLoader,
    analyticLoader,
    locationAnalyticData,
    jotformList,
    fetchingJotformList,
  };
}

const actionCreators = {
  fetchLocationList: adminActions.fetchLocationList,
  fetchJotformList: adminActions.fetchJotformList,
  addTwilioNumber: adminActions.addTwilioNumber,
  addLocationJotform: adminActions.addLocationJotform,
  addLocation: adminActions.addLocation,
  resetLocation: adminActions.resetLocation,
  smsFeatureAllowDisallow: adminActions.smsFeatureAllowDisallow,
  fetchAnalyticData: adminActions.fetchAnalyticData,
  resetAnalyticData: adminActions.resetAnalyticData
};

export default connect(mapState, actionCreators)(ClientLocation);
