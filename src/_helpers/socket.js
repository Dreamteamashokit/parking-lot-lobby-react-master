import io from "socket.io-client";
import config from 'config';
export const socket = io.connect(config.apiUrl, {transports: ['polling']});

export function getLoginUserId() {
   return new Promise((resolve,reject)=>{
        try {
            let user = JSON.parse(localStorage.getItem('user'));
            const userId = (user && user._id) ? user._id : null;
            const locationId = (user && user.default_location) ? user.default_location : null;
            resolve({userId:userId, locationId:locationId});
        } catch (error) {
            reject(error);
        }
   })
}
export function updatelocationOpen(locationIsOpen=false, refresh = false) {
    return new Promise((resolve,reject)=>{
         try {
             let userData = JSON.parse(localStorage.getItem('user'));
             const isChanged = userData.locationIsOpen !== locationIsOpen;
             userData.locationIsOpen = locationIsOpen;
             localStorage.setItem('user', JSON.stringify(userData));
             if(isChanged && refresh) {
                window.location.reload();
             }
             resolve({user:userData});
         } catch (error) {
             reject(error);
         }
    })
 }

