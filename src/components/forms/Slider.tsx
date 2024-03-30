import { doc, setDoc } from "@firebase/firestore";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { bannerTypes } from "../../data";
import { firestore } from "../../firebase/config";
import { uploadBannerToStorage } from "../../firebase/functions";
import { addBannerSchema } from "../../validation";
import InputErrorMesaage from "../InputErrorMesaage";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Select from "../UI/Select";
import {
  arrayUnion,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { IWidget, IWidgetData } from "../../interfaces";

interface IProps {
  onClose: () => void;
  sliderAction?: "Add" | "Update";
  sliderId?: string;
  widgets?: IWidget[];
  setWidgets?: (widgets: IWidget[]) => void;
}
interface IImgInput {
  banner_img_en: File | null;
  banner_img_ar: File | null;
}
const defaultWidgetData: IWidgetData = {
  name_en: "",
  name_ar: "",
  url_en: "",
  url_ar: "",
  ref_type: "",
};
const defaultBanner: IWidget = {
  widgetData: defaultWidgetData,
  order: 0,
  component_type: "Slider",
};
const SliderForm = ({ onClose, sliderAction, sliderId }: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bannerImgs, setBannerImgs] = useState<IImgInput>({
    banner_img_en: null,
    banner_img_ar: null,
  });
  const [bannerImgEnError, setBannerImgEnError] = useState<string>("");
  const [bannerImgArError, setBannerImgArError] = useState<string>("");
  const [selectedBannerTypeId, setSelectedBannerTypeId] = useState<number>(
    bannerTypes[0].id
  );
  const {
    register,
    setValue,
    unregister,
    clearErrors,
    formState: { errors },
    getValues,
    handleSubmit,
  } = useForm<IWidget>({
    defaultValues: defaultBanner,
    resolver: yupResolver(addBannerSchema),
  });

  const onBannerSubmit: SubmitHandler<IWidget> = async (data) => {
    try {
      setIsLoading(true);
      const widgetsRef = collection(firestore, "widgets_test");
      const querySnapshot = await getDocs(
        query(widgetsRef, orderBy("order", "desc"), limit(1))
      );
      let nextOrder = 1;

      if (!querySnapshot.empty) {
        const lastWidget = querySnapshot.docs[0].data();
        nextOrder = lastWidget.order + 1;
      }
      const sliderDocName =
        sliderAction == "Update" && sliderId
          ? sliderId
          : `slieder-${Date.now() + data.widgetData.name_en}`;

      const sliderRef = doc(firestore, "widgets_test", `${sliderDocName}`);
      data.order = nextOrder;
      if (sliderAction === "Update") {
        await setDoc(
          sliderRef,
          {
            widgetData: { data: arrayUnion(data.widgetData) },
          },
          { merge: true }
        );
      } else {
        await setDoc(
          sliderRef,
          {
            ...data,
            id: uuid() + Date.now(),
            widgetData: { data: arrayUnion(data.widgetData) },
          },
          { merge: true }
        );
      }

      data.id = sliderRef.id;
      toast.success("Slider added successfully ", {
        duration: 1500,
        position: "top-center",
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fit-content",
        },
      });
    } catch (error) {
      console.log(error);
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
  const onInputFileEnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setBannerImgEnError("");

    const selectedImg = e?.target?.files?.[0];

    if (!selectedImg) {
      setBannerImgEnError("Please select file");
      return;
    }
    if (!selectedImg.type.includes("image")) {
      setBannerImgEnError("Please select image file");
      return;
    }
    if (selectedImg.size > 1000000) {
      setBannerImgEnError("Please select smaller file size");
      return;
    }
    setBannerImgEnError("");
    setBannerImgs({ ...bannerImgs, banner_img_en: selectedImg });
  };
  const onInputFileArChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setBannerImgArError("");

    const selectedImg = e?.target?.files?.[0];

    if (!selectedImg) {
      setBannerImgArError("Please select file");
      return;
    }
    if (!selectedImg.type.includes("image")) {
      setBannerImgArError("Please select image file");
      return;
    }
    if (selectedImg.size > 1000000) {
      setBannerImgArError("Please select smaller file size");
      return;
    }
    setBannerImgArError("");
    setBannerImgs({ ...bannerImgs, banner_img_ar: selectedImg });
  };
  const uploadImages = async (e: FormEvent<HTMLFormElement>) => {
    let imageUrls: string[];
    e.preventDefault();
    try {
      setIsLoading(true);
      if (bannerImgs.banner_img_en && bannerImgs.banner_img_ar) {
        const imgs = [
          uploadBannerToStorage(bannerImgs.banner_img_en),
          uploadBannerToStorage(bannerImgs.banner_img_ar),
        ];
        imageUrls = (await Promise.all(imgs)) as string[];
        setValue("widgetData.url_en", imageUrls?.[0]);
        setValue("widgetData.url_ar", imageUrls?.[1]);
        clearErrors("widgetData.url_en");
        clearErrors("widgetData.url_ar");
        toast.success("Imaeges were uploaded successfully ", {
          duration: 1500,
          position: "top-center",
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
      }
    } catch (error) {
      // const errorObj = error as FirebaseError
      toast.error("Someting went wrong", {
        duration: 1500,
        position: "top-center",
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fit-content",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBannerTypeId) {
      const type = bannerTypes.find((type) => type.id === selectedBannerTypeId);
      setValue("widgetData.ref_type", `${type?.type}`);
    }
    if (selectedBannerTypeId === 1) {
      unregister("widgetData.ref_id");
    }
  }, [selectedBannerTypeId, setValue, unregister]);

  return (
    <div className="mt-5">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Add Slider Widget
      </h2>
      {!getValues("widgetData.url_en") && !getValues("widgetData.url_ar") && (
        <form className="space-y-4" onSubmit={uploadImages}>
          <div className="flex flex-row items-center justify-center space-x-2">
            <div className="space-y-2">
              <label
                className="text-gray-700 mb-[1px] font-medium text-sm"
                htmlFor="banner_img_en"
              >
                Choose English Image
              </label>
              <input
                name="banner_img_en"
                required
                onChange={onInputFileEnChangeHandler}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                id="banner_img_en"
                type="file"
              />
              {bannerImgEnError && <InputErrorMesaage msg={bannerImgEnError} />}
            </div>
            <div className="space-y-2">
              <label
                className="text-gray-700 mb-[1px] font-medium text-sm"
                htmlFor="banner_img_ar"
              >
                Choose Arabic Image
              </label>
              <input
                name="banner_img_ar"
                required
                onChange={onInputFileArChangeHandler}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                id="banner_img_ar"
                type="file"
              />
              {bannerImgArError && <InputErrorMesaage msg={bannerImgArError} />}
            </div>
          </div>
          <Button fullWidth isLoading={isLoading}>
            Upload Images
          </Button>
        </form>
      )}
      {getValues("widgetData.url_en") && getValues("widgetData.url_ar") && (
        <form className="space-y-3" onSubmit={handleSubmit(onBannerSubmit)}>
          <Input
            disabled
            type={"text"}
            value={getValues("widgetData.url_en")}
            {...register("widgetData.url_en")}
          />
          <Input
            disabled
            type={"text"}
            value={getValues("widgetData.url_ar")}
            {...register("widgetData.url_ar")}
          />
          <Input
            placeholder={"Name in Enlish"}
            type={"text"}
            {...register("widgetData.name_en")}
          />
          {errors.widgetData?.name_en && (
            <InputErrorMesaage msg={errors.widgetData?.name_en.message} />
          )}
          <Input
            placeholder={"Name in Arabic"}
            type={"text"}
            {...register("widgetData.name_ar")}
          />
          {errors.widgetData?.name_ar && (
            <InputErrorMesaage msg={errors.widgetData?.name_ar.message} />
          )}
          {selectedBannerTypeId !== 1 ? (
            <>
              <Input
                placeholder={"Reference Id"}
                type={"text"}
                {...register("widgetData.ref_id", { required: true })}
              />
              {errors.widgetData?.ref_id && (
                <InputErrorMesaage msg={errors.widgetData?.ref_id.message} />
              )}
            </>
          ) : null}
          <Select
            selectedId={selectedBannerTypeId}
            setSelectedId={setSelectedBannerTypeId}
          />
          <Button fullWidth isLoading={isLoading}>
            Submit
          </Button>
        </form>
      )}
    </div>
  );
};
export default SliderForm;
