import { doc, setDoc, arrayUnion } from "@firebase/firestore";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { bannerTypes, SLIDER_FORM } from "../../data";
import { firestore } from "../../firebase/config";
import { uploadBannerToStorage } from "../../firebase/functions";
import { addBannerSchema } from "../../validation";
import InputErrorMesaage from "../InputErrorMesaage";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Select from "../UI/Select";
import { serverTimestamp } from "firebase/firestore";

const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;
interface IProps {
  onClose: () => void;
}
interface IImgInput {
  [banner_img_en: string]: File;
  banner_img_ar: File;
}
interface ISlider {
  name_en: string;
  name_ar: string;
  url_en: string;
  url_ar: string;
  ref_type: string;
  ref_id?: number;
}
const defaultBanner: ISlider = {
  name_en: "",
  name_ar: "",
  url_en: "",
  url_ar: "",
  ref_type: "",
};
const SliderForm = ({ onClose }: IProps) => {
  const [bannerData, setBannerData] = useState(defaultBanner);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bannerImgs, setBannerImgs] = useState<IImgInput>(null);
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
    handleSubmit,
  } = useForm<ISlider>({
    defaultValues: bannerData,
    resolver: yupResolver(addBannerSchema),
  });

  const onBannerSubmit: SubmitHandler<ISlider> = async (data) => {
    setIsLoading(true);
    setBannerData((prev) => ({ ...prev, ...data }));

    try {
      //need to enhance

      const banner = {
        ...bannerData,
        ...data,
      };
      const sliderRef = doc(firestore, "widgets", `slieder-${data.name_en}`);
      await setDoc(
        sliderRef,
        {
          data: arrayUnion(banner),
          timestampe: serverTimestamp(),
          component_type: "Slider",
        },
        { merge: true }
      );
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
      const imgs = [
        uploadBannerToStorage(bannerImgs.banner_img_en),
        uploadBannerToStorage(bannerImgs.banner_img_ar),
      ];
      imageUrls = (await Promise.all(imgs)) as string[];
      setBannerData({
        ...bannerData,
        url_en: imageUrls?.[0],
        url_ar: imageUrls[1],
      });
      setValue("url_en", imageUrls?.[0]);
      setValue("url_ar", imageUrls?.[1]);
      clearErrors("url_en");
      clearErrors("url_ar");
      toast.success("Imaeges were uploaded successfully ", {
        duration: 1500,
        position: "top-center",
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fit-content",
        },
      });
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
      setValue("ref_type", `${type?.type}`);
    }
    if (selectedBannerTypeId === 1) {
      unregister("ref_id");
    }
  }, [selectedBannerTypeId, setValue, unregister]);

  const renderSliderForm = SLIDER_FORM.map((input, idx) => {
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
        Add Slider Widget
      </h2>
      {!bannerData.url_en && !bannerData.name_ar && (
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
      {bannerData.url_en && bannerData.url_ar && (
        <form className="space-y-3" onSubmit={handleSubmit(onBannerSubmit)}>
          <Input
            disabled
            type={"text"}
            value={bannerData.url_en}
            {...register("url_en")}
          />
          <Input
            disabled
            type={"text"}
            value={bannerData.url_ar}
            {...register("url_ar")}
          />
          {renderSliderForm}
          {selectedBannerTypeId !== 1 ? (
            <>
              <Input
                placeholder={"Reference Id"}
                type={"text"}
                {...register("ref_id", { required: true })}
              />
              {errors["ref_id"] && (
                <InputErrorMesaage msg={errors["ref_id"]?.message} />
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
