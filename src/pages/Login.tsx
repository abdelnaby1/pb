import toast from "react-hot-toast";
import InputErrorMesaage from "../components/InputErrorMesaage";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { LOGIN_FORM } from "../data";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginSchema } from "../validation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

interface IFormInput {
  email: string
  password: string
}
const LoginPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { register, formState: { errors }, handleSubmit } = useForm<IFormInput>({resolver:yupResolver(loginSchema)})
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true)      
    login(data.email,data.password)
      
  }
  const login =  async (usrEmail:string, password: string ) =>{
    try {
      const auth = getAuth();
      const userCredential =  await signInWithEmailAndPassword(auth, usrEmail, password)  
      const {uid,email}= userCredential.user;
      const token = await userCredential.user.getIdToken();
      const loggedInUser = {uid,email,token}
      toast.success('You will navigate to the home page after 2 seconds ', {
          duration: 1500,
          position: 'top-center',
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          }
        });
        localStorage.setItem("loggedInUser",JSON.stringify(loggedInUser))
        setTimeout(() => {
          // navigate("/")
          location.replace("/")
        }, 2000);
         
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
    }finally{
      setIsLoading(false)
    }
    
  }

  const renderLoginForm = LOGIN_FORM.map((input, idx) => {
    return (
      <div key={idx}>
          <Input placeholder={input.placeholder}  
            {...register(input.name, input.validation)}  
            aria-invalid={errors.email ? "true" : "false"}
            />
            {errors[input.name] && <InputErrorMesaage msg={errors[input.name]?.message} />}
           
        </div>
    )
 
  })
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Login to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderLoginForm}

        <Button fullWidth isLoading={isLoading}>Login</Button>
      </form>
    </div>
  );
};

export default LoginPage;
