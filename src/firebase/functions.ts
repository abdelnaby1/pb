import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./config";
import { FirebaseError } from "firebase/app";
import toast from "react-hot-toast";

const storageKey =  "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString): null;
    
export const uploadBannerToStorage = async (image:File) => {
      let url;
      try {
        const uploadPath = `${userData.uid}/images/${Date.now()} ${image?.name}}`; 
        const storageRef = ref(storage, uploadPath); 
        const snapshot = await uploadBytes(storageRef, image)
        url = await getDownloadURL(snapshot.ref);
         
      } catch (error) {
          const errorObj = error as FirebaseError      
          toast.error(`${errorObj.message}`, {
              duration: 4000,
              position: 'top-center',
              style: {
                backgroundColor: "black",
                color: "white",
                width: "fit-content",
              }
            }
          )   
      }
      return url;
}
