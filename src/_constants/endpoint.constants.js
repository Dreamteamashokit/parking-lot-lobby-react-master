export const SettingsAPIConstants = {
    GET_Settings:'settings',
    Business_Information: 'updateBusinessInformation',
    ScheduleInformation: 'scheduleInformation',
    Alert_Settings: 'updateAlertSettings',
    Additional_Features:'updateAdditionalSettings',
    Styling:'updateStylingSettings',
    Client_Information:'updateclientInformationSettings',
    Signage_Information: 'updateSignageInformation'
};

export const CommonApiEndpoint = {
    fetchPatientList:'fetchPatientList',
    getQuickResponse:'getQuickResponse',
    addQuickResponse:"addQuickResponse",
    updateQuickResponse:"updateQuickResponse",
    removeQuickResponse:"removeQuickResponse",
    fetchPatientChat:"fetchPatientChat",
    waitingToCheckIn:"waitingToCheckIn",
    checkInToCheckOut:"checkInToCheckOut",
    notifyPatient:"notifyPatient",
    removePatient:"removePatient",
    updateNoShow:"updateNoShow",
    updateDelayForPatient:"updateDelayForPatient",
    updateNotes:"updateNotes",
    createProfileAction:"addClient",
    addlocationAction:"addlocation",
    addJotformAction:"addJotform",
    fetchlocationsAction:"fetchlocations",
    updatePatient:"updatePatientInfo",
    backToWaiting:"backToWaiting",
    updateCarLobby:"updateCarLobby",
    fetchFormUploads:"fetchFormUploads",
    generatePdf:"generatePdf",
    getAttachmentFromUrl:"getAttachmentFromUrl",
    reviewDocument:"review-document"
}
export const twilioApiEndpoint = {
    send : '/twilio/send'
}