import { useState } from "react"
import Button from "../UI/Button"
import Input from "../UI/Input"
import { SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { BRANDS_FORM } from "../../data"
import InputErrorMesaage from "../InputErrorMesaage"
import { addBrandSchema } from "../../validation"
import toast from "react-hot-toast"
import { arrayUnion, doc, setDoc } from "firebase/firestore"
import { firestore } from "../../firebase/config"


const storageKey =  "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString): null;

interface IProps{
    onClose: () => void
}
interface IBrands {
    name_en: string,
    name_ar: string,
}
const BrandsForm = ({onClose}:IProps) => {
  const[isLoading,setIsLoading] = useState<boolean>(false)
  const { register, formState: { errors }, handleSubmit } = useForm<IBrands>({resolver: yupResolver(addBrandSchema)})

  const onBrandsSubmit: SubmitHandler<IBrands> = async (data) => {
         try {
            setIsLoading(true)
            const widgetsRef = doc(firestore, `${userData.uid}`, "widgets");
            await setDoc(widgetsRef,{data: arrayUnion({...data,component_type:"Brands"})},{merge:true})
            toast.success('Brands Widget added successfully ', {
                duration: 1500,
                position: 'top-center',
                style: {
                    backgroundColor: "black",
                    color: "white",
                    width: "fit-content",
                }
            });
        }catch(error){
        toast.error('Someting went wrong', {
          duration: 4000,
          position: 'top-center',
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          }
        })    
        }finally{
            setIsLoading(false)
            onClose();        

        }
        
  }
  const renderBrandsForm = BRANDS_FORM.map((input, idx) => {
    return (
        <div key={idx} className="flex flex-col">
            <Input placeholder={input.placeholder}  
                type={input.type}
                {...register(input.name, input.validation)}  
              />
              {errors[input.name] && <InputErrorMesaage msg={errors[input.name]?.message} />}
                
        </div>
    )
  })
  return (
      <div className="mt-5">
        <h2 className="text-center mb-4 text-3xl font-semibold">Add Brands Widget</h2>
        <form className="space-y-3" onSubmit={handleSubmit(onBrandsSubmit)}>
            {renderBrandsForm}
                  
            <Button fullWidth isLoading={isLoading}>
                      Submit
            </Button>
          </form> 
        </div>
  )
}

export default BrandsForm