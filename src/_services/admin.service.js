import config from 'config';
import { adminAuthHeader } from '../_helpers';

export const adminService = {
    login,
    logout,
    fetchClientList:fetchClientList,
    fetchJotformList:fetchJotformList,
    fetchDashboardCount:fetchDashboardCount,
    fetchLocationList:fetchLocationList,
    postAdmin:postAdmin,
    putAdmin:putAdmin,
    getAdmin:getAdmin
};

async function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    };
    return fetch(`${config.apiUrl}/admin/login`, requestOptions)
        .then(response => response.json())
        .then(response => {
            let adminData = response.data || {};
            // store admin details and jwt token in local storage to keep admin logged in between page refreshes
            localStorage.setItem('admin', JSON.stringify(adminData));
            return response;
        });
}

function logout() {
    // remove admin from local storage to log admin out
    localStorage.removeItem('admin');
}

async function fetchDashboardCount(endpoint){
    const headerObject = adminAuthHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'GET',
        headers: headerPayload,
    };
    return fetch(`${config.apiUrl}/${endpoint}`, requestOptions)
        .then((handleResponse)=>handleResponse.json())
}

async function fetchClientList(endpoint) {
    const headerObject = adminAuthHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'GET',
        headers: headerPayload,
    };
    return fetch(`${config.apiUrl}/${endpoint}`, requestOptions)
        .then((handleResponse)=>handleResponse.json())
} 

async function fetchJotformList(endpoint) {
    const headerObject = adminAuthHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'GET',
        headers: headerPayload,
    };
    return fetch(`${config.apiUrl}/${endpoint}`, requestOptions)
        .then((handleResponse)=>handleResponse.json())
} 


async function fetchLocationList(endpoint) {
    const headerObject = adminAuthHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'GET',
        headers: headerPayload,
    };
    return fetch(`${config.apiUrl}/${endpoint}`, requestOptions)
        .then((handleResponse)=>handleResponse.json())
} 

async function getAdmin(endpoint){
    const headerObject = adminAuthHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'GET',
        headers: headerPayload,
    };
    return fetch(`${config.apiUrl}/${endpoint}`, requestOptions)
            .then((handleResponse)=>handleResponse.json());
}

async function postAdmin(endpoint,payload){
    const headerObject = adminAuthHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'POST',
        headers: headerPayload,
        body:JSON.stringify({...payload})
    };
    return fetch(`${config.apiUrl}/${endpoint}`, requestOptions)
            .then((handleResponse)=>handleResponse.json());
}
async function putAdmin(endpoint,payload){
    const headerObject = adminAuthHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'PUT',
        headers: headerPayload,
        body:JSON.stringify({...payload})
    };
    return fetch(`${config.apiUrl}/${endpoint}`, requestOptions)
            .then((handleResponse)=>handleResponse.json());
}