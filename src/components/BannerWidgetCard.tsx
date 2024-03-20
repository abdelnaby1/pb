import { IBannerWidget } from "../interfaces";
import Button from "./UI/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "../App.css";
import { Navigation } from "swiper/modules";
import Image from "./UI/Image";
interface IProps {
  widget: IBannerWidget;
  //   openEditModal: () => void;
  //   setProductToEditIdx: (value: number) => void;
  //   idx: number;
  //   openDeleteModal: () => void;
}
const BannerWidgetCard = ({ widget }: IProps) => {
  const { name_en, name_ar, component_type, url_en, url_ar, ref_type } = widget;
  const onRemove = () => {
    // openDeleteModal();
    // setProductToEditIdx(idx);
  };
  return (
    <div className="max-h-fit mx-auto md:mx-0 border rounded-md p-2 flex flex-col">
      <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
        <SwiperSlide>
          <Image imageUrl={url_en} alt={component_type} />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <Image imageUrl={url_ar} alt={component_type} />
        </SwiperSlide>
      </Swiper>
      <h3>
        Widget Type:{" "}
        <span className="text-red-950 textbo font-bold">{component_type}</span>
      </h3>
      <h3>
        Name in Enlgish:{" "}
        <span className="text-red-950 textbo font-bold">{name_en}</span>
      </h3>
      <h3>
        Name in Arabic:{" "}
        <span className="text-red-950 textbo font-bold">{name_ar}</span>
      </h3>
      <h3>
        Reference Type:{" "}
        <span className="text-red-950 textbo font-bold">{ref_type}</span>
      </h3>

      <div className="flex items-center justify-between space-x-2">
        <Button variant={"danger"} fullWidth onClick={onRemove}>
          Remove
        </Button>
      </div>
    </div>
  );
};

export default BannerWidgetCard;
