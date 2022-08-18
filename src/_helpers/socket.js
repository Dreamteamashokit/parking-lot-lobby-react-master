import io from "socket.io-client";
import config from 'config';
export const socket = io.connect(config.apiUrl);

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
export function updatelocationOpen(locationIsOpen=false) {
    return new Promise((resolve,reject)=>{
         try {
             let userData = JSON.parse(localStorage.getItem('user'));
             userData.locationIsOpen = locationIsOpen;
             localStorage.setItem('user', JSON.stringify(userData));
             resolve({user:userData});
         } catch (error) {
             reject(error);
         }
    })
 }

