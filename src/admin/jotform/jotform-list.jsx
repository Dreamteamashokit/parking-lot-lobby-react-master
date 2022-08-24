import React from "react";
import { connect } from "react-redux";
import "../../_assets/css/sass/visitor-review.scss";
import "react-phone-number-input/style.css";
import { default as dropdownSMSVG } from "../../_assets/images/dropdown-sm.svg";
import { default as accessProfileSVG } from "../../_assets/images/access-profile.svg";
import { history } from "../../_helpers";
import Modal from "react-bootstrap/Modal";
import { adminActions } from "../../_actions";
import { Link } from "react-router-dom";
import { errorToast } from "../../_helpers";

class ClientJotform extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      twilioNumber: "",
      jotformId: "",
      isAddJotformOpen: false,
      isAnalyticDataShow: false,
      client: {
        name: "",
        jotformId: "",
      },
      errors: {
        name: false,
        jotformId: false,
      },
    };
  }

  componentDidMount() {
    const { client } = this.state;
    this.setState({ client });
    this.props.fetchJotformList();
  }

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
  addNewJotform = async () => {
    try {
      const { client, errors } = this.state;
      console.log("\n client:", client, "errors:", errors);
      if (errors.name || errors.jotformId) {
        return;
      }
      if (!client.name || client.name == "") {
        errors.name = true;
        this.setState({ errors });
        return;
      }
      if (!client.jotformId || client.jotformId == "") {
        errors.jotformId = true;
        this.setState({ errors });
        return;
      }
      await this.props.addJotform(client);
      this.setState({ isAddJotformOpen: false });
      this.props.fetchJotformList();
    } catch (err) {
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
        this.props.resetLocation();
        this.setState({
          isAddLocationOpen: false,
          client: {
            ...client,
            name: "",
            jotformId: "",
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
  render() {
    const { client, errors } = this.state;
    const {
      fetchingjotformList,
      jotformList,
      isJotformRegistering,
    } = this.props;
    return (
      <div>
        <section className="visitor-review-holder">
          <div className="cstm-container">
            <div className="topbx-holder">
              <div className="row">
                <div className="col-md-6">
                  <div className="add-jotform-link">
                    <Link
                      to="#"
                      onClick={() => {
                        this.setState({ isAddJotformOpen: true });
                        this.props.resetLocation();
                      }}
                    >
                      Add Jotform
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
                      <h1>Jotform List:</h1>
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
                          Jotform Id
                        </th>
                        <th className="actions" key="action">
                          {" "}
                          &nbsp;{" "}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {jotformList && jotformList.length > 0 ? (
                        jotformList.map((value, index) => (
                          <tr key={index}>
                            <td className="name" key="nameValue_{index}">
                              <div className="name-inner">
                                <h3>{value.name}</h3>
                              </div>
                            </td>
                            <td className="name" key="jotformIdValue_{index}">
                              <div className="name-inner">
                                <h3>{value.jotformId}</h3>
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
                                          Jotform Settings
                                        </label>
                                        <ul className="test,....">
                                          <li key="_sub1_{index}">
                                            <a
                                              className="btn"
                                              onClick={() =>
                                                history.push(
                                                  `/admin/jotform-questions/${value.jotformId}`
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
                                                Questions
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
                          {fetchingjotformList && (
                            <td
                              key="loading"
                              className="text-center"
                              colSpan="6"
                            >
                              <h3>Loading....</h3>
                            </td>
                          )}
                          {!fetchingjotformList && (
                            <td
                              key="no_value"
                              className="text-center"
                              colSpan="6"
                            >
                              <h3>No Jotform Found..</h3>
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
          onHide={() => this.setState({ isAddJotformOpen: false })}
          show={this.state.isAddJotformOpen}
          dialogClassName={"modal-dialog-centered"}
          contentClassName={"delete-modal-content"}
        >
          <div className="modal-header">
            <button
              type="button"
              className="close"
              onClick={() => this.setState({ isAddJotformOpen: false })}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="form-holder add-location" style={{margin: 0}}>
            <form className="form" action="" method="post">
              <div className="modal-body">
                <div className="row">
                  <div className="form-group col-md-12">
                    <label htmlFor="practice-name" className="location-label">
                      Jotform Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={client.name}
                      className={
                        errors.name ? "form-control error-box" : "form-control"
                      }
                      placeholder="Jotform Name"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-12">
                    <label htmlFor="practice-name" className="location-label">
                      Jotform ID
                    </label>
                    <input
                      type="text"
                      name="jotformId"
                      value={client.jotformId}
                      className={
                        errors.name ? "form-control error-box" : "form-control"
                      }
                      placeholder="Jotform Id"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => this.addNewJotform()}
                  disabled={isJotformRegistering}
                  type="button"
                  className="btn bluebtn"
                >
                  Submit Now
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapState(state) {
  const {
    jotformList,
    fetchingJotformList,
  } = state.adminJotformlist;
  return {
    jotformList,
    fetchingJotformList,
  };
}

const actionCreators = {
  fetchJotformList: adminActions.fetchJotformList,
  addJotform: adminActions.addJotform,
  resetLocation: adminActions.resetLocation,
};

export default connect(mapState, actionCreators)(ClientJotform);
