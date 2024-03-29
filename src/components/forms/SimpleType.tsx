import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputErrorMesaage from "../InputErrorMesaage";
import { addSimpeSchema } from "../../validation";
import toast from "react-hot-toast";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "../../firebase/config";
import { v4 as uuid } from "uuid";
import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { capitalizeEveryWord } from "../../lib/utils";
import { SaveOutlined } from "@mui/icons-material";
const simpleTypes = [
  "horizontal_brands",
  "vertical_featured_products",
  "horizontal_featured_products",
  "vertical_sale_products",
  "horizontal_sale_products",
];
interface IProps {
  onClose: () => void;
}
interface ISimpleType {
  name_en: string;
  name_ar: string;
  component_type: string;
}
const defaultValues: ISimpleType = {
  name_en: "",
  name_ar: "",
  component_type: simpleTypes[0],
};
const SimpleTypeForm = ({ onClose }: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<ISimpleType>({
    resolver: yupResolver(addSimpeSchema),
    defaultValues: defaultValues,
  });
  const onTypeChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue("component_type", e.target.value, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<ISimpleType> = async (data) => {
    try {
      setIsLoading(true);
      const widgetsRef = collection(firestore, "widgets");
      const querySnapshot = await getDocs(
        query(widgetsRef, orderBy("order", "desc"), limit(1))
      );
      let nextOrder = 1;

      if (!querySnapshot.empty) {
        const lastWidget = querySnapshot.docs[0].data();
        nextOrder = lastWidget.order + 1;
      }
      await addDoc(collection(firestore, "widgets"), {
        ...data,
        id: uuid() + Date.now(),
        order: nextOrder,
      });
      toast.success(
        `${capitalizeEveryWord(
          data.component_type.replace(/_/g, " ")
        )} Widget added successfully`,
        {
          duration: 1500,
          position: "top-center",
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        }
      );
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

  return (
    <Box component="section" sx={{ my: 2 }}>
      <Typography variant="h5" color="text.secondry" gutterBottom>
        Add Simple Widget
      </Typography>
      <Box
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        sx={{
          "& .MuiTextField-root": { my: 1 },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          fullWidth
          required
          id="outlined-required"
          label="Name in Enlgish"
          {...register("name_en", { required: true })}
        />
        {errors["name_en"] && (
          <InputErrorMesaage msg={`${errors["name_en"]?.message}`} />
        )}
        <TextField
          fullWidth
          required
          id="outlined-required"
          label="Name in Arabic"
          {...register("name_ar", { required: true })}
        />
        {errors["name_ar"] && (
          <InputErrorMesaage msg={`${errors["name_ar"]?.message}`} />
        )}
        <TextField
          fullWidth
          id="outlined-select-currency"
          select
          label="Type"
          defaultValue={defaultValues.component_type}
          helperText="Please select type"
          {...register("component_type", { required: true })}
          onChange={onTypeChangeHandler}
        >
          {simpleTypes.map((option) => (
            <MenuItem key={option} value={option}>
              {capitalizeEveryWord(option.replace(/_/g, " "))}
            </MenuItem>
          ))}
        </TextField>

        <LoadingButton
          fullWidth
          loading={isLoading}
          type="submit"
          variant="contained"
          size="large"
          color="primary"
          loadingPosition="start"
          startIcon={<SaveOutlined />}
        >
          Submit
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default SimpleTypeForm;
