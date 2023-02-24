import React, { useState, useEffect } from 'react';
import config from 'config';
import swal from "sweetalert2";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import moment from 'moment';
import "./appointment.css";
import {logoImage} from '../_assets';
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from 'react-router';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import {authHeader} from "../_helpers";
import {CommonApiEndpoint} from "../_constants";
import { commonService } from "../_services";
import {setHours, setMinutes} from "date-fns";
import { MdOutlineApartment, MdOutlinePlace, MdCalendarToday, MdFolderShared, MdPerson, MdMobileScreenShare } from 'react-icons/md';

function appointment() {
  const { locationId } = useParams();
  const [value, setValue] = useState()
  const dobMax = moment().subtract(2, "days").format("YYYY-MM-DD");
  const appointmentMin = moment().format("YYYY-MM-DD hh:mm");
  const [mobileNumberSubmitted, setMobileNumberSubmitted] = useState(false);
  const [businessInformation, setBusinessInformation] = useState({});
  const [appointmentDetails, setappointmentDetails] = useState({appointmentDate: appointmentMin});
  const [checkValidationForMobileSec, setValidationForMobileSec] = useState(false);
  const [checkValidation, setValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailSection, setDetailSection] = useState(true);
  const [countryCode, setCountryCode] = useState('1');
  const [appointmentTiming, setAppointmentTiming] = useState({});
  const countryCodeArray = [{"country":"Afghanistan","code":"93","iso":"AF"},
  {"country":"Albania","code":"355","iso":"AL"},
  {"country":"Algeria","code":"213","iso":"DZ"},
  {"country":"American Samoa","code":"1-684","iso":"AS"},
  {"country":"Andorra","code":"376","iso":"AD"},
  {"country":"Angola","code":"244","iso":"AO"},
  {"country":"Anguilla","code":"1-264","iso":"AI"},
  {"country":"Antarctica","code":"672","iso":"AQ"},
  {"country":"Antigua and Barbuda","code":"1-268","iso":"AG"},
  {"country":"Argentina","code":"54","iso":"AR"},
  {"country":"Armenia","code":"374","iso":"AM"},
  {"country":"Aruba","code":"297","iso":"AW"},
  {"country":"Australia","code":"61","iso":"AU"},
  {"country":"Austria","code":"43","iso":"AT"},
  {"country":"Azerbaijan","code":"994","iso":"AZ"},
  {"country":"Bahamas","code":"1-242","iso":"BS"},
  {"country":"Bahrain","code":"973","iso":"BH"},
  {"country":"Bangladesh","code":"880","iso":"BD"},
  {"country":"Barbados","code":"1-246","iso":"BB"},
  {"country":"Belarus","code":"375","iso":"BY"},
  {"country":"Belgium","code":"32","iso":"BE"},
  {"country":"Belize","code":"501","iso":"BZ"},
  {"country":"Benin","code":"229","iso":"BJ"},
  {"country":"Bermuda","code":"1-441","iso":"BM"},
  {"country":"Bhutan","code":"975","iso":"BT"},
  {"country":"Bolivia","code":"591","iso":"BO"},
  {"country":"Bosnia and Herzegovina","code":"387","iso":"BA"},
  {"country":"Botswana","code":"267","iso":"BW"},
  {"country":"Brazil","code":"55","iso":"BR"},
  {"country":"British Indian Ocean Territory","code":"246","iso":"IO"},
  {"country":"British Virgin Islands","code":"1-284","iso":"VG"},
  {"country":"Brunei","code":"673","iso":"BN"},
  {"country":"Bulgaria","code":"359","iso":"BG"},
  {"country":"Burkina Faso","code":"226","iso":"BF"},
  {"country":"Burundi","code":"257","iso":"BI"},
  {"country":"Cambodia","code":"855","iso":"KH"},
  {"country":"Cameroon","code":"237","iso":"CM"},
  {"country":"Canada","code":"01","iso":"CA"},
  {"country":"Cape Verde","code":"238","iso":"CV"},
  {"country":"Cayman Islands","code":"1-345","iso":"KY"},
  {"country":"Central African Republic","code":"236","iso":"CF"},
  {"country":"Chad","code":"235","iso":"TD"},
  {"country":"Chile","code":"56","iso":"CL"},
  {"country":"China","code":"86","iso":"CN"},
  {"country":"Christmas Island","code":"61","iso":"CX"},
  {"country":"Cocos Islands","code":"61","iso":"CC"},
  {"country":"Colombia","code":"57","iso":"CO"},
  {"country":"Comoros","code":"269","iso":"KM"},
  {"country":"Cook Islands","code":"682","iso":"CK"},
  {"country":"Costa Rica","code":"506","iso":"CR"},
  {"country":"Croatia","code":"385","iso":"HR"},
  {"country":"Cuba","code":"53","iso":"CU"},
  {"country":"Curacao","code":"599","iso":"CW"},
  {"country":"Cyprus","code":"357","iso":"CY"},
  {"country":"Czech Republic","code":"420","iso":"CZ"},
  {"country":"Democratic Republic of the Congo","code":"243","iso":"CD"},
  {"country":"Denmark","code":"45","iso":"DK"},
  {"country":"Djibouti","code":"253","iso":"DJ"},
  {"country":"Dominica","code":"1-767","iso":"DM"},
  {"country":"Dominican Republic","code":"1-809, 1-829, 1-849","iso":"DO"},
  {"country":"East Timor","code":"670","iso":"TL"},
  {"country":"Ecuador","code":"593","iso":"EC"},
  {"country":"Egypt","code":"20","iso":"EG"},
  {"country":"El Salvador","code":"503","iso":"SV"},
  {"country":"Equatorial Guinea","code":"240","iso":"GQ"},
  {"country":"Eritrea","code":"291","iso":"ER"},
  {"country":"Estonia","code":"372","iso":"EE"},
  {"country":"Ethiopia","code":"251","iso":"ET"},
  {"country":"Falkland Islands","code":"500","iso":"FK"},
  {"country":"Faroe Islands","code":"298","iso":"FO"},
  {"country":"Fiji","code":"679","iso":"FJ"},
  {"country":"Finland","code":"358","iso":"FI"},
  {"country":"France","code":"33","iso":"FR"},
  {"country":"French Polynesia","code":"689","iso":"PF"},
  {"country":"Gabon","code":"241","iso":"GA"},
  {"country":"Gambia","code":"220","iso":"GM"},
  {"country":"Georgia","code":"995","iso":"GE"},
  {"country":"Germany","code":"49","iso":"DE"},
  {"country":"Ghana","code":"233","iso":"GH"},
  {"country":"Gibraltar","code":"350","iso":"GI"},
  {"country":"Greece","code":"30","iso":"GR"},
  {"country":"Greenland","code":"299","iso":"GL"},
  {"country":"Grenada","code":"1-473","iso":"GD"},
  {"country":"Guam","code":"1-671","iso":"GU"},
  {"country":"Guatemala","code":"502","iso":"GT"},
  {"country":"Guernsey","code":"44-1481","iso":"GG"},
  {"country":"Guinea","code":"224","iso":"GN"},
  {"country":"Guinea-Bissau","code":"245","iso":"GW"},
  {"country":"Guyana","code":"592","iso":"GY"},
  {"country":"Haiti","code":"509","iso":"HT"},
  {"country":"Honduras","code":"504","iso":"HN"},
  {"country":"Hong Kong","code":"852","iso":"HK"},
  {"country":"Hungary","code":"36","iso":"HU"},
  {"country":"Iceland","code":"354","iso":"IS"},
  {"country":"India","code":"91","iso":"IN"},
  {"country":"Indonesia","code":"62","iso":"ID"},
  {"country":"Iran","code":"98","iso":"IR"},
  {"country":"Iraq","code":"964","iso":"IQ"},
  {"country":"Ireland","code":"353","iso":"IE"},
  {"country":"Isle of Man","code":"44-1624","iso":"IM"},
  {"country":"Israel","code":"972","iso":"IL"},
  {"country":"Italy","code":"39","iso":"IT"},
  {"country":"Ivory Coast","code":"225","iso":"CI"},
  {"country":"Jamaica","code":"1-876","iso":"JM"},
  {"country":"Japan","code":"81","iso":"JP"},
  {"country":"Jersey","code":"44-1534","iso":"JE"},
  {"country":"Jordan","code":"962","iso":"JO"},
  {"country":"Kazakhstan","code":"7","iso":"KZ"},
  {"country":"Kenya","code":"254","iso":"KE"},
  {"country":"Kiribati","code":"686","iso":"KI"},
  {"country":"Kosovo","code":"383","iso":"XK"},
  {"country":"Kuwait","code":"965","iso":"KW"},
  {"country":"Kyrgyzstan","code":"996","iso":"KG"},
  {"country":"Laos","code":"856","iso":"LA"},
  {"country":"Latvia","code":"371","iso":"LV"},
  {"country":"Lebanon","code":"961","iso":"LB"},
  {"country":"Lesotho","code":"266","iso":"LS"},
  {"country":"Liberia","code":"231","iso":"LR"},
  {"country":"Libya","code":"218","iso":"LY"},
  {"country":"Liechtenstein","code":"423","iso":"LI"},
  {"country":"Lithuania","code":"370","iso":"LT"},
  {"country":"Luxembourg","code":"352","iso":"LU"},
  {"country":"Macao","code":"853","iso":"MO"},
  {"country":"Macedonia","code":"389","iso":"MK"},
  {"country":"Madagascar","code":"261","iso":"MG"},
  {"country":"Malawi","code":"265","iso":"MW"},
  {"country":"Malaysia","code":"60","iso":"MY"},
  {"country":"Maldives","code":"960","iso":"MV"},
  {"country":"Mali","code":"223","iso":"ML"},
  {"country":"Malta","code":"356","iso":"MT"},
  {"country":"Marshall Islands","code":"692","iso":"MH"},
  {"country":"Mauritania","code":"222","iso":"MR"},
  {"country":"Mauritius","code":"230","iso":"MU"},
  {"country":"Mayotte","code":"262","iso":"YT"},
  {"country":"Mexico","code":"52","iso":"MX"},
  {"country":"Micronesia","code":"691","iso":"FM"},
  {"country":"Moldova","code":"373","iso":"MD"},
  {"country":"Monaco","code":"377","iso":"MC"},
  {"country":"Mongolia","code":"976","iso":"MN"},
  {"country":"Montenegro","code":"382","iso":"ME"},
  {"country":"Montserrat","code":"1-664","iso":"MS"},
  {"country":"Morocco","code":"212","iso":"MA"},
  {"country":"Mozambique","code":"258","iso":"MZ"},
  {"country":"Myanmar","code":"95","iso":"MM"},
  {"country":"Namibia","code":"264","iso":"NA"},
  {"country":"Nauru","code":"674","iso":"NR"},
  {"country":"Nepal","code":"977","iso":"NP"},
  {"country":"Netherlands","code":"31","iso":"NL"},
  {"country":"Netherlands Antilles","code":"599","iso":"AN"},
  {"country":"New Caledonia","code":"687","iso":"NC"},
  {"country":"New Zealand","code":"64","iso":"NZ"},
  {"country":"Nicaragua","code":"505","iso":"NI"},
  {"country":"Niger","code":"227","iso":"NE"},
  {"country":"Nigeria","code":"234","iso":"NG"},
  {"country":"Niue","code":"683","iso":"NU"},
  {"country":"North Korea","code":"850","iso":"KP"},
  {"country":"Northern Mariana Islands","code":"1-670","iso":"MP"},
  {"country":"Norway","code":"47","iso":"NO"},
  {"country":"Oman","code":"968","iso":"OM"},
  {"country":"Pakistan","code":"92","iso":"PK"},
  {"country":"Palau","code":"680","iso":"PW"},
  {"country":"Palestine","code":"970","iso":"PS"},
  {"country":"Panama","code":"507","iso":"PA"},
  {"country":"Papua New Guinea","code":"675","iso":"PG"},
  {"country":"Paraguay","code":"595","iso":"PY"},
  {"country":"Peru","code":"51","iso":"PE"},
  {"country":"Philippines","code":"63","iso":"PH"},
  {"country":"Pitcairn","code":"64","iso":"PN"},
  {"country":"Poland","code":"48","iso":"PL"},
  {"country":"Portugal","code":"351","iso":"PT"},
  {"country":"Puerto Rico","code":"1-787, 1-939","iso":"PR"},
  {"country":"Qatar","code":"974","iso":"QA"},
  {"country":"Republic of the Congo","code":"242","iso":"CG"},
  {"country":"Reunion","code":"262","iso":"RE"},
  {"country":"Romania","code":"40","iso":"RO"},
  {"country":"Russia","code":"7","iso":"RU"},
  {"country":"Rwanda","code":"250","iso":"RW"},
  {"country":"Saint Barthelemy","code":"590","iso":"BL"},
  {"country":"Saint Helena","code":"290","iso":"SH"},
  {"country":"Saint Kitts and Nevis","code":"1-869","iso":"KN"},
  {"country":"Saint Lucia","code":"1-758","iso":"LC"},
  {"country":"Saint Martin","code":"590","iso":"MF"},
  {"country":"Saint Pierre and Miquelon","code":"508","iso":"PM"},
  {"country":"Saint Vincent and the Grenadines","code":"1-784","iso":"VC"},
  {"country":"Samoa","code":"685","iso":"WS"},
  {"country":"San Marino","code":"378","iso":"SM"},
  {"country":"Sao Tome and Principe","code":"239","iso":"ST"},
  {"country":"Saudi Arabia","code":"966","iso":"SA"},
  {"country":"Senegal","code":"221","iso":"SN"},
  {"country":"Serbia","code":"381","iso":"RS"},
  {"country":"Seychelles","code":"248","iso":"SC"},
  {"country":"Sierra Leone","code":"232","iso":"SL"},
  {"country":"Singapore","code":"65","iso":"SG"},
  {"country":"Sint Maarten","code":"1-721","iso":"SX"},
  {"country":"Slovakia","code":"421","iso":"SK"},
  {"country":"Slovenia","code":"386","iso":"SI"},
  {"country":"Solomon Islands","code":"677","iso":"SB"},
  {"country":"Somalia","code":"252","iso":"SO"},
  {"country":"South Africa","code":"27","iso":"ZA"},
  {"country":"South Korea","code":"82","iso":"KR"},
  {"country":"South Sudan","code":"211","iso":"SS"},
  {"country":"Spain","code":"34","iso":"ES"},
  {"country":"Sri Lanka","code":"94","iso":"LK"},
  {"country":"Sudan","code":"249","iso":"SD"},
  {"country":"Suriname","code":"597","iso":"SR"},
  {"country":"Svalbard and Jan Mayen","code":"47","iso":"SJ"},
  {"country":"Swaziland","code":"268","iso":"SZ"},
  {"country":"Sweden","code":"46","iso":"SE"},
  {"country":"Switzerland","code":"41","iso":"CH"},
  {"country":"Syria","code":"963","iso":"SY"},
  {"country":"Taiwan","code":"886","iso":"TW"},
  {"country":"Tajikistan","code":"992","iso":"TJ"},
  {"country":"Tanzania","code":"255","iso":"TZ"},
  {"country":"Thailand","code":"66","iso":"TH"},
  {"country":"Togo","code":"228","iso":"TG"},
  {"country":"Tokelau","code":"690","iso":"TK"},
  {"country":"Tonga","code":"676","iso":"TO"},
  {"country":"Trinidad and Tobago","code":"1-868","iso":"TT"},
  {"country":"Tunisia","code":"216","iso":"TN"},
  {"country":"Turkey","code":"90","iso":"TR"},
  {"country":"Turkmenistan","code":"993","iso":"TM"},
  {"country":"Turks and Caicos Islands","code":"1-649","iso":"TC"},
  {"country":"Tuvalu","code":"688","iso":"TV"},
  {"country":"U.S. Virgin Islands","code":"1-340","iso":"VI"},
  {"country":"Uganda","code":"256","iso":"UG"},
  {"country":"Ukraine","code":"380","iso":"UA"},
  {"country":"United Arab Emirates","code":"971","iso":"AE"},
  {"country":"United Kingdom","code":"44","iso":"GB"},
  {"country":"United States","code":"1","iso":"US"},
  {"country":"Uruguay","code":"598","iso":"UY"},
  {"country":"Uzbekistan","code":"998","iso":"UZ"},
  {"country":"Vanuatu","code":"678","iso":"VU"},
  {"country":"Vatican","code":"379","iso":"VA"},
  {"country":"Venezuela","code":"58","iso":"VE"},
  {"country":"Vietnam","code":"84","iso":"VN"},
  {"country":"Wallis and Futuna","code":"681","iso":"WF"},
  {"country":"Western Sahara","code":"212","iso":"EH"},
  {"country":"Yemen","code":"967","iso":"YE"},
  {"country":"Zambia","code":"260","iso":"ZM"},
  {"country":"Zimbabwe","code":"263","iso":"ZW"}]
  const [startDate, setStartDate] = useState(
      setHours(setMinutes(new Date(), 0), 9)
  );
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };
  const fieldsArrayLabel = [
    "mobileNumber",
    "appointmentDate"
  ];
  const calculateMinTime = date => {
    let isToday = moment(date).isSame(moment(), 'day');
    if (isToday) {
      let nowAddOneHour = moment(new Date()).add({hours: 1}).toDate();
      return nowAddOneHour;
    }
    return moment().startOf('day').toDate();
  }
  const appointmentMinTime = calculateMinTime(new Date());
  console.log(appointmentMinTime);
  const history = useHistory();
  const fieldsArrayLabelOfDetails = [
    "mobileNumber",
    "appointmentDate",
    "dateOfBirth",
    "reason",
    "lastName",
    "firstName"
  ];
  const onInputChange = (e, name) => {
    setappointmentDetails({ ...appointmentDetails, [name || e.name]: e.value });
  };
  async function bookingAppointments(payload) {
    return new Promise((resolve, reject) => {
      try {
        commonService.bookingAppointments(payload)
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
  }

  async function scheduleTimeByLocation(payload) {
    return new Promise((resolve, reject) => {
      try {
        commonService.scheduleTimeByLocation(payload)
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
  }

  useEffect(() => {
    scheduleTimeByLocation(locationId).then(response=>{
      console.log(response);
      setBusinessInformation(response.businessInformation.businessInformation);
      setAppointmentTiming(response.scheduleInformation);
    }).catch(err=>{
      console.log(err);
    })
  }, []);

  const handleMobileNumberSection =(e, getFields)=>{
    e.preventDefault();
    if(validation(getFields))
    {

      setMobileNumberSubmitted(true);
      if(getFields == 'checkMobilseSection'){
         let closeTimeArray = appointmentTiming.closingTime.split(":");
         let openTimeArray = appointmentTiming.openingTime.split(":");
         let closeTime = (parseInt(closeTimeArray[0])*60) + parseInt(closeTimeArray[1])
         let openTime = (parseInt(openTimeArray[0])*60) + parseInt(openTimeArray[1])
         let closingTime = new Date(appointmentDetails.appointmentDate);//moment(appointmentDetails?.appointmentDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
         let openingTime = new Date(appointmentDetails.appointmentDate);
         closingTime.setHours(closeTimeArray[0]);
         closingTime.setSeconds(closeTimeArray[1]);
         openingTime.setHours(openTimeArray[0]);
         openingTime.setSeconds(openTimeArray[1]);
        if(openTime>closeTime){
           closingTime.setDate(closingTime.getDate()+1);
         }
        if(closingTime < new Date(appointmentDetails.appointmentDate) || new Date(appointmentDetails.appointmentDate)<openingTime){
          swal.fire({
          icon: "error",
          title: "Error",
          text: "Selected slot is not available. Try again with available slots",
        });
        setMobileNumberSubmitted(false);
        return;
        }

      }
      if(getFields == 'checkUserProfileSection'){
        setLoading(true);
        let reqPayload = {
          locationId: locationId,
          mobile: `+${countryCode}${appointmentDetails?.mobileNumber}`,
          visitDate: moment(appointmentDetails?.appointmentDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          dob: appointmentDetails?.dateOfBirth,
          visitReason: appointmentDetails?.reason,
          LastName: appointmentDetails?.lastName,
          FirstName: appointmentDetails?.firstName
        };
        bookingAppointments(reqPayload).then((response)=>{
          console.log(response);
        //   swal.fire({
        //   icon: "success",
        //   title: "Appointment booked",
        //   text: "Appointment booked successfully",
        // });
        setLoading(false);
        setDetailSection(false);
          }).catch((err)=>{
            setLoading(false);
          swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong. Try after sometime",
        });
        });
      }
  }
  }

  let handleColor = (time) => {
    return time.getHours() > 12 ? "text-success" : "text-error";
  };

  function phonenumber() {
    var re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!re.test(appointmentDetails['mobileNumber'])) {
      return true;
    }
  }
  const validation = (checkFields) => {
    let isValid = true;
    const formFields = Object.keys(appointmentDetails);
    let newFormValues = { ...appointmentDetails };
    let labelsArray = (checkFields == 'checkMobilseSection') ? fieldsArrayLabel : fieldsArrayLabelOfDetails;
    labelsArray.forEach((val, index) => {
      if (!appointmentDetails[val]) {
        isValid = false;
        if (checkFields == 'checkMobilseSection')
        {
          setValidationForMobileSec(true);
          setMobileNumberSubmitted(false);
        } 
      }
      else
      {
          if(checkFields !== 'checkMobilseSection')
          { 
            setValidation(true);
            if(appointmentDetails['dateOfBirth'] && appointmentDetails?.dateOfBirth > dobMax)
            {
              isValid = false;
            }
          }
      }
    });
    return isValid;
  };

  return (
    <>
    <nav className="navbar nav-green-bg shadow-sm">
  <div>
     <Link className="navbar-brand logo-img-parking-lot" onClick={()=>window.location.reload(false)}><img src={logoImage} alt="" /></Link>
  </div>
</nav>
  {detailSection?
    <div className="d-flex m-5 flex-column align-items-center">
    {!mobileNumberSubmitted ? (<form onSubmit={(e)=> handleMobileNumberSection(e, 'checkMobilseSection')}>
    <div className="form-row">
        <div className="form-group col-md-6"> 
        <h4>
          <a className="navbar-brand" style={{color: 'green', fontWeight: 'bold'}} onClick={() => history.push(`/scheduleappointment/${locationId}`)}>Book Appointment</a>
          </h4>
        </div>
    </div>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="mobileNumber">Mobile number<span style={{ color: "red" }}>*</span></label>
          <div className='d-flex'>
          <select className="form-control w-auto mx-1" value={countryCode} onChange={(e)=>{setCountryCode(e.target.value)}}>
            {
            countryCodeArray.map((e, key) => {
            return <option key={key} value={e.code}>{e.iso}</option>;
            })
            }</select>
            <div className='w-100'>
            <input type="number" className={`form-control mobile-number-form ${
                        checkValidationForMobileSec && phonenumber()
                          ? "is-invalid"
                          : "valid"
                      }`} id="mobileNumber" 
          name="mobileNumber"
          maxLength="10"
          value={appointmentDetails?.mobileNumber  || ''}
          onChange={(e) => onInputChange(e.target)}
          placeholder="Mobile number"/>
            <label className="invalid-feedback">
                  Please enter a vaild mobile number.
          </label>
            </div>
          </div>
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="appointmentDate">Select appointment date <span style={{ color: "red" }}>*</span></label>
          <input type="datetime-local" name="appointmentDate"
          className={`form-control ${
                      checkValidationForMobileSec && !appointmentDetails['appointmentDate']
                        ? "is-invalid"
                      : "valid"
                    }`} id="appointmentDate"
                    min={appointmentMin}
                    format="YYYY-MM-DD hh:mm"
                value={appointmentDetails?.appointmentDate  || ''}
              onChange={(e) => onInputChange(e.target)}/>
          {/* <div className='react-date-picker custom-date-appointment'>
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                minDate={startDate}
                filterTime={filterPassedTime}
                dateFormat="MM/dd/yyyy:hh:mm"
                timeCaption="Time"
            />
          </div> */}
              <label className="invalid-feedback">
                  Please select the appointment date.
          </label>
        </div>
      </div>
      <button type="submit" className="btn nav-green-bg w-100">Next</button>
    </form>) :

    (<form onSubmit={(e)=> handleMobileNumberSection(e, 'checkUserProfileSection')}>
        <div className="form-row">
        <div className="form-group col-md-6"> 
        <h4>
          <a className="navbar-brand" style={{color: 'green', fontWeight: 'bold'}} onClick={() => history.push(`/scheduleappointment/${locationId}`)}>Book Appointment</a>
          </h4>
        </div>
    </div>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="firstName">First name<span style={{ color: "red" }}>*</span></label>
          <input type="text"  className={`form-control ${
                        checkValidation && !appointmentDetails['firstName']
                          ? "is-invalid"
                          : "valid"
                      }`} id="firstName"
                      name="firstName"
                      value={appointmentDetails?.firstName  || ''}
                      onChange={(e) => onInputChange(e.target)}
          placeholder="First Name"/>
                          <label className="invalid-feedback">
                  Please enter the first name.
          </label>
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="lastName">Last Name<span style={{ color: "red" }}>*</span></label>
          <input type="text"  className={`form-control ${
                        checkValidation && !appointmentDetails['lastName']
                          ? "is-invalid"
                          : "valid"
                      }`}  id="lastName"
                            name="lastName"
                            value={appointmentDetails?.lastName  || ''}
                            onChange={(e) => onInputChange(e.target)}
          placeholder="Last Name"/>
                    <label className="invalid-feedback">
                  Please enter the last name.
          </label>
        </div>
      </div>
      <div className="form-row">
      <div className="form-group col-md-6">
          <label htmlFor="reason">Reason for visit<span style={{ color: "red" }}>*</span></label>
          <input type="text"  className={`form-control ${
                        checkValidation && !appointmentDetails['reason']
                          ? "is-invalid"
                          : "valid"
                      }`} id="reason"
                            name="reason"
                            value={appointmentDetails?.reason  || ''}
                            onChange={(e) => onInputChange(e.target)}
          placeholder="Reason"/>
              <label className="invalid-feedback">
                  Please enter the reason.
          </label>
        </div>
      <div className="form-group col-md-6">
        <label htmlFor="dateOfBirth">Date of birth <span style={{ color: "red" }}>*</span></label>
        <input type="date" className={`form-control ${
                        checkValidation && !appointmentDetails['dateOfBirth']
                          ? "is-invalid"
                          : "valid"
                      }`}
                                name="dateOfBirth"
                                max={dobMax} 
                                value={appointmentDetails?.dateOfBirth  || ''}
                                onChange={(e) => onInputChange(e.target)}
        id="dateOfBirth"/>
        <label className="invalid-feedback">
                  Please select the date of birth.
          </label>
      </div>
      </div>
      <button type="submit" className="btn nav-green-bg w-100">{loading ? 'Loading...' : 'Submit'}</button>
    </form>)}
    </div>
: <div className="d-flex m-5 flex-column align-items-center">
    
    <h6 style={{color: 'black', fontWeight: 'bold'}}>
              Thanks!! Your Appointment has been scheduled, please see the details below.
    </h6>
    <div id="ViewComplete" className="row text-center">
        
            <div style={{ maxWidth: '800px', margin: 'auto' }}>
              <div className="nameDiv">
                <div className="imageDiv">
                  <MdOutlineApartment height={30} width={30} />
                </div>
                <div className="labelList">
                  <p className="labelName">Clinic Name : </p>
                  <p>{businessInformation?.companyName}</p>
                </div>
              </div>
              <div className="nameDiv">
                <div className="imageDiv">
                  <MdOutlinePlace height={30} width={30} />
                </div>
                <div className="labelList">
                  <p className="labelName">Clinic Address :  </p>
                  <p>{businessInformation?.companyAddress}</p>
                </div>
              </div>
              <div className="nameDiv">
                <div className="imageDiv">
                  <MdCalendarToday height={30} width={30} />
                </div>
                <div className="labelList">
                  <p className="labelName">Appointment Date & Time  </p>
                  <p><span>{appointmentDetails?.appointmentDate}</span></p>
                </div>
              </div>
              <div className="nameDiv">
                <div className="imageDiv">
                  <MdPerson height={30} width={30} />
                </div>
                <div className="labelList">
                  <p className="labelName">Name </p>
                  <p>{`${appointmentDetails.firstName} ${appointmentDetails.lastName}`}</p>
                </div>
              </div>
              <div className="nameDiv">
                <div className="imageDiv">
                  <MdMobileScreenShare height={30} width={30}/>
                </div>
                <div className="labelList">
                  <p className="labelName">Mobile Number </p>
                  <p>{appointmentDetails.mobileNumber}</p>
                  
                </div>
              </div>
            </div>
            <div className="col-12 mb-3 py-5">
              <button
                type="button"
                className="btn new-appointment-btn"
                onClick={()=>window.location.reload(false)}
              >
                Book New Appointment
              </button>
              
            </div>
          </div>
  </div>}
    
</>
  )
}

export default appointment
