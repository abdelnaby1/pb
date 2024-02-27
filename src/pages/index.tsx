import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { FormEvent, useState } from "react";
import Button from "../components/UI/Button";
import Select from "../components/UI/Select";
import { firestore } from "../config/firebase";
import { bannerTypes } from "../data";
import { IBanner } from "../interfaces";

const HomePage = () => {
   const [selectedBannerType, setSelectedBannerType] = useState<IBanner>(bannerTypes[0]);
  const [banner, setBanner] = useState<File | null>(null);
   const [bannerError, setBannerError] = useState<string | null>(null);
  
  const onChangeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
      setBannerError(null);
        const selected = e.target.files[0];
        if (!selected) {
            setBannerError('Please select file');
            return;
        }
        if (!selected.type.includes('image')) {
            setBannerError('Please select image file');
            return;
        }
        if (selected.size > 1000000) {
            setBannerError('Please select smaller file size');
            return;
        }
        setBannerError(null);
        setBanner(selected);

  }

  
  
 const submitHandler = (e: FormEvent<HTMLFormElement>): void =>{
    e.preventDefault();
    // const uploadPath = `images/${banner?.name}`; // geting the image path
    //     const storageRef = ref(storage, uploadPath); // getting the storageRef
    //     uploadBytes(storageRef, banner!)
    //         .then(snapshot => {
    //           getDownloadURL(snapshot.ref).then(url => console.log(url))
    //           addTodo();

    //           // console.log("snapshot ----",snapshot.metadata.ref?.fullPath))
    //         })
    //         .catch(err => console.log(err.message));

    deleteDoce()
    };

    const addTodo = async () => {       
        try {
            const docRef = await addDoc(collection(firestore, "banners"), {
              todo: {title:"hi"},    
            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.log("Error adding document: ", e);
          }
    }

    const deleteDoce = async() => {
      try {
         const docRef = await deleteDoc(doc(firestore, "banners","tvnbV3ox6U3vLFmTzs66"))
          console.log("Document written with ID: ",docRef);
        } catch (error) {
          console.log("Error adding document: ",error);
      }
    }

   
  

  return (
    <section className="max-w-2xl mx-auto">
        <h2 className="text-center mb-4 text-3xl font-semibold">Upload Banner</h2>
        <form className="space-y-4" onSubmit={submitHandler}>
          <div className='flex flex-col space-y-2'>
            <h1 className='text-left'>Upload Image</h1>
            <input  onChange={onChangeHandler} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="picture" name="picture" type="file" />            
          </div>
          <Select selected={selectedBannerType} setSelected={setSelectedBannerType}/>
          <Button className="block bg-indigo-700 hover:bg-indigo-800 mx-auto my-10 px-10 font-medium" width="w-full">
            Submit
          </Button>
        </form>
    </section>

  );
};

export default HomePage;
