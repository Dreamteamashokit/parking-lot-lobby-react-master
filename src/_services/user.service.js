import config from 'config';
import { authHeader } from '../_helpers';
import { SettingsAPIConstants } from '../_constants';


export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete,
    forgot: forgot,
    resetPassword: resetPassword,
    updateSettings: updateSettings,
    updateCard,
    getPlan,
    fetchCards,
    payMembership,
    getSettings: getSettings,
    fetchNotifications: fetchNotifications,
    markNotifications: markNotifications,
    updatePatientProfile: updatePatientProfile,
    markAllNotifications: markAllNotifications,
    patientRegister: patientRegister,
    fetchData,
    updateIsOpenSetting,
    addReviw,
    anotherPatientRegister,
    checkAndSaveNumber
};

async function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    };
    return fetch(`${config.apiUrl}/user/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            let userData = user.data || {};
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(userData));
            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

async function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

async function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

async function register(user) {
    let formData = new FormData();
    formData.append('businessName', user.businessName);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('locationNumber', user.locationNumber);
    formData.append('fullNumber', user.fullNumber);
    formData.append('agreeTermCondition', user.agreeTermCondition);
    formData.append('avatar', user.avatar);
    formData.append('selectedTimeZone', JSON.stringify(user.selectedTimeZone));
    const requestOptions = {
        method: 'POST',
        body: formData
    };

    return fetch(`${config.apiUrl}/user/register`, requestOptions).then(handleResponse);
}

async function forgot(email) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    };
    return fetch(`${config.apiUrl}/user/forgot`, requestOptions)
        .then(handleResponse);
}

async function resetPassword(passwordObject) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...passwordObject })
    };
    return fetch(`${config.apiUrl}/user/reset-password`, requestOptions)
        .then(handleResponse);
}

async function updateSettings(endPoint, payload) {
    const headerObject = authHeader();
    const headerPayload = {
        ...headerObject
    }
    let formData = new FormData();
    if ((endPoint == SettingsAPIConstants.Business_Information) || (endPoint == SettingsAPIConstants.Signage_Information)) {
        for (const key in payload) {
            if (key == 'selectedTimeZone' || key == 'selectedLanguage') {
                formData.append(key, JSON.stringify(payload[key]));
            } else {
                formData.append(key, payload[key]);
            }
        }
    } else {
        headerPayload['Content-Type'] = 'application/json';
        formData = JSON.stringify({ ...payload });
    }

    const requestOptions = {
        method: 'POST',
        headers: headerPayload,
        body: formData
    };
    return fetch(`${config.apiUrl}/user/${endPoint}`, requestOptions)
        .then(handleResponse);
}
async function getSettings(endPoint) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/user/${endPoint}`, requestOptions).then(handleResponse);
}

async function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/${user.id}`, requestOptions).then(handleResponse);;
}

async function payMembership(data) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    return fetch(`${config.apiUrl}/user/pay/membership`, requestOptions).then(handleResponse);;
}

async function updateCard(card) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(card)
    };
    return fetch(`${config.apiUrl}/user/pay/card`, requestOptions).then(handleResponse);;
}

async function getPlan() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${config.apiUrl}/user/plan`, requestOptions).then(handleResponse);
}

async function fetchCards() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${config.apiUrl}/user/pay/cards`, requestOptions).then(handleResponse);
}

async function fetchNotifications() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/user/getNotifications`, requestOptions).then(handleResponse);
}
async function markNotifications(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/user/markMessageRead`, requestOptions).then(handleResponse);;
}
async function markAllNotifications() {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${config.apiUrl}/user/markAllMessageRead`, requestOptions).then(handleResponse);;
}
async function updatePatientProfile(payload) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    return fetch(`${config.apiUrl}/user/updatePatientInfo`, requestOptions).then(handleResponse);;
}


// prefixed function name with underscore because delete is a reserved word in javascript
async function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

async function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            /* if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload()
            } */
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}

async function patientRegister(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/user/patient-register`, requestOptions).then(handleResponse);
}
async function fetchData(endPoint, searchQuery) {

    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    if (searchQuery && searchQuery.length > 0) {
        return fetch(`${config.apiUrl}/${endPoint}?${searchQuery}`, requestOptions).then(handleResponse);
    } else {
        return fetch(`${config.apiUrl}/${endPoint}`, requestOptions).then(handleResponse);

    }
}

async function updateIsOpenSetting(endPoint, payload) {
    const headerObject = authHeader();
    console.log('\n headerObject:', headerObject)
    const headerPayload = {
        ...headerObject
    }
    headerPayload['Content-Type'] = 'application/json';
    console.log('\n headerPayload:', headerPayload)
    const requestOptions = {
        method: 'PUT',
        headers: headerPayload,
        body: JSON.stringify({ ...payload })
    };
    return fetch(`${config.apiUrl}/user/${endPoint}`, requestOptions)
        .then(handleResponse);
}

async function addReviw(payload) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    return fetch(`${config.apiUrl}/user/add-review`, requestOptions).then(handleResponse);
}

async function anotherPatientRegister(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };
    return fetch(`${config.apiUrl}/user/another-patient-register`, requestOptions).then(handleResponse);
}

async function checkAndSaveNumber(patient) {
    return new Promise((resolve, reject) => {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patient)
            };
            fetch(`${config.apiUrl}/user/save-number`, requestOptions)
                .then(handleResponse)
                .then(function (response) {
                    return resolve(response.data)
                })
                .catch(function (error) {
                    return reject({ message: error })
                });
        } catch (err) {
            return reject(err);
        }
    })
}
