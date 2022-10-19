import React from "react";
import { connect } from "react-redux";
import {
  dropMenuImage,
  checkImage,
  exploreImage,
  checkInImage,
  cancelImage,
  sendImage,
} from "../_assets";

import { default as refreshSVG } from "../_assets/images/refresh.svg";
//import { default as filePdfSolidSVG } from "../_assets/images/file.svg";
import { default as imageSolidSVG } from "../_assets/images/image-solid.svg";
import { default as downloadSolidSVG } from "../_assets/images/download-solid.svg";
import { default as loaderGIF } from "../_assets/images/loader.gif";

import { capitalize, errorToast } from "../_helpers";
import { commonActions } from "../_actions";
import Modal from "react-bootstrap/Modal";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { saveAs } from "file-saver";
import { commonService } from "../_services";
import { default as exportSVG } from "../_assets/images/export.svg";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import Zoom from "react-img-zoom";

class ChatInformation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isName: false,
      popupData: props.popupData,
      listType: props.listType,
      updateObject: {
        first_name: "",
        last_name: "",
        fullNumber: "",
        id: null,
      },
      updateError: {
        first_name: false,
        last_name: false,
        fullNumber: false,
      },
      updateNote: {
        isNotesError: false,
        note: "",
      },
      isModelShow: false,
      isDownloading1: false,
      isDownloading2: false,
      isPreviewModelShow: false,
      pdfUrl: null,
      pdfHtml: null,
      isZoomModelShow: false,
      zoomImage: null,
      isDownloadAll:false
    };
  }
  componentDidMount() {
    this.checkFirstName();
    this.checkNotes();
    this.fetchSubmissionUpload();
  }
  fetchSubmissionUpload() {
    try {
      if (this.state.popupData && this.state.popupData.submissionID)
        this.props.fetchFormUploads(this.state.popupData.submissionID);
    } catch (err) {
      console.log("\n error in fetchSubmissionUpload:", err.message || err);
    }
  }
  checkFirstName = () => {
    const selectedData = this.state.popupData;
    const firstname =
      selectedData &&
      selectedData.patientId &&
      selectedData.patientId.first_name
        ? capitalize(selectedData.patientId.first_name)
        : null;
    if (firstname) {
      this.setState({ isName: true });
    }
  };
  checkNotes = () => {
    const selectedData = this.state.popupData;
    if (selectedData.visitReason) {
      let { updateNote } = this.state;
      updateNote.note = selectedData.visitReason; //patientId.visitNotes;
      this.setState({ updateNote });
    }
  };
  getField = (field) => {
    const selectedData = this.state.popupData;
    switch (field) {
      case "name":
        const firstname =
          selectedData &&
          selectedData.patientId &&
          selectedData.patientId.first_name
            ? capitalize(selectedData.patientId.first_name)
            : null;
        const lastname =
          selectedData &&
          selectedData.patientId &&
          selectedData.patientId.last_name
            ? capitalize(selectedData.patientId.last_name)
            : "";
        const fullNumber =
          selectedData &&
          selectedData.patientId &&
          selectedData.patientId.fullNumber
            ? selectedData.patientId.fullNumber
            : "";
        let fullName = !firstname ? fullNumber : `${firstname} ${lastname}`;
        return fullName;
      case "parkingSpot":
        const spotNumber = selectedData.parkingSpot
          ? selectedData.parkingSpot
          : "NA";
        return spotNumber;
      case "fullNumber":
        const phone =
          selectedData &&
          selectedData.patientId &&
          selectedData.patientId.fullNumber
            ? selectedData.patientId.fullNumber
            : "";
        return phone;
      default:
        return <h1></h1>;
    }
  };
  selectForEdit = () => {
    try {
      const { updateObject } = this.state;
      if (this.state.popupData && this.state.popupData.patientId) {
        updateObject.first_name =
          this.state.popupData.patientId &&
          this.state.popupData.patientId.first_name
            ? this.state.popupData.patientId.first_name
            : "";
        updateObject.last_name =
          this.state.popupData.patientId &&
          this.state.popupData.patientId.last_name
            ? this.state.popupData.patientId.last_name
            : "";
        updateObject.fullNumber =
          this.state.popupData.patientId &&
          this.state.popupData.patientId.fullNumber
            ? this.state.popupData.patientId.fullNumber
            : "";
        updateObject.id =
          this.state.popupData.patientId && this.state.popupData.patientId._id
            ? this.state.popupData.patientId._id
            : null;
      }
      this.setState({ updateObject });
    } catch (err) {
      console.log("\n selectForEdit err:", err.message || err);
    }
  };

  async handleChange(event) {
    try {
      let { name, value } = event.target;
      let { updateObject, updateError } = this.state;
      updateError[name] = false;
      updateObject[name] = value;
      if (!value) {
        console.log("\n when value... ", value);
        updateError[name] = true;
      }

      this.setState({ updateError, updateObject });
    } catch (err) {
      console.log("\n handleChange:", err.message || err);
    }
  }
  async resetEditData() {
    try {
      const { updateObject, updateError } = this.state;
      updateObject.first_name = "";
      updateObject.last_name = "";
      updateObject.fullNumber = "";
      updateObject.id = null;

      updateError.first_name = false;
      updateError.last_name = false;
      updateError.fullNumber = false;

      this.setState({ updateObject, updateError });
    } catch (err) {
      console.log("\n resetEditData err:", err.message || err);
    }
  }
  async onSubmitUpdate() {
    try {
      const { updateObject, updateError, popupData } = this.state;
      if (!updateObject.id) {
        return;
      }
      if (!updateObject.first_name) {
        updateError.first_name = true;
      }
      if (!updateObject.last_name) {
        updateError.last_name = true;
      }
      if (!updateObject.fullNumber) {
        updateError.fullNumber = true;
      }
      if (
        updateError.first_name ||
        updateError.last_name ||
        updateError.fullNumber
      ) {
        this.setState({ updateError });
        return;
      }
      const payload = {
        patientId: updateObject.id,
        first_name: updateObject.first_name,
        last_name: updateObject.last_name,
        fullNumber: updateObject.fullNumber,
      };

      await this.props.updatePatientProfile(payload);
      popupData.patientId.first_name = payload.first_name;
      popupData.patientId.last_name = payload.last_name;
      popupData.patientId.fullNumber = payload.fullNumber;
      this.resetEditData();
    } catch (err) {
      console.log("\n onSubmitUpdate:", err.message || err);
    }
  }
  async setDelayForPatient() {
    try {
      let { popupData } = this.state;
      if (popupData.patientId && popupData.patientId._id) {
        this.props.updateDelayForPatient({
          patientId: popupData.patientId._id,
          is_delay: !popupData.is_delay,
        });
      }
      popupData.is_delay = !popupData.is_delay;
      this.setState({ popupData });
    } catch (err) {
      console.log("\n setDelayForPatient:", err.message || err);
    }
  }
  async setNoShowForPatient() {
    try {
      let { popupData } = this.state;
      if (popupData.patientId && popupData.patientId._id) {
        this.props.noShowSet({
          patientId: popupData.patientId._id,
          noShow: !popupData.noShow,
        });
      }
      popupData.noShow = !popupData.noShow;
      this.setState({ popupData });
    } catch (err) {
      console.log("\n setNoShowForPatient error:", err.message || err);
    }
  }
  async onSelectRemoveProfile() {
    try {
      const { popupData, listType } = this.state;
      this.props.onRemoveProfileFromChat(popupData, listType);
    } catch (err) {
      console.log(
        "\n chatInformation.onSelectRemoveProfile:",
        err.message || err
      );
    }
  }
  async handleNoteChange(event) {
    try {
      let { value } = event.target;
      let { updateNote } = this.state;
      updateNote.isNotesError = false;
      updateNote.note = value;
      if (!value) {
        updateNote.isNotesError = true;
      }
      this.setState({ updateNote });
    } catch (err) {
      console.log("\n handleNoteChange error:", err.message || err);
    }
  }
  async handleNoteSubmit() {
    try {
      let { updateNote, popupData } = this.state;
      if (updateNote.isNotesError) {
        console.log("\n eror in ote..");
      }
      console.log("\n updateNote:", updateNote.note);
      if (popupData.patientId && popupData.patientId._id) {
        this.props.updateNotesForPatient({
          patientId: popupData.patientId._id,
          visitNotes: updateNote.note,
        });
      }
    } catch (err) {
      console.log("\n handleNoteSubmit error:", err.message || err);
    }
  }
  async movePatientToServed() {
    try {
      let { popupData } = this.state;
      if (popupData.patientId && popupData.patientId._id) {
        this.props.confirmToMove(popupData._id, popupData.patientId._id, 2);
      }
    } catch (err) {
      console.log("\n movePatientToServed error:", err.message || err);
    }
  }
  async movePatientToCheckIn() {
    try {
      let { popupData } = this.state;
      if (popupData.patientId && popupData.patientId._id) {
        this.props.confirmToMove(popupData._id, popupData.patientId._id, 1);
      }
    } catch (err) {
      console.log("\n movePatientToServed error:", err.message || err);
    }
  }
  moveBackToWaiting = async () => {
    try {
      const { popupData } = this.state;
      if (popupData && popupData._id) {
        this.props.resetWaiting(popupData._id, this.props.listType);
      }
    } catch (err) {
      let message =
        err && err.message ? err.message : "Something went wrong in fetchData";
      errorToast(message);
    }
  };
  handleCarLobbyToggle = (event) => {
    try {
      const { popupData } = this.state;
      popupData.patientId.carOrLobby = event.target.checked ? 1 : 2;
      this.setState({ ...popupData });
      const payload = {
        patientId: popupData.patientId._id,
        carLobby: popupData.patientId.carOrLobby,
      };
      this.props.updateCarLobby(payload);
    } catch (err) {
      console.log("\n err  in handleClientChange:", err.message || err);
      let message =
        err && err.message ? err.message : "Something went wrong in fetchData";
      errorToast(message);
    }
  };

  openModel = () => {
    if (!this.props.fetching_uploads && this.props.isfetchUploadComplete) {
      if (this.props.upload_list && this.props.upload_list.length > 0)
        this.setState({ isModelShow: true });
      else errorToast("Not found any uploaded file for selected patient.");
    } else {
      errorToast("Fetching form files, please wait...");
    }
  };

  hideModal = () => {
    this.setState({ isModelShow: false });
  };
  modalLoaded = () => {
    try {
      //console.log('\n on modal load...', this.props.fetching_uploads, '\n isfetchUploadComplete:', this.props.isfetchUploadComplete, 'upload_list:', this.props.upload_list)
    } catch (err) {
      console.log("\n modalLoaded error ::", err.message || err);
    }
  };

  downloadImage = (event) => {
    try {
      console.log("\n downloadImage event:", event);
      /* if(event >= 0) {
                console.log('\n this.props.upload_list:', this.props.upload_list[event])
                saveAs(this.props.upload_list[event]);
            } */
    } catch (err) {
      let message =
        err && err.message
          ? err.message
          : "Something wrong during download image.";
      errorToast(message);
    }
  };
  downloadImageOnClick = async (index, type = 'png') => {
    try {
      console.log("\n downloadOuterImage index:", index);
      if (index >= 0) {
        const response = await this.bufferImage(this.props.upload_list[index]);
        saveAs(response, `image_${index}.${type}`);
      }
    } catch (err) {
      let message =
        err && err.message
          ? err.message
          : "Something wrong during download image.";
      errorToast(message);
    }
  };
  downloadAllImages = async (type = 'png') => {
    try {
      if (this.props.upload_list && this.props.upload_list.length > 0) {
        const urls = this.props.upload_list;
        const zip = new JSZip();
        let count = 0;
        const zipFilename = "allImages.zip";
        const outerThis = this;
        this.setState({isDownloadAll:true});
        urls.forEach(async function (url, index) {
          //const urlArr = url.split('/');
          const filename = `image_${index + 1}.${type}`;
          //const filename = urlArr[urlArr.length - 1];
          console.log("\n filename:", filename);
          try {
            const fileData = await outerThis.bufferImage(url);
            const file = await JSZipUtils.getBinaryContent(fileData);
            zip.file(filename, file, { binary: true }); //
            count++;
            if (count === urls.length) {
              zip.generateAsync({ type: "blob" }).then(function (content) {
                saveAs(content, zipFilename);
              });
              outerThis.setState({isDownloadAll:false});
            }
          } catch (err) {
            count++;
            console.log("error occur in zip section:", err.message || err);
          }
        });
      }
    } catch (err) {
      console.log("\n downloadAllImages error:", err);
      let message =
        err && err.message
          ? err.message
          : "Something wrong during download images.";
      errorToast(message);
    }
  };
  bufferImage = async (url) => {
    return new Promise((resolve, reject) => {
      try {
        commonService.fetchAttachement(url)
        .then(
            response => {
              if(response && response.data)
              return resolve(response.data);
              else 
              return reject({message:"no Content found"});
            },
            error => {
                return reject (error);
            }
        )
      } catch (error) {
        return reject(error);
      }
    });
  };

  downloadPdf = async (submissionId, type) => {
    try {
      this.uploadeIsLoader(type, true);
      if (!this.state.pdfUrl) {
        const pdfUrl = await this.generatePdf(submissionId, type);
        this.setState({ pdfUrl: pdfUrl });
        const name = await this.getField("name");
        saveAs(pdfUrl, `${name}.pdf`);
      } else {
        this.setState({ isPreviewModelShow: false, pdfUrl:null });
        const name = await this.getField("name");
        saveAs(this.state.pdfUrl, `${name}.pdf`);
      }

      this.uploadeIsLoader(type, false);
    } catch (err) {
      let message =
        err && err.message
          ? err.message
          : "Something wrong during download pdf.";
      errorToast(message);
      this.uploadeIsLoader(type, false);
    }
  };
  uploadeIsLoader = (type, value) => {
    switch (type) {
      case 1:
        this.setState({ isDownloading1: value });
        return;
      case 2:
        this.setState({ isDownloading2: value });
        return;
      default:
        return;
    }
  };
  generatePdf = async (submissionId, type) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { backend_url, response } = await commonService.downloadPdf(
          submissionId,
          type
        );
        if (response && response.status) {
          //console.log("\n backend_url:", backend_url, "\n==response:",response)
          const pdfUrl = `${backend_url}/${response.data}`;
          return resolve(pdfUrl);
        } else {
          let messagePayload = response.message
            ? response.message
            : "Something wrong during download pdf.";
          return reject({ message: messagePayload });
        }
      } catch (err) {
        return reject(err);
      }
    });
  };
  previewPdf = async (submissionId, type) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { response } = await commonService.previewPdf(
          submissionId,
          type
        );
        if (response && response.status) {
          return resolve(response.data);
        } else {
          let messagePayload = response.message
            ? response.message
            : "Something wrong during preview pdf.";
          return reject(messagePayload);
        }
      } catch (err) {
        return reject(err);
      }
    });
  };

  //============pdf preview =========//
  hidePreviewModal = () => {
    this.setState({ isPreviewModelShow: false, pdfUrl:null });
  };
  openPreviewModal = async (submissionId, type) => {
    try {
      this.uploadeIsLoader(type, true);
      if (1 || !this.state.pdfHtml) {
        const pdfHtml = await this.previewPdf(submissionId, type);
        this.setState({ isPreviewModelShow: true, pdfHtml });
      } else {
        this.setState({ isPreviewModelShow: true });
      }

      this.uploadeIsLoader(type, false);
    } catch (err) {
      return reject(err);
    }
  };
  //==============End================//
  OnHoverZoomImage = async (image, isZoom) => {
    try {
      console.log("\n image:", image, "\n isZoom:", isZoom);
      if (isZoom) {
        this.setState({ isZoomModelShow: true, zoomImage: image });
      } else {
        this.setState({ isZoomModelShow: false, zoomImage: null });
      }
    } catch (err) {
      let message =
        err && err.message
          ? err.message
          : "Something wrong during download pdf.";
      errorToast(message);
    }
  };
  hideZoomModal = () => {
    this.setState({ isZoomModelShow: false, zoomImage: null });
  };

  render() {
    const {
      isName,
      updateObject,
      updateError,
      popupData,
      updateNote,
      listType,
      pdfHtml,
      isDownloading1,
      isDownloading2,
    } = this.state;
    const { updatingNote } = this.props;
    return (
      <div className="col-md-4">
        <div className="infobx-holder">
          {popupData ? (
            <div className="inner-container">
              {!updateObject.id && (
                <div className={isName ? "chat-header f-p" : "chat-header"}>
                  <div className="toprow">
                    {isName && (
                      <h3>
                        {this.getField("name")} <br />
                        {this.getField("fullNumber")}
                      </h3>
                    )}
                    {!isName && <h3>{this.getField("fullNumber")}</h3>}

                    <div className="profile-drop">
                      <div className="nav-item">
                        <a
                          className="nav-link"
                          id="clockDropdown"
                          role="button"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <img src={dropMenuImage} alt="" className="clock" />
                        </a>
                        <div
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="clockDropdown"
                        >
                          <a
                            className="dropdown-item"
                            onClick={() => this.selectForEdit()}
                          >
                            Edit
                          </a>
                          <a
                            className="dropdown-item"
                            onClick={() => this.onSelectRemoveProfile()}
                          >
                            Delete Profile
                          </a>
                          <div className="dropdown-divider"></div>
                          <a className="dropdown-item">Something else here</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="desprow">
                    {popupData.inQueue && (
                      <p className="time">
                        {this.props.getMomentTime(1, popupData.visitDate)}{" "}
                        <span className="left-margin">
                          ({this.props.getMomentTime(2, popupData.visitDate)})
                        </span>
                        <span>Spot: {this.getField("parkingSpot")}</span>
                      </p>
                    )}
                    {popupData.isCheckIn && (
                      <p className="time">
                        {this.props.getMomentTime(1, popupData.checkIn)}{" "}
                        <span className="left-margin">
                          ({this.props.getMomentTime(2, popupData.checkIn)})
                        </span>
                        <span>Spot: {this.getField("parkingSpot")}</span>
                      </p>
                    )}
                    {popupData.isCheckOut && (
                      <p className="time">
                        {this.props.getMomentTime(1, popupData.checkOut)}{" "}
                        <span className="left-margin">
                          ({this.props.getMomentTime(2, popupData.checkOut)})
                        </span>
                        <span>Spot: {this.getField("parkingSpot")}</span>
                      </p>
                    )}
                  </div>
                  {listType == "waiting" && (
                    <div className="statusbtns toogle-statusbtns">
                      <div className="togglebtn-holder">
                        <div className="btn-holder imgbtn-holder">
                          <label className="switch">
                            <input
                              type="checkbox"
                              name="waitingOrCheckIn"
                              checked={
                                popupData.patientId &&
                                popupData.patientId.carOrLobby &&
                                popupData.patientId.carOrLobby === 1
                                  ? true
                                  : false
                              }
                              value={popupData.patientId.carOrLobby}
                              onChange={(e) => this.handleCarLobbyToggle(e)}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </div>
                      
                    </div>
                  )}
                  {listType === "checkInOut" && (
                    <div className="statusbtns toogle-statusbtns">
                      <div className="movebtns-rgtbx">
                        <div className="btn-holder">
                          <button
                            type="button"
                            name="button"
                            className="btn bluebtn"
                            onClick={() => this.moveBackToWaiting()}
                            disabled={this.props.isBackToWaiting}
                          >
                            <span className="txbx">Move to Queue</span>
                            <span className="icon">
                              {" "}
                              <img src={refreshSVG} alt="" />{" "}
                            </span>
                          </button>
                        </div>
                        <div className="btn-holder">
                          <button
                            type="button"
                            name="button"
                            className="btn greenbtn"
                            onClick={() => this.movePatientToServed()}
                          >
                            <img src={exploreImage} alt="" />
                          </button>
                        </div>
                      </div>
                      
                    </div>
                  )}
                  {listType === "servedSection" && (
                    <div className="statusbtns toogle-statusbtns">
                      
                      <div className="movebtns-rgtbx">
                        <div className="btn-holder">
                          <button
                            type="button"
                            name="button"
                            className="btn bluebtn"
                            onClick={() => this.moveBackToWaiting()}
                            disabled={this.props.isBackToWaiting}
                          >
                            <span className="txbx">Move to Queue</span>
                            <span className="icon">
                              {" "}
                              <img src={refreshSVG} alt="" />{" "}
                            </span>
                          </button>
                        </div>
                        <div className="btn-holder">
                          <button
                            type="button"
                            name="button"
                            className="btn greenbtn"
                            onClick={() => this.movePatientToCheckIn()}
                          >
                            <span className="txbx">Move to Check-in</span>
                            <span className="icon">
                              {" "}
                            <img src={checkInImage} alt="" />{" "}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {updateObject.id && (
                <div className="chat-header f-p">
                  <div className="toprow">
                    <span>
                      <input
                        className={
                          updateError.first_name
                            ? "edit-box error-box"
                            : "edit-box"
                        }
                        name="first_name"
                        value={updateObject.first_name}
                        onChange={(e) => this.handleChange(e)}
                        placeholder="Enter first name"
                      />
                    </span>
                    <span>
                      <input
                        className={
                          updateError.last_name
                            ? "edit-box error-box"
                            : "edit-box"
                        }
                        name="last_name"
                        value={updateObject.last_name}
                        onChange={(e) => this.handleChange(e)}
                        placeholder="Enter last name"
                      />
                    </span>
                    {/* <span><input className={updateError.fullNumber ? 'edit-box error-box' : 'edit-box'} name="fullNumber" value={updateObject.fullNumber} onChange={(e)=>this.handleChange(e)} /></span> */}
                    <div className="divider"></div>
                    <span>
                      <img
                        className="save-edit"
                        src={checkImage}
                        alt=""
                        onClick={() => this.onSubmitUpdate()}
                      />
                      <img
                        className="cancle-edit"
                        src={cancelImage}
                        alt=""
                        onClick={() => this.resetEditData()}
                      />
                    </span>
                  </div>
                </div>
              )}
              <div className="chat-body">
                <div className="atchment_flowwrap">
                  {(listType !== "waiting" ||
                    popupData.is_delay ||
                    popupData.isNotify ||
                    popupData.noShow) && (
                    <div className="tag-pills">
                      <ul>
                        {listType === "waiting" && popupData.is_delay && (
                          <li>
                            <button
                              type="button"
                              name="button"
                              className={popupData.is_delay ? "btn red" : "btn"}
                            >
                              Delayed
                            </button>
                          </li>
                        )}
                        {popupData.noShow && (
                          <li>
                            <button type="button" name="button" className="btn">
                              No Show
                            </button>
                          </li>
                        )}
                        {popupData.isNotify && popupData.countDownFinish && (
                          <li>
                            {popupData.countDownFinish && popupData.isNotify ? (
                              <button
                                type="button"
                                name="button"
                                className="btn"
                              >
                                Notified at{" "}
                                <span>
                                  {this.props.getMomentTime(
                                    1,
                                    popupData.notifyAt
                                  )}
                                </span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                name="button"
                                className="btn"
                              >
                                Notified at <span>xxx</span>{" "}
                              </button>
                            )}
                          </li>
                        )}
                        {listType === "checkInOut" && (
                          <li>
                            <button type="button" name="button" className="btn">
                              With Provider
                            </button>
                          </li>
                        )}
                        {listType === "servedSection" && (
                          <li>
                            <button type="button" name="button" className="btn">
                              Exited
                            </button>
                          </li>
                        )}
                        {(
                          <li>
                            <button type="button" name="button" className="btn">
                              {popupData.isExisting ? 'Existing' : 'New'}
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  <div className="atchment-holder">
                    <label htmlFor="atachment">Attachments:</label>
                    <div className="atchment-body">
                      <ul>
                        {/* <li className="logo-files-extension">
                                                    <img src={filePdfSolidSVG} alt="" />
                                                    <div className="atchmentinfo">Preview</div>
                                                </li> */}
                        {this.props.upload_list &&
                          this.props.upload_list.length > 0 && (
                            <li
                              className="logo-files-extension img-preview"
                              onClick={() => this.openModel()}
                            >
                              <img src={imageSolidSVG} alt="" />
                              <div className="atchmentinfo">Preview</div>
                            </li>
                          )}
                      </ul>
                      <div>
                        {isDownloading1 && (
                          <a className="download-files-btn">
                            <img className="loader" src={loaderGIF} alt="" />
                          </a>
                        )}
                        {isDownloading1 && (
                          <a className="download-files-btn">
                            <img className="loader" src={loaderGIF} alt="" />
                          </a>
                        )}
                        {!isDownloading1 && (
                          <a
                            className="download-files-btn"
                            onClick={() =>
                              this.openPreviewModal(popupData.submissionID, 1)
                            }
                          >
                            Preview Basic Info
                          </a>
                        )}
                        {!isDownloading1 && (
                          <a
                            className="download-files-btn"
                            onClick={() =>
                              this.downloadPdf(popupData.submissionID, 1)
                            }
                          >
                            Download Basic Info
                            <img src={downloadSolidSVG} alt="" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  {popupData.subPatientData && popupData.subPatientData.length && <div className="subPatient atchment-holder">
                    <label htmlFor="atachment">Sub Patient Attachments:</label>
                    <div className="atchment-body">
                    {popupData.subPatientData.map((value, index) => (
                      <div>
                        {isDownloading1 && (
                          <a className="download-files-btn">
                            <img className="loader" src={loaderGIF} alt="" />
                          </a>
                        )}
                        {isDownloading1 && (
                          <a className="download-files-btn">
                            <img className="loader" src={loaderGIF} alt="" />
                          </a>
                        )}
                        {!isDownloading1 && (
                          <a
                            className="download-files-btn"
                            onClick={() =>
                              this.openPreviewModal(value.submissionID, 1)
                            }
                          >
                            Preview for {value.first_name} 
                          </a>
                        )}
                        {!isDownloading1 && (
                          <a
                            className="download-files-btn"
                            onClick={() =>
                              this.downloadPdf(value.submissionID, 1)
                            }
                          >
                            Download {value.first_name} info
                            <img src={downloadSolidSVG} alt="" />
                          </a>
                        )}
                      </div>
                    
                    ))}
                    </div>
                  </div>}
                  <div className="notes-holder">
                    <label htmlFor="atachment">Reason for visit: </label>
                    <textarea
                      name="name"
                      rows="6"
                      cols=""
                      value={updateNote.note}
                      className="form-control"
                      onChange={(e) => this.handleNoteChange(e)}
                    ></textarea>
                    <span className="save">
                      <button
                        type="button"
                        name="button"
                        className="btn"
                        onClick={() => this.handleNoteSubmit()}
                        disabled={updateNote.isNotesError || updatingNote}
                      >
                        <img src={sendImage} alt="" />
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="txt-center">Loading.....</div>
          )}
        </div>
        <Modal
          show={this.state.isModelShow}
          onHide={() => this.hideModal()}
          onEntered={() => this.modalLoaded()}
          dialogClassName={"modal-dialog-centered image-slider-section"}
          contentClassName={"delete-modal-content"}
        >
          <div className="modal-header">
            <button
              type="button"
              className="close"
              onClick={() => this.hideModal()}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Carousel
              autoPlay={false}
              autoFocus={true}
              infiniteLoop={true}
              //onClickItem={(e)=> this.downloadOuterImage(e)}
              onClickThumb={(e) => this.downloadImage(e)}
              dynamicHeight={false}
            >
              {this.props.upload_list &&
                this.props.upload_list.map((value, index) => (
                  <div key={"i_" + index}>
                    {/* onMouseOver={() => this.OnHoverZoomImage(value,true)}
                    <img src={value} alt={index + "images"}  /> 
                    */}
                    <Zoom img={value} zoomScale={2} width={600} height={320} />
                    <p
                      onClick={() => this.downloadImageOnClick(index)}
                      className="legend"
                      style={{bottom: "140px"}}
                    >
                      PNG
                    </p>
                    <p
                      onClick={() => this.downloadImageOnClick(index, 'jpg')}
                      className="legend"
                      style={{bottom: "90px"}}
                    >
                      JPG
                    </p>
                    <p
                      onClick={() => this.downloadImageOnClick(index, 'bmp')}
                      className="legend"
                    >
                      BMP
                    </p>
                  </div>
                ))}
            </Carousel>
            <div className="download-all">
              <button
                className="btn-download-all mx-1"
                disabled={this.state.isDownloadAll}
                onClick={() => this.downloadAllImages()}
              >
                {this.state.isDownloadAll && <img className="loader download-all-loader" src={loaderGIF} alt="" />}
                {!this.state.isDownloadAll && <span><img src={exportSVG} alt="" /> All PNG</span>}
              </button>
              <button
                className="btn-download-all mx-1"
                disabled={this.state.isDownloadAll}
                onClick={() => this.downloadAllImages('jpg')}
              >
                {this.state.isDownloadAll && <img className="loader download-all-loader" src={loaderGIF} alt="" />}
                {!this.state.isDownloadAll && <span><img src={exportSVG} alt="" /> All JPG</span>}
              </button>
              <button
                className="btn-download-all mx-1"
                disabled={this.state.isDownloadAll}
                onClick={() => this.downloadAllImages('bmp')}
              >
                {this.state.isDownloadAll && <img className="loader download-all-loader" src={loaderGIF} alt="" />}
                {!this.state.isDownloadAll && <span><img src={exportSVG} alt="" /> All BMP</span>}
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          show={this.state.isPreviewModelShow}
          onHide={() => this.hidePreviewModal()}
          dialogClassName={"modal-dialog-preview"}
          contentClassName={"preview-modal-content"}
        >
          <div className="modal-header">
            <button
              type="button"
              className="close"
              onClick={() => this.hidePreviewModal()}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body" dangerouslySetInnerHTML={{__html: pdfHtml}}>
          </div>
        </Modal>
        <Modal
          show={this.state.isZoomModelShow}
          onHide={() => this.hideZoomModal()}
          dialogClassName={"modal-dialog-zoom"}
          contentClassName={"zoom-modal-content"}
        >
          <div className="modal-header">
            <button
              type="button"
              className="close"
              onClick={() => this.hideZoomModal()}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div
            className="modal-body"
            onMouseOut={
              () => {} /*this.OnHoverZoomImage(this.state.zoomImage,false) */
            }
          >
            <img src={this.state.zoomImage} alt="images" />
          </div>
        </Modal>
      </div>
    );
  }
}

function mapState(state) {
  const { commons } = state;
  const {
    updatingNote,
    isBackToWaiting,
    fetching_uploads,
    isfetchUploadComplete,
    upload_list,
  } = commons;
  return {
    updatingNote,
    isBackToWaiting,
    fetching_uploads,
    isfetchUploadComplete,
    upload_list,
  };
}

const actionCreators = {
  updatePatientProfile: commonActions.updatePatientProfile,
  noShowSet: commonActions.noShowSet,
  updateDelayForPatient: commonActions.updateDelayForPatient,
  updateNotesForPatient: commonActions.updateNotesForPatient,
  resetWaiting: commonActions.resetWaiting,
  updateCarLobby: commonActions.updateCarLobby,
  fetchFormUploads: commonActions.fetchFormUploads,
};

const connectedChatInformation = connect(
  mapState,
  actionCreators
)(ChatInformation);
export { connectedChatInformation as ChatInformation };
