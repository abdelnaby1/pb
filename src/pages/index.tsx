import { addDoc, collection } from "firebase/firestore";
import { ChangeEvent, useState ,useRef} from "react";
import Button from "../components/UI/Button";
import Select from "../components/UI/Select";
import { firestore, storage } from "../config/firebase";
import { BANNER_FORM, bannerTypes } from "../data";
import { IBanner } from "../interfaces";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import InputErrorMesaage from "../components/InputErrorMesaage";
import toast from "react-hot-toast";
import { FirebaseError } from "firebase/app";
import Input from "../components/UI/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { addBannerSchema } from "../validation";
import { yupResolver } from "@hookform/resolvers/yup";

const storageKey =  "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString): null;
interface IFormInput {
  refId: number
}

const HomePage = () => {
  const [bannerImg, setBannerImg] = useState<File | null>(null);
  const [bannerError, setBannerError] = useState<string>("")
  const [selectedBannerType, setSelectedBannerType] = useState<IBanner>(bannerTypes[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { register, formState: { errors }, reset,handleSubmit } = useForm<IFormInput>({resolver:yupResolver(addBannerSchema)})
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
  
    setIsLoading(true)    
    await addBannerToDb(data);
    reset()
  }
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearInput = () => {
    fileInputRef && fileInputRef .current && ( fileInputRef.current.value = "");

  }
  const onInputFileChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
      setBannerError("");
      const selectedImg = e?.target?.files?.[0];
      if (!selectedImg) {
          setBannerError('Please select file');
          return;
      }
      if (!selectedImg.type.includes('image')) {
          setBannerError('Please select image file');
          return;
      }
      if (selectedImg.size > 1000000) {
          setBannerError('Please select smaller file size');
          return;
      }
      setBannerError("");
      setBannerImg(selectedImg);
  }

    const uploadBannerToStorage = async () => {
      let url;
      try {
        const uploadPath = `${userData.uid}/images/${Date.now()} ${bannerImg?.name}}`; 
        const storageRef = ref(storage, uploadPath); 
        const snapshot = await uploadBytes(storageRef, bannerImg!)
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
  const addBannerToDb = async (data: IFormInput) => {   
    const url = await uploadBannerToStorage();  
    console.log({
        url: url,
        type: selectedBannerType.type,
        refId: data.refId
      });
    
    try {
      await addDoc(collection(firestore, "banners"),{
        url: url,
        type: selectedBannerType.type,
        refId: data.refId
      });

      toast.success('Banner added successfully ', {
          duration: 1500,
          position: 'top-center',
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          }
      });
      setBannerImg(null)
      } catch (e) {
        const errorObj = e as FirebaseError      
        toast.error(`${errorObj.message}`, {
          duration: 4000,
          position: 'top-center',
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          }
        })
      } finally{
        setIsLoading(false)
        clearInput();
      }
    }




    // const deleteDoce = async() => {
    //   try {
    //      const docRef = await deleteDoc(doc(firestore, "banners","tvnbV3ox6U3vLFmTzs66"))
    //       console.log("Document written with ID: ",docRef);
    //     } catch (error) {
    //       console.log("Error adding document: ",error);
    //   }
    // }

   
  
 const renderBannerForm = BANNER_FORM.map((input, idx) => {
    return (
      <div key={idx}>
          <label className='text-gray-700 mb-[1px] font-medium text-sm'>Reference ID</label>
          <Input placeholder={input.placeholder}  
            type={input.type}
            {...register(input.name, input.validation)}  
            />
            {errors[input.name] && <InputErrorMesaage msg={errors[input.name]?.message} />}
           
        </div>
    )
 
  })
  return (
    <section className="max-w-2xl mx-auto">
        <h2 className="text-center mb-4 text-3xl font-semibold">Add Banner</h2>
        <form className="space-y-4"  onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col space-y-2'>
            <label className='text-gray-700 mb-[1px] font-medium text-sm'  htmlFor="file_input">Upload file</label>
            <input required ref={fileInputRef} onChange={onInputFileChangeHandler} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="file_input" type="file" />            
            {bannerError && <InputErrorMesaage msg={bannerError} />}
          </div>
          <Select selected={selectedBannerType} setSelected={setSelectedBannerType}/>
          {renderBannerForm}
          <Button fullWidth isLoading={isLoading}>
            Add Banner
          </Button>
        </form>
    </section>

  );
};

export default HomePage;
