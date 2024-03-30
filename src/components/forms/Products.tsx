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
import { addProductsSchema } from "../../validation";
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
  "vertical_products_by_category_id",
  "horizontal_products_by_category_id",
  "vertical_products_by_products_ids",
  "horizontal_products_by_products_ids",
];
interface IProps {
  onClose: () => void;
}
interface IProducts {
  name_en: string;
  name_ar: string;
  cat_id?: number;
  products_ids?: string[];
  component_type: string;
}
const defaultValues: IProducts = {
  name_en: "",
  name_ar: "",
  component_type: types[0],
};
const ProductsForm = ({ onClose }: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    handleSubmit,
    setError,
    unregister,
  } = useForm<IProducts>({
    resolver: yupResolver(addProductsSchema),
    defaultValues: defaultValues,
  });
  const onTypeChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue("component_type", e.target.value, { shouldValidate: true });
    if (getValues("component_type").includes("by_products_ids")) {
      unregister("cat_id");
    }
  };
  const onProductsSubmit: SubmitHandler<IProducts> = async (data) => {
    if (
      !data.products_ids?.length &&
      data.component_type.includes("by_products_ids")
    ) {
      setError("products_ids", {
        type: "required",
        message: "Products Ids required",
      });
      return;
    }

    try {
      setIsLoading(true);
      const widgetsRef = collection(firestore, "widgets_test");
      const querySnapshot = await getDocs(
        query(widgetsRef, orderBy("order", "desc"), limit(1))
      );
      let nextOrder = 1;

      console.log(querySnapshot);

      if (!querySnapshot.empty) {
        const lastWidget = querySnapshot.docs[0].data();
        nextOrder = lastWidget.order + 1;
      }
      await addDoc(collection(firestore, "widgets_test"), {
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

  const renderReaminingInputs = () => {
    if (
      getValues("component_type") === "vertical_products_by_products_ids" ||
      getValues("component_type") === "horizontal_products_by_products_ids"
    ) {
      defaultValues.products_ids = [];
      return (
        <Autocomplete
          multiple
          id="tags-filled"
          options={defaultValues.products_ids.map((option) => option)}
          defaultValue={defaultValues.products_ids}
          freeSolo
          onChange={(e, newval) => {
            setValue("products_ids", newval);
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
      );
    } else if (
      getValues("component_type") === "vertical_products_by_category_id" ||
      getValues("component_type") === "horizontal_products_by_category_id"
    ) {
      return (
        <>
          <TextField
            fullWidth
            required
            id="outlined-required"
            label="Category ID"
            {...register("cat_id", { required: true })}
          />
        </>
      );
    }
  };

  return (
    <Box component="section" sx={{ my: 2 }}>
      <Typography variant="h5" color="text.secondry" gutterBottom>
        Add Products Widget
      </Typography>
      <Box
        onSubmit={handleSubmit(onProductsSubmit)}
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
        {renderReaminingInputs()}
        {errors["cat_id"] && (
          <InputErrorMesaage msg={`${errors["cat_id"]?.message}`} />
        )}
        {errors["products_ids"] && (
          <InputErrorMesaage msg={`${errors["products_ids"]?.message}`} />
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

export default ProductsForm;
