import { ISliderWidget } from "../interfaces";
import Button from "./UI/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "../App.css";
import { Navigation } from "swiper/modules";
import Image from "./UI/Image";
import { Fragment } from "react/jsx-runtime";
import { Modal } from "./UI/Modal";
import WidgetForm from "./forms/WidgetForm";
import { useState } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/config";
import toast from "react-hot-toast";
import { removeBannerFromStorage } from "../firebase/functions";

interface IProps {
  widget: ISliderWidget;
  openDeleteModal: (id: string) => void;
}
const SliderWidgetCard = ({ widget, openDeleteModal }: IProps) => {
  const { component_type, data } = widget;
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [sliderToRemoveIdx, setSliderToRemoveIdx] = useState<number>();
  const onOpenAddBannerModal = () => {
    setIsOpenAddModal(true);
  };
  const onCloseAddBannerModal = () => {
    setIsOpenAddModal(false);
  };
  const onRemove = () => {
    openDeleteModal(widget.id);
  };
  const onCloseDeleteModal = () => {
    setIsOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (idx: number) => {
    setSliderToRemoveIdx(idx);
    setIsOpenDeleteModal(true);
  };
  // console.log("data", data);

  const onOneSliderRemove = async () => {
    try {
      await removeBannerFromStorage(data[sliderToRemoveIdx!].url_en);
      await removeBannerFromStorage(data[sliderToRemoveIdx!].url_ar);

      const sliderRef = doc(firestore, "widgets", widget.id);
      widget.data = data.splice(sliderToRemoveIdx!, 1);
      await updateDoc(sliderRef, {
        data: data,
      });
      toast.success("Slider item deleted successfully", {
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
        duration: 1500,
        position: "top-center",
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fit-content",
        },
      });
    } finally {
      onCloseDeleteModal();
    }
  };

  return (
    <div className="max-h-fit mx-auto md:mx-0 border rounded-md p-2 flex flex-col">
      <div className="flex items-center justify-center relative">
        {data.map((slider, idx) => (
          <Fragment key={slider.name_en}>
            <Swiper
              navigation={true}
              modules={[Navigation]}
              className="mySwiper"
            >
              {data.length > 1 && (
                <div
                  className="absolute top-0 right-0 z-10 cursor-pointer"
                  onClick={() => onOpenDeleteModal(idx)}
                >
                  <RiDeleteBin2Fill fill="#e20000" className="size-6" />
                </div>
              )}
              <Modal
                isOpen={isOpenDeleteModal}
                closeModal={onCloseDeleteModal}
                title={
                  "Are you sure you want to remove this item from your Store?"
                }
                description={
                  "Deleting this item will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
                }
              >
                <div className="flex items-center space-x-3">
                  <Button variant={"danger"} onClick={onOneSliderRemove}>
                    Yes, Delete
                  </Button>
                  <Button variant={"cancel"} onClick={onCloseDeleteModal}>
                    Cancel
                  </Button>
                </div>
              </Modal>
              <SwiperSlide>
                <Image imageUrl={slider.url_en} alt={component_type} />
              </SwiperSlide>
              <SwiperSlide>
                <Image imageUrl={slider.url_ar} alt={component_type} />
              </SwiperSlide>
              <h3>
                Name in Enlgish:{" "}
                <span className="text-red-950 textbo font-bold">
                  {slider.name_en}
                </span>
              </h3>
              <h3>
                Name in Arabic:{" "}
                <span className="text-red-950 textbo font-bold">
                  {slider.name_ar}
                </span>
              </h3>
              <h3>
                Reference Type:{" "}
                <span className="text-red-950 textbo font-bold">
                  {slider.ref_type}
                </span>
              </h3>
            </Swiper>
          </Fragment>
        ))}
      </div>

      <h3 className="text-center">
        Widget Type:{" "}
        <span className="text-red-950  font-bold">{component_type}</span>
      </h3>
      <div className="flex items-center justify-between space-x-2">
        <Button variant={"danger"} fullWidth onClick={onRemove}>
          Remove
        </Button>
        <Button variant={"default"} fullWidth onClick={onOpenAddBannerModal}>
          Edit
        </Button>
      </div>
      <Modal
        isOpen={isOpenAddModal}
        closeModal={onCloseAddBannerModal}
        title="Add another Banner to the Slider"
      >
        <WidgetForm
          onCloseModal={onCloseAddBannerModal}
          sliderAction="Update"
          sliderId={widget.id}
          type={"Slider"}
        />
      </Modal>
    </div>
  );
};

export default SliderWidgetCard;
