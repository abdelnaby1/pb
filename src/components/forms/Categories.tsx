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
import { IWidget, IWidgetData } from "../../interfaces";
const types = [
  "vertical_categories_by_categories_ids",
  "horizontal_categories_by_categories_ids",
];
interface IProps {
  onClose: () => void;
  setWidgets: (widgets: IWidget[]) => void;
  widgets: IWidget[];
}
const defaultWidgetData: IWidgetData = {
  name_en: "",
  name_ar: "",
  categories_ids: [],
};
const defaultCategories: IWidget = {
  widgetData: defaultWidgetData,
  order: 0,
  component_type: types[0],
};
const CategoriesForm = ({ onClose, widgets, setWidgets }: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<IWidget>({
    resolver: yupResolver(addCategoriesSchema),
    defaultValues: defaultCategories,
  });
  const onTypeChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue("component_type", e.target.value, { shouldValidate: true });
  };
  const onCategoriesSubmit: SubmitHandler<IWidget> = async (data) => {
    console.log(data);

    try {
      setIsLoading(true);
      const widgetsRef = collection(firestore, "WIDGETS");
      const querySnapshot = await getDocs(
        query(widgetsRef, orderBy("order", "desc"), limit(1))
      );
      let nextOrder = 1;

      if (!querySnapshot.empty) {
        const lastWidget = querySnapshot.docs[0].data();
        nextOrder = lastWidget.order + 1;
      }
      const doc = await addDoc(collection(firestore, "WIDGETS"), {
        ...data,
        id: uuid() + Date.now(),
        order: nextOrder,
      });
      data.id = doc.id;
      setWidgets([...widgets, data]);
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
          {...register("widgetData.name_en", { required: true })}
        />
        {errors.widgetData?.name_en && (
          <InputErrorMesaage msg={errors.widgetData?.name_en?.message} />
        )}
        <TextField
          fullWidth
          required
          id="outlined-required"
          label="Name in Arabic"
          {...register("widgetData.name_ar", { required: true })}
        />
        {errors.widgetData?.name_ar && (
          <InputErrorMesaage msg={errors.widgetData?.name_ar?.message} />
        )}
        <TextField
          fullWidth
          id="outlined-select-currency"
          select
          label="Type"
          defaultValue={defaultCategories.component_type}
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
          options={defaultCategories.widgetData?.categories_ids!.map(
            (option) => option
          )}
          defaultValue={defaultCategories.widgetData.categories_ids}
          freeSolo
          onChange={(e, newval) => {
            setValue("widgetData.categories_ids", newval);
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

        {errors.widgetData?.categories_ids && (
          <InputErrorMesaage msg={errors.widgetData?.categories_ids.message} />
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
