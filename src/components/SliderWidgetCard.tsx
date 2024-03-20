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

interface IProps {
  widget: ISliderWidget;
  openDeleteModal: (id: string) => void;
}
const SliderWidgetCard = ({ widget, openDeleteModal }: IProps) => {
  const { component_type, data } = widget;
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  const onOpenAddBannerModal = () => {
    setIsOpenAddModal(true);
  };
  const onCloseAddBannerModal = () => {
    setIsOpenAddModal(false);
  };
  const onRemove = () => {
    openDeleteModal(widget.id);
  };

  return (
    <div className="max-h-fit mx-auto md:mx-0 border rounded-md p-2 flex flex-col">
      <div className="flex items-center justify-center">
        {data.map((slider) => (
          <Fragment key={slider.name_en}>
            <Swiper
              navigation={true}
              modules={[Navigation]}
              className="mySwiper"
            >
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
        <WidgetForm onCloseModal={onCloseAddBannerModal} type={"Slider"} />
      </Modal>
    </div>
  );
};

export default SliderWidgetCard;
