import React from "react";
import { connect } from "react-redux";
import "../../_assets/css/sass/visitor-review.scss";
import "react-phone-number-input/style.css";
import { default as dropdownSMSVG } from "../../_assets/images/dropdown-sm.svg";
import { default as accessProfileSVG } from "../../_assets/images/access-profile.svg";
import Modal from "react-bootstrap/Modal";
import { adminActions } from "../../_actions";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { errorToast } from "../../_helpers";

const MySwal = withReactContent(Swal)

class ClientJotform extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formId: '',
            selectedQuestion: '',
            isAddJotformQuestionOpen: false,
            question: {
                name: "",
                text: "",
                type: "",
                order: "",
                description: "",
                required: "NO",
                hidden: "NO",
                readonly: "NO",
                protected: "NO",
            },
            errors: {
                name: false,
                text: false,
                type: false,
                order: false,
                description: false,
                required: false,
                hidden: false,
                readonly: false,
                protected: false,
            },
            controls: [
                {
                    id: 'control_textbox',
                    name: 'Textbox',
                },
                {
                    id: 'control_textarea',
                    name: 'Textarea',
                },
                {
                    id: 'control_number',
                    name: 'Number',
                },
                {
                    id: 'control_radio',
                    name: 'Radio',
                },
                {
                    id: 'control_dropdown',
                    name: 'Dropdown',
                },
                {
                    id: 'control_checkbox',
                    name: 'Checkbox',
                },
                {
                    id: 'control_fileupload',
                    name: 'File',
                },
                {
                    id: 'control_fullname',
                    name: 'Full Name',
                },
                {
                    id: 'control_email',
                    name: 'Email',
                },
                {
                    id: 'control_datetime',
                    name: 'Datetime',
                },
                {
                    id: 'control_widget',
                    name: 'Widget',
                },
                {
                    id: 'control_yesno',
                    name: 'Yes/No',
                },
                {
                    id: 'control_signature',
                    name: 'Signature',
                },
                {
                    id: 'control_head',
                    name: 'Head',
                },
                {
                    id: 'control_mixed',
                    name: 'Mixed',
                },
            ]
        };
    }

    componentDidMount() {
        const { question } = this.state;
        const href = window.location.href;
        const formId = href.substring(href.lastIndexOf("/") + 1);
        this.setState({ question, formId });
        this.props.fetchJotformQuestions(formId);
    }

    handleChange = async (event) => {
        try {
            const { name, value } = event.target;
            const { question, errors } = this.state;
            errors[name] = false;
            if (!value) {
                errors.name = true;
            }
            this.setState({
                errors,
                question: {
                    ...question,
                    [name]: value,
                },
            });
        } catch (err) {
            console.log("\n error handleChange:", err.message || err);
            let message = err && err.message ? err.message : "Something went wrong";
            errorToast(message);
        }
    };
    convertType(val) {
        const { controls } = this.state;
        return controls.find(el => el.id === val)?.name || val;
    }
    addNewJotformQuestion = async () => {
        try {
            const { selectedQuestion, question, errors, formId } = this.state;
            if (errors.name || errors.text) {
                return;
            }
            if (!question.name || question.name == "") {
                errors.name = true;
                this.setState({ errors });
                return;
            }
            if (!question.text || question.text == "") {
                errors.text = true;
                this.setState({ errors });
                return;
            }
            if (!question.order || question.order == "") {
                errors.order = true;
                this.setState({ errors });
                return;
            }
            if (!question.type || question.type == "") {
                errors.type = true;
                this.setState({ errors });
                return;
            }
            await this.props.addJotformQuestion(formId, { qid: selectedQuestion, ...question });
            this.setState({
                isAddJotformQuestionOpen: false,
                question: {
                    name: "",
                    text: "",
                    type: "",
                    order: "",
                },
                errors: {
                    name: false,
                    text: false,
                    type: false,
                    order: false,
                },
            });
            this.props.fetchJotformQuestions(this.state.formId);
        } catch (err) {
            let message = err && err.message ? err.message : "Something went wrong";
            errorToast(message);
        }
    };
    editQuestion(ques = null) {
        this.setState({
            isAddJotformQuestionOpen: true,
            selectedQuestion: ques?.qid,
            question: {
                name: ques?.name,
                text: ques?.text,
                order: ques?.order,
                type: ques?.type,
                description: ques?.description,
                required: ques?.required,
                hidden: ques?.hidden,
                readonly: ques?.readonly,
                protected: ques?.protected,
            }
        })
    }
    deleteQuestion(qid) {
        const { formId } = this.state;
        const that = this;
        MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            confirmButtonClass: 'btn btn-danger mx-1',
            cancelButtonClass: 'btn btn-outline-danger mx-1',
            buttonsStyling: false
        }).then(function () {
            that.props.deleteJotformQuestion(formId, qid)
            that.props.fetchJotformQuestions(that.state.formId);
        })
    }
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
            }
            this.props.fetchJotformQuestions(this.state.formId);
        } catch (err) {
            let message = err && err.message ? err.message : "Something went wrong";
            console.log("\n message:", message);
            errorToast(message);
        }
    }
    render() {
        const { question, errors, controls, selectedQuestion } = this.state;
        const {
            fetchingjotformQuestions,
            jotformQuestions,
            isJotformQuestionRegistering,
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
                                                this.editQuestion();
                                                this.props.resetLocation();
                                            }}
                                        >
                                            Add Question
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="back-to-previous">
                                        <Link to="/admin/jotform-list">Back To Previous Page</Link>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="headingbx">
                                        <div className="headcontbx">
                                            <h1>Jotform Questions:</h1>
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
                                                <th className="name" key="qid">
                                                    ID
                                                </th>
                                                <th className="name" key="order">
                                                    Order
                                                </th>
                                                <th className="ratings" key="type">
                                                    Type
                                                </th>
                                                <th className="actions" key="action">
                                                    {" "}
                                                    &nbsp;{" "}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jotformQuestions && jotformQuestions.length > 0 ? (
                                                jotformQuestions.map((value, index) => (
                                                    <tr key={index}>
                                                        <td className="name" key="nameValue_{index}">
                                                            <div className="name-inner">
                                                                <h3>{value.name}</h3>
                                                            </div>
                                                        </td>
                                                        <td className="name" key="qidValue_{index}">
                                                            <div className="name-inner">
                                                                <h3>{value.qid}</h3>
                                                            </div>
                                                        </td>
                                                        <td className="name" key="orderValue_{index}">
                                                            <div className="name-inner">
                                                                <h3>{value.order}</h3>
                                                            </div>
                                                        </td>
                                                        <td className="name" key="typeValue_{index}">
                                                            <div className="name-inner">
                                                                <h3>{this.convertType(value.type)}</h3>
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
                                                                                            onClick={() => {
                                                                                                this.editQuestion(value);
                                                                                                this.props.resetLocation();
                                                                                            }}
                                                                                        >
                                                                                            <span className="icon">
                                                                                                {" "}
                                                                                                <img
                                                                                                    src={accessProfileSVG}
                                                                                                    alt=""
                                                                                                />{" "}
                                                                                            </span>
                                                                                            <span className="txbx">
                                                                                                Edit
                                                                                            </span>
                                                                                        </a>
                                                                                    </li>
                                                                                    <li key="_sub2_{index}">
                                                                                        <a
                                                                                            className="btn"
                                                                                            onClick={() => {
                                                                                                this.deleteQuestion(value.qid);
                                                                                                this.props.resetLocation();
                                                                                            }}
                                                                                        >
                                                                                            <span className="icon">
                                                                                                {" "}
                                                                                                <img
                                                                                                    src={accessProfileSVG}
                                                                                                    alt=""
                                                                                                />{" "}
                                                                                            </span>
                                                                                            <span className="txbx">
                                                                                                Delete
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
                                                    {fetchingjotformQuestions && (
                                                        <td
                                                            key="loading"
                                                            className="text-center"
                                                            colSpan="6"
                                                        >
                                                            <h3>Loading....</h3>
                                                        </td>
                                                    )}
                                                    {!fetchingjotformQuestions && (
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
                    onHide={() => this.setState({ isAddJotformQuestionOpen: false })}
                    show={this.state.isAddJotformQuestionOpen}
                    dialogClassName={"modal-dialog-centered"}
                    contentClassName={"delete-modal-content"}
                >
                    <div className="modal-header">
                        <button
                            type="button"
                            className="close"
                            onClick={() => this.setState({ isAddJotformQuestionOpen: false })}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="form-holder add-location" style={{ margin: 0 }}>
                        <form className="form" action="" method="post">
                            <div className="modal-body">
                                <div className="row">
                                    <div className="form-group col-md-12">
                                        <label htmlFor="practice-name" className="location-label">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={question.name}
                                            className={
                                                errors.name ? "form-control error-box" : "form-control"
                                            }
                                            placeholder="Slug of question label"
                                            onChange={(e) => this.handleChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-md-12">
                                        <label htmlFor="practice-name" className="location-label">
                                            Text
                                        </label>
                                        <input
                                            type="text"
                                            name="text"
                                            value={question.text}
                                            className={
                                                errors.text ? "form-control error-box" : "form-control"
                                            }
                                            placeholder="Label of your question"
                                            onChange={(e) => this.handleChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-md-12">
                                        <label htmlFor="practice-name" className="location-label">
                                            Order
                                        </label>
                                        <input
                                            type="number"
                                            name="order"
                                            value={question.order}
                                            className={
                                                errors.order ? "form-control error-box" : "form-control"
                                            }
                                            placeholder="Order defines the location of the question in the form."
                                            onChange={(e) => this.handleChange(e)}
                                        />
                                    </div>
                                </div>
                                {!selectedQuestion ?
                                    <div className="row">
                                        <div className="form-group col-md-12">
                                            <label htmlFor="practice-name" className="location-label">
                                                Type
                                            </label>
                                            <select
                                                name="type"
                                                value={question.type}
                                                className={
                                                    errors.type ? "form-control error-box" : "form-control"
                                                }
                                                placeholder="Question field type"
                                                onChange={(e) => this.handleChange(e)}
                                            >
                                                <option value="" hidden>Question field type</option>
                                                {controls.map(control => (
                                                    <option key={control.id} value={control.id}>{control.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    :
                                    ""
                                }
                                <div className="row">
                                    <div className="form-group col-md-12">
                                        <label htmlFor="practice-name" className="location-label">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={question.description}
                                            className={
                                                errors.description ? "form-control error-box" : "form-control"
                                            }
                                            placeholder="Description of question"
                                            onChange={(e) => this.handleChange(e)}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="row pt-2">
                                    <div className="form-group col-6">
                                        <label htmlFor="practice-name" className="location-label">
                                            Required
                                        </label>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="required" id="inlineRadio1" value="Yes" checked={question.required === 'Yes'} onChange={(e) => this.handleChange(e)} />
                                            <label class="form-check-label" for="inlineRadio1">Yes</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="required" id="inlineRadio2" value="No" checked={question.required === 'No'} onChange={(e) => this.handleChange(e)} />
                                            <label class="form-check-label" for="inlineRadio2">No</label>
                                        </div>
                                        {/* <input
                                            type="number"
                                            name="order"
                                            value={question.order}
                                            className={
                                                errors.order ? "form-control error-box" : "form-control"
                                            }
                                            placeholder="Order defines the location of the question in the form."
                                            onChange={(e) => this.handleChange(e)}
                                        /> */}
                                    </div>
                                    <div className="form-group col-6">
                                        <label htmlFor="practice-name" className="location-label">
                                            Hidden
                                        </label>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="hidden" id="inlineRadio3" value="Yes" checked={question.hidden === 'Yes'} onChange={(e) => this.handleChange(e)} />
                                            <label class="form-check-label" for="inlineRadio3">Yes</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="hidden" id="inlineRadio4" value="No" checked={question.hidden === 'No'} onChange={(e) => this.handleChange(e)} />
                                            <label class="form-check-label" for="inlineRadio4">No</label>
                                        </div>
                                    </div>
                                    <div className="form-group col-6">
                                        <label htmlFor="practice-name" className="location-label">
                                            Readonly
                                        </label>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="readonly" id="inlineRadio5" value="Yes" checked={question.readonly === 'Yes'} onChange={(e) => this.handleChange(e)} />
                                            <label class="form-check-label" for="inlineRadio5">Yes</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="readonly" id="inlineRadio6" value="No" checked={question.readonly === 'No'} onChange={(e) => this.handleChange(e)} />
                                            <label class="form-check-label" for="inlineRadio6">No</label>
                                        </div>
                                    </div>
                                    <div className="form-group col-6">
                                        <label htmlFor="practice-name" className="location-label">
                                            Protected
                                        </label>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="protected" id="inlineRadio7" value="Yes" checked={question.protected === 'Yes'} onChange={(e) => this.handleChange(e)} />
                                            <label class="form-check-label" for="inlineRadio7">Yes</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="protected" id="inlineRadio8" value="No" checked={question.protected === 'No'} onChange={(e) => this.handleChange(e)} />
                                            <label class="form-check-label" for="inlineRadio8">No</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    onClick={() => this.addNewJotformQuestion()}
                                    disabled={isJotformQuestionRegistering}
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
        jotformQuestions,
        fetchingJotformList,
    } = state.adminJotformQuestions;
    return {
        jotformQuestions,
        fetchingJotformList,
    };
}

const actionCreators = {
    fetchJotformQuestions: adminActions.fetchJotformQuestions,
    addJotformQuestion: adminActions.addJotformQuestion,
    deleteJotformQuestion: adminActions.deleteJotformQuestion,
    resetLocation: adminActions.resetLocation,
};

export default connect(mapState, actionCreators)(ClientJotform);
