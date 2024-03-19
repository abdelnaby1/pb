import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { addProductsSchema } from "../../validation";
import Button from "../UI/Button";
import { useState } from "react";
import { PRODUCTS_FORM } from "../../data";
import Input from "../UI/Input";
import InputErrorMesaage from "../InputErrorMesaage";
import toast from "react-hot-toast";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../../firebase/config";

const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;

interface IProps {
  onClose: () => void;
}
interface IProducts {
  name_en: string;
  name_ar: string;
  cat_id: number;
}
const VerticalProductsForm = ({ onClose }: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IProducts>({ resolver: yupResolver(addProductsSchema) });

  const onProductsSubmit: SubmitHandler<IProducts> = async (data) => {
    try {
      setIsLoading(true);
      const docRef = await addDoc(collection(firestore, "widgets"), {
        ...data,
        component_type: "Vertical_Products",
      });
      toast.success("Vertical Products Widget added successfully ", {
        duration: 1500,
        position: "top-center",
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fit-content",
        },
      });
    } catch (error) {
      toast.error("Someting went wrong", {
        duration: 4000,
        position: "top-center",
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fit-content",
        },
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const renderBrandsForm = PRODUCTS_FORM.map((input, idx) => {
    return (
      <div key={idx} className="flex flex-col">
        <Input
          placeholder={input.placeholder}
          type={input.type}
          {...register(input.name, input.validation)}
        />
        {errors[input.name] && (
          <InputErrorMesaage msg={errors[input.name]?.message} />
        )}
      </div>
    );
  });
  return (
    <div className="mt-5">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Add Vertical Products Widget
      </h2>
      <form className="space-y-3" onSubmit={handleSubmit(onProductsSubmit)}>
        {renderBrandsForm}

        <Button fullWidth isLoading={isLoading}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default VerticalProductsForm;
