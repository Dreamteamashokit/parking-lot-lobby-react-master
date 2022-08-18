import config from 'config';
import { authHeader } from '../_helpers';
import {CommonApiEndpoint, twilioApiEndpoint} from '../_constants';

export const commonService = {
    fetchPatientList:fetchPatientList,
    waitingToCheckIn:waitingToCheckIn,
    checkInToCheckOut:checkInToCheckOut,
    getQuickResponse:getQuickResponse,
    fetchPatientChat:fetchPatientChat,
    addQuickResponse:addQuickResponse,
    updateQuickResponse:updateQuickResponse,
    addChatMessage:addChatMessage,
    notifyPatient:notifyPatient,
    removePatient:removePatient,
    removeQuickResponse:removeQuickResponse,
    noShowSet:noShowSet,
    updateDelayForPatient:updateDelayForPatient,
    updateNotesForPatient:updateNotesForPatient,
    createProfileAction:createProfileAction,
    addlocationAction,
    fetchlocations,
    updatePatientInfor,
    resetWaiting,
    updateCarLobby,
    fetchFormUploads,
    downloadPdf,
    fetchAttachement,
    reviewDocument
}

async function fetchPatientList(type=1, isSearch, searchBy) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    let searchQuery = `type=${type}`;
    if(isSearch) {
        searchQuery = searchQuery+`&searchBy=${searchBy}`;
    }
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.fetchPatientList}?${searchQuery}`, requestOptions).then(handleResponse);
}

async function waitingToCheckIn(payload) {
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'PUT',
        headers: headerPayload,
        body: JSON.stringify({ ...payload })
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.waitingToCheckIn}`, requestOptions)
        .then(handleResponse);
}

async function checkInToCheckOut(payload) {
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'PUT',
        headers: headerPayload,
        body: JSON.stringify({ ...payload })
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.checkInToCheckOut}`, requestOptions)
        .then(handleResponse);
}

async function getQuickResponse() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.getQuickResponse}`, requestOptions).then(handleResponse);
}
async function addQuickResponse(payload) {
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'POST',
        headers: headerPayload,
        body: JSON.stringify({ ...payload })
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.addQuickResponse}`, requestOptions)
        .then(handleResponse);
}
async function updateQuickResponse(payload) {
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'PUT',
        headers: headerPayload,
        body: JSON.stringify({ ...payload })
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.updateQuickResponse}`, requestOptions)
        .then(handleResponse);
}

async function removeQuickResponse(payload) {
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'DELETE',
        headers: headerPayload
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.removeQuickResponse}/${payload.id}`, requestOptions)
        .then(handleResponse);
}

async function fetchPatientChat(patientId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.fetchPatientChat}?patientId=${patientId}`, requestOptions).then(handleResponse);
}

async function addChatMessage(payload) {
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'POST',
        headers: headerPayload,
        body: JSON.stringify({ ...payload })
    };
    return fetch(`${config.apiUrl}${twilioApiEndpoint.send}`, requestOptions)
        .then(handleResponse);
}

async function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
async function notifyPatient(payload) {
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'PUT',
        headers: headerPayload,
        body: JSON.stringify({ ...payload })
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.notifyPatient}`, requestOptions)
        .then(handleResponse);
}
async function removePatient(payload) {
    const deleteType = (payload.deleteType) ? payload.deleteType :1;
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'DELETE',
        headers: headerPayload,
        body: JSON.stringify({ deleteType:deleteType})
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.removePatient}/${payload.id}`, requestOptions)
        .then(handleResponse);
}
async function noShowSet(payload) {
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'PUT',
        headers: headerPayload,
        body: JSON.stringify({ ...payload })
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.updateNoShow}`, requestOptions)
        .then(handleResponse);
}
async function updateDelayForPatient(payload) {
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'PUT',
        headers: headerPayload,
        body: JSON.stringify({ ...payload })
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.updateDelayForPatient}`, requestOptions)
        .then(handleResponse);
}
async function updateNotesForPatient(payload) {
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'PUT',
        headers: headerPayload,
        body: JSON.stringify({ ...payload })
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.updateNotes}`, requestOptions)
        .then(handleResponse);
}
async function createProfileAction(payload) {
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'POST',
        headers: headerPayload,
        body: JSON.stringify({ ...payload })
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.createProfileAction}`, requestOptions)
        .then(handleResponse);
}
async function addlocationAction(payload) {
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'POST',
        headers: headerPayload,
        body: JSON.stringify({ ...payload })
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.addlocationAction}`, requestOptions)
        .then(handleResponse);
}

async function fetchlocations() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.fetchlocationsAction}`, requestOptions).then(handleResponse);
}

async function updatePatientInfor(payload) {
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'PUT',
        headers: headerPayload,
        body: JSON.stringify({ ...payload })
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.updatePatient}`, requestOptions)
        .then(handleResponse);
}



async function resetWaiting(payload) {
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'PUT',
        headers: headerPayload,
        body: JSON.stringify({ ...payload })
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.backToWaiting}`, requestOptions)
        .then(handleResponse);
}

async function updateCarLobby(payload) {
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'PUT',
        headers: headerPayload,
        body: JSON.stringify({ ...payload })
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.updateCarLobby}`, requestOptions)
        .then(handleResponse);
}

async function fetchFormUploads(submissionID) {
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'GET',
        headers: headerPayload
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.fetchFormUploads}?submissionID=${submissionID}`, requestOptions)
        .then(handleResponse);
}

async function downloadPdf(submissionID,type) {
   return new Promise(async (resolve,reject)=> {
       try {
        const headerObject = authHeader();
        const headerPayload = {
            'Content-Type': 'application/json',
            ...headerObject
        }
        const requestOptions = {
            method: 'GET',
            headers: headerPayload
        };
        const response = await fetch(`${config.apiUrl}/common/${CommonApiEndpoint.generatePdf}?submissionID=${submissionID}&type=${type}`, requestOptions).then(handleResponse);
        return resolve({backend_url: config.apiUrl, response:response});
       } catch (err) {
        return reject(err);
       }
   })
}
async function fetchAttachement(url) {
    return new Promise(async (resolve,reject)=> {
        try {
         const headerObject = authHeader();
         const headerPayload = {
             ...headerObject
         }
         const requestOptions = {
             method: 'GET',
             headers: headerPayload
         };
         const response = await fetch(`${config.apiUrl}/common/${CommonApiEndpoint.getAttachmentFromUrl}?url=${url}`, requestOptions).then(handleResponse);
         return resolve({...response});
        } catch (err) {
         return reject(err);
        }
    })
 }

async function reviewDocument(payload) {
    const headerObject = authHeader();
    const headerPayload = {
        'Content-Type': 'application/json',
        ...headerObject
    }
    const requestOptions = {
        method: 'PUT',
        headers: headerPayload,
    };
    return fetch(`${config.apiUrl}/common/${CommonApiEndpoint.reviewDocument}/${payload.id}`, requestOptions)
        .then(handleResponse);
}
