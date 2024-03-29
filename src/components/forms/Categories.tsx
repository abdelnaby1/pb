import React, { useState } from "react";
import InputErrorMesaage from "../InputErrorMesaage";
import toast from "react-hot-toast";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { SubmitHandler, useForm } from "react-hook-form";
import { firestore } from "../../firebase/config";
import { yupResolver } from "@hookform/resolvers/yup";
import { addCategoriesSchema } from "../../validation";
import { v4 as uuid } from "uuid";
import { SaveOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Autocomplete,
  Chip,
} from "@mui/material";

import { capitalizeEveryWord } from "../../lib/utils";
const types = [
  "vertical_categories_by_categories_ids",
  "horizontal_categories_by_categories_ids",
];
interface IProps {
  onClose: () => void;
}
interface ICategories {
  name_en: string;
  name_ar: string;
  categories_ids: string[];
  component_type: string;
}
const defaultValues: ICategories = {
  name_en: "",
  name_ar: "",
  component_type: types[0],
  categories_ids: [],
};
const CategoriesForm = ({ onClose }: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<ICategories>({
    resolver: yupResolver(addCategoriesSchema),
    defaultValues: defaultValues,
  });
  const onTypeChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue("component_type", e.target.value, { shouldValidate: true });
  };
  const onCategoriesSubmit: SubmitHandler<ICategories> = async (data) => {
    console.log(data);

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

  console.log("error", errors);

  return (
    <Box component="section" sx={{ my: 2 }}>
      <Typography variant="h5" color="text.secondry" gutterBottom>
        Add Categories Widget
      </Typography>
      <Box
        onSubmit={handleSubmit(onCategoriesSubmit)}
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
          {types.map((option) => (
            <MenuItem key={option} value={option}>
              {capitalizeEveryWord(option.replace(/_/g, " "))}
            </MenuItem>
          ))}
        </TextField>
        <Autocomplete
          multiple
          id="tags-filled"
          options={defaultValues.categories_ids.map((option) => option)}
          defaultValue={defaultValues.categories_ids}
          freeSolo
          onChange={(e, newval) => {
            setValue("categories_ids", newval);
          }}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="filled"
              label="Ids"
              placeholder="Ids"
            />
          )}
        />

        {errors["categories_ids"] && (
          <InputErrorMesaage msg={`${errors["categories_ids"]?.message}`} />
        )}
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

export default CategoriesForm;
