import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

class Countdown extends React.Component {
    constructor(props) {
      super(props);
        this.state = { time: {}, seconds: 0 };
        this.timer = 0;
        this.countDown = this.countDown.bind(this);
    }

    UNSAFE_componentWillReceiveProps(props) {
      const { notifyMinutes } = this.props;
      if (props.notifyMinutes !== notifyMinutes) {
        this.timer= 0;
        this.startTimer(props.notifyMinutes)
      } 
    }

    secondsToTime(secs){
        let hours = Math.floor(secs / (60 * 60));
    
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
        minutes = (minutes <10) ? `0${minutes}` : minutes;
    
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);
        seconds = (seconds <10) ? `0${seconds}` : seconds;
        let obj = {
          "h": hours,
          "m": minutes,
          "s": seconds
        };
        return obj;
      }
    
      componentDidMount() {
        let {notifyMinutes} = this.props;
        if(!notifyMinutes) { 
            notifyMinutes=moment();
        }
        this.startTimer(notifyMinutes)
      }
      startTimer(notifyMinutes) {
        var expiryDate = moment(notifyMinutes);
        var currentDate = moment(new Date());
        var difference = moment.duration(expiryDate.diff(currentDate));
        let calculatedDifference = (parseInt(difference.asSeconds())>0) ? parseInt(difference.asSeconds()):0;
        this.setState({seconds: calculatedDifference},()=> {
            let timeLeftVar = this.secondsToTime(this.state.seconds);
            this.setState({ time: timeLeftVar });
            if (this.timer == 0 && this.state.seconds > 0) {
                this.timer = setInterval(this.countDown, 1000);
            } else {
              this.props.onFinishCountDown(this.props.patientIndex);
            }
        })
      }
    
      countDown() {
        // Remove one second, set state so a re-render happens.
        let seconds = (this.state.seconds > 0) ? this.state.seconds - 1 : this.state.seconds ;
        this.setState({
          time: this.secondsToTime(seconds),
          seconds: seconds,
        });
        
        // Check if we're at zero.
        if (seconds == 0) {
          this.props.onFinishCountDown(this.props.patientIndex);
          clearInterval(this.timer);
        }
      }
    

    render() {
        return(<div>{this.state.time.m}: {this.state.time.s}</div>)
    }
}

function mapState(state) {
    return {}
}

const actionCreators = {}

const connectedCountdown = connect(mapState, actionCreators)(Countdown);
export { connectedCountdown as Countdown };

