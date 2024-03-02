import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { ChangeEvent, useState ,useRef, useEffect} from "react";
import Button from "../components/UI/Button";
import Select from "../components/UI/Select";
import { firestore, storage } from "../firebase/config";
import { BANNER_FORM, bannerTypes } from "../data";
import {  IFireBaseBanner } from "../interfaces";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import InputErrorMesaage from "../components/InputErrorMesaage";
import toast from "react-hot-toast";
import { FirebaseError } from "firebase/app";
import Input from "../components/UI/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { addBannerSchema } from "../validation";
import { yupResolver } from "@hookform/resolvers/yup";
import BannerCard from "../components/BannerCard";

const storageKey =  "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString): null;
interface IFormInput {
  refId?: number
}

const TempPage = () => {
  const [bannerImg, setBannerImg] = useState<File | null>(null);
  const [bannerImgError, setBannerImgError] = useState<string>("")

  const [selectedBannerTypeId, setSelectedBannerTypeId] = useState<number>(bannerTypes[0].id);

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [banners,setBanners] = useState<IFireBaseBanner[]>()

  const { register,unregister, formState: { errors }, reset,handleSubmit } = useForm<IFormInput>({resolver:yupResolver(addBannerSchema)})

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true)    
    await addBannerToDb(data);
    clearInput();
    reset()
  }
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearInput = () => {
    fileInputRef && fileInputRef .current && ( fileInputRef.current.value = "");

  }
  const onInputFileChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
      setBannerImgError("");
      const selectedImg = e?.target?.files?.[0];
      if (!selectedImg) {
          setBannerImgError('Please select file');
          return;
      }
      if (!selectedImg.type.includes('image')) {
          setBannerImgError('Please select image file');
          return;
      }
      if (selectedImg.size > 1000000) {
          setBannerImgError('Please select smaller file size');
          return;
      }
      setBannerImgError("");
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
    const bannerObj: IFireBaseBanner = {
        id:"",
        url:"",
        typeId: selectedBannerTypeId,
        refId: selectedBannerTypeId === 1 || data.refId === undefined? null : data.refId,
        userId: userData.uid
    }
    if(url){
      bannerObj.url = url
    }
    try {
      const doc = await addDoc(collection(firestore, "banners"),bannerObj);

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
      bannerObj.id = doc.id;
      console.log(bannerObj);
      banners?.push(bannerObj)
      setBanners(banners)
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

   
  

  useEffect(() => {
     const getBanners = async () => {
    try {
      const bannerDocs: IFireBaseBanner[]= [];
      const q = query(collection(firestore, "banners"),where("userId","==",userData.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.forEach(doc=> {
          const obj = doc.data();
          
          const bannerObj:IFireBaseBanner = {
            id: doc.id,
            userId: obj.userId,
            url: obj.url,
            typeId: obj.typeId,
            refId: obj.refId
          }
          bannerDocs.push(bannerObj);
      })
      setBanners(bannerDocs);
      
            
    } catch (error) {
      console.log(error);
      
    }
  }
    getBanners();

   
  }, [])

   useEffect(() => {
    if (selectedBannerTypeId === 1) {
      unregister("refId");
    }
  }, [selectedBannerTypeId, unregister]);

 
  const renderBannerList = banners?.map((banner: IFireBaseBanner) => 
     <BannerCard key={banner.id} banner={banner}

    />
  )
   const renderBannerForm = BANNER_FORM.map((input, idx) => {
    if(selectedBannerTypeId !==1){
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
    }
    
 
  })
  return (
    <>
      <section className="max-w-2xl mx-auto">
        <h2 className="text-center mb-4 text-3xl font-semibold">Add Banner</h2>
        <form className="space-y-4"  onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col space-y-2'>
            <label className='text-gray-700 mb-[1px] font-medium text-sm'  htmlFor="file_input">Upload file</label>
            <input required ref={fileInputRef} onChange={onInputFileChangeHandler} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="file_input" type="file" />            
            {bannerImgError && <InputErrorMesaage msg={bannerImgError} />}
          </div>
          <Select selectedId={selectedBannerTypeId} setSelectedId={setSelectedBannerTypeId}/>
          {selectedBannerTypeId !== 1 ? renderBannerForm : null}
          <Button fullWidth isLoading={isLoading}>
            Add Banner
          </Button>
        </form>
        
    </section>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 p-2 rounded-md">
        {renderBannerList}
      </div>
    </>
  );
};

export default TempPage;
