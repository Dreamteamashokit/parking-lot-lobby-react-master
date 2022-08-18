export function authHeader() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));
    
    if (user && user.accessToken) {

        const response = { 'Authorization': user.accessToken };
        if(user.default_location) {
            response['locationId'] = user.default_location;
        }
        return response
         // 'Bearer ' +
    } else {
        return {};
    }
}

export function adminAuthHeader() {
    // return authorization header with jwt token
    let admin = JSON.parse(localStorage.getItem('admin'));
    
    if (admin && admin.accessToken) {
        const response = { 'Authorization': admin.accessToken };
        return response
         // 'Bearer ' +
    } else {
        return {};
    }
}