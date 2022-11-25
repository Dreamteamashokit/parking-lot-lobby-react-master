import React from 'react';
import { connect } from 'react-redux';
import Modal from "react-bootstrap/Modal";
import Moment from 'react-moment';
import moment from 'moment';
import { errorToast } from '../_helpers';
import { userActions } from '../_actions';

class MembershipPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddCardOpen: false,
      isPayOpen: false,
      card: {
        name: '',
        number: '',
        exp_month: '',
        exp_year: '',
        cvc: '',
      },
    };
  }
  expYears = Array(21).fill((new Date()).getFullYear()).map((v, i) => v + i);
  componentDidMount() {
    this.props.getPlan();
    this.props.fetchCards();
  }
  async handleChange(event) {
    try {
      let { name, value } = event.target;
      let { card, errors } = this.state;
      // const updatedErrors = validateFields(name, value, errors[formType]);
      // errors[formType] = updatedErrors;
      card = { ...card, [name]: value };
      this.setState({
        card,
        errors
      });
    } catch (e) {
      let message = e.message || 'Something went wrong in handleChange';
      errorToast(message)
    }

  }
  handleSubmit = async (e) => {
    try {
      e.preventDefault();
      this.setState({ isAddCardOpen: false })
      const { card } = this.state;
      let payload = JSON.parse(JSON.stringify(card));
      this.props.updateCard(payload);
    } catch (error) {
      console.log('\n error.handleSubmit :', error.message || error);
      let message = error.message || 'Something went wrong in handleSubmit';
      errorToast(message)
    }
  }
  handleAddCard = async (e) => {
    try {
      e.preventDefault();
      const { card } = this.state;
      let payload = JSON.parse(JSON.stringify(card));
      this.props.updateCard(payload);
    } catch (error) {
      let message = error.message || 'Something went wrong in handleSubmit';
      errorToast(message)
    }
  }
  handlePay = async (source) => {
    try {
      this.setState({ isPayOpen: false })
      this.props.payMembership({ source })
    } catch (error) {
      let message = error.message || 'Something went wrong in handleSubmit';
      errorToast(message)
    }
  }
  openAddCard = async (e) => {
    this.setState({ isAddCardOpen: true })
  }
  filterNumber = (event) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }
  render() {
    const { isUpdating, plan, cards } = this.props;
    const { card } = this.state;
    return (
      <section className='settings-contbx-wrap'>
        <div className='container'>
          <div className="row">
            <div className='col-6' style={{ fontSize: '22px' }}>
              <b>Plan:</b> {plan?.plan} Months <br />
              <b>Amount:</b> {plan?.amount} USD <br />
              <b>Validity:</b> {plan?.validity && plan?.isActive ? <Moment format="ll" >{plan?.validity}</Moment> : 'Not Available'}<br />
              <div className="subrgtbtn-holder">
                <div className="submitbtn-holder">
                  {plan?.isActive === false && <button className="btn" type="button" id="submitButton" name="button" onClick={() => this.setState({ isPayOpen: true })}>
                    Pay ${plan?.amount}
                  </button>}
                </div>
              </div>
            </div>
            <div className='col-6'>
              <div className='d-flex justify-content-between'>
                <h4>Saved Cards</h4>
                <button className='btn btn-primary' onClick={this.openAddCard}>Add</button>
              </div>
              {
                cards.map(c =>
                (
                  <div key={c.id} className='py-3'>
                    <b>{c.brand}</b> **** **** {c?.last4}<br />
                    {c?.exp_month}/{c?.exp_year} <br />
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <Modal
          onHide={() => this.setState({ isAddCardOpen: false })}
          show={this.state.isAddCardOpen}
          dialogClassName={"modal-dialog-centered"}
        >
          <div className="modal-header">
            <button
              type="button"
              className="close"
              onClick={() => this.setState({ isAddCardOpen: false })}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form className='row' onSubmit={this.handleAddCard}>
              <div className="col-12">
                <div className="form-group">
                  <input type="text" minLength="16" maxlength="16" required onKeyPress={this.filterNumber} name="number" value={card.number} className="form-control" placeholder="Card Number" onChange={(e) => this.handleChange(e)} />
                </div>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <select className='form-control' value={card.exp_month} name="exp_month" onChange={(e) => this.handleChange(e)} required>
                    <option hidden value="">Month</option>
                    <option value="1">Jan</option>
                    <option value="2">Feb</option>
                    <option value="3">Mar</option>
                    <option value="4">Apr</option>
                    <option value="5">May</option>
                    <option value="6">Jun</option>
                    <option value="7">Jul</option>
                    <option value="8">Aug</option>
                    <option value="9">Sep</option>
                    <option value="10">Oct</option>
                    <option value="11">Nov</option>
                    <option value="12">Dec</option>
                  </select>
                </div>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <select className='form-control' id="expMonth" value={card.exp_year} name="exp_year" onChange={(e) => this.handleChange(e)} required>
                    <option hidden value="">Year</option>
                    {
                      this.expYears.map(y => <option key={y} value={y}>{y}</option>)
                    }
                  </select>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <input onKeyPress={this.filterNumber} maxlength="3" minlength="3" type="text" name="cvc" value={card.cvc} className="form-control" placeholder="CVV/CVC" onChange={(e) => this.handleChange(e)} required />
                </div>
              </div>
              <div className="modal-footer col-12">
                <button
                  type="submit"
                  className="btn bluebtn"
                >
                  Submit Now
                </button>
              </div>
            </form>
          </div>
        </Modal>
        <Modal
          onHide={() => this.setState({ isPayOpen: false })}
          show={this.state.isPayOpen}
          dialogClassName={"modal-dialog-centered"}
        >
          <div className="modal-header">
            Pay with
            <button
              type="button"
              className="close"
              onClick={() => this.setState({ isPayOpen: false })}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {
              cards.map(c =>
              (
                <div key={c.id} className='p-3 my-2' style={{ border: '1px solid gray' }} role="button" onClick={() => this.handlePay(c.id)}>
                  <div className='d-flex justify-content-between'>
                    <span className='text-capitalize'>{c.funding} {c.object}</span>
                    <span>**** {c?.last4}</span>
                  </div>
                  <div className='d-flex justify-content-between'>
                    <span><b>{c.brand}</b></span>
                    <span>{c?.exp_month}/{c?.exp_year}</span>
                  </div>
                </div>
              ))
            }
          </div>
        </Modal>
      </section>)
  }
}

function mapState(state) {
  const { plan, cards } = state.plan
  return { plan, cards }
}

const actionCreators = {
  updateCard: userActions.updateCard,
  getPlan: userActions.getPlan,
  fetchCards: userActions.fetchCards,
  payMembership: userActions.payMembership,
}

export default connect(mapState, actionCreators)(MembershipPage);