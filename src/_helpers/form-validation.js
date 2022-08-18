import {formConstants, SettingsAPIConstants} from '../_constants';
const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

export function validateForm (errorObject) {
    return new Promise((resolve,reject)=>{
        try {
            let valid = true;
            Object.values(errorObject).forEach(
            (val) => {
                valid = (!val.status) ? (!valid) ? valid : true : false;
            });
           return resolve(valid);
        } catch (e) {
            return reject (e);
        }
    })
}

export function validateEmail(value) {
    return new Promise((resolve, reject)=>{
        try {
            const checkEmail =  validEmailRegex.test(value) ;
            return resolve(checkEmail);
        } catch (e) {
            return reject(e);
        }
    })
}

export function fetchFormType(type) {
  return new Promise(async (resolve) => {
    switch (type) {
        case formConstants.Business_Information:
            return resolve('BusinessInformation');
        case formConstants.Alert_Settings:
            return resolve('AlertSettings');
        case formConstants.Additional_Features:
            return resolve('AdditionalFeatures');
        case formConstants.Styling:
            return resolve('Styling');
        case formConstants.Client_Information:
            return resolve('ClientInformation');
        case formConstants.Signage_Information:
           return resolve('SignageInformation');
            
        default:
            break;
    }
  })
}

export function validateFields(name, value, errors) {
    try {
        switch (name) {
            case 'companyName':
                if(value.length < 5) {
                    errors.companyName.info = 'companyName must be 5 characters long!';
                    errors.companyName.status = true;
                } else {
                    errors.companyName.status = false;
                    errors.companyName.info = '';
                }
            break;
            case 'companyAddress':
                if(value.length < 5) {
                    errors.companyAddress.info = 'companyAddress must be 5 characters long!';
                    errors.companyAddress.status = true;
                } else {
                    errors.companyAddress.status = false;
                    errors.companyAddress.info = '';
                }
            break;
            case 'companyNumber':
                if(value.length < 10) {
                    errors.companyNumber.info = 'companyNumber must be 10 digit long!';
                    errors.companyNumber.status = true;
                } else {
                    errors.companyNumber.status = false;
                    errors.companyNumber.info = '';
                }
            break;
            case 'generatedPhoneNumber':
                if(value.length < 10) {
                    errors.generatedPhoneNumber.info = 'generatedPhoneNumber must be 10 digit long!';
                    errors.generatedPhoneNumber.status = true;
                } else {
                    errors.generatedPhoneNumber.status = false;
                    errors.generatedPhoneNumber.info = '';
                }
            break;
            case 'signNumber':
                if(value.length <=0) {
                    errors.signNumber.info = 'signNumber must be greater then 0!';
                    errors.signNumber.status = true;
                } else {
                    errors.signNumber.status = false;
                    errors.signNumber.info = '';
                }
            break;
            default:
            break;
        }
        return errors
    } catch (e) {
        return {errors:errors} 
    }
}

export function fetchAPIEndpoint(type) {
    return new Promise(async (resolve) => {
      switch (type) {
          case formConstants.Business_Information:
            return resolve(SettingsAPIConstants.Business_Information);
          case formConstants.Alert_Settings:
            return resolve(SettingsAPIConstants.Alert_Settings);
          case formConstants.Additional_Features:
            return resolve(SettingsAPIConstants.Additional_Features);
          case formConstants.Styling:
            return resolve(SettingsAPIConstants.Styling);
          case formConstants.Client_Information:
            return resolve(SettingsAPIConstants.Client_Information);
          case formConstants.GET_Settings:
            return resolve(SettingsAPIConstants.GET_Settings);
          case formConstants.Signage_Information:
            return resolve(SettingsAPIConstants.Signage_Information);
          default:
              break;
      }
    })
}
export function capitalize(str) {
    try {
        const lower = str.toLowerCase()
        return str.charAt(0).toUpperCase() + lower.slice(1);
    } catch (err) {
        return '';
    }
}