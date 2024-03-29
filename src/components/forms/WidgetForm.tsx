import BannerForm from "./Banner";
import SliderForm from "./Slider";
import SimpleTypeForm from "./SimpleType";
import ProductsForm from "./Products";
import VerticalProductsForm from "./VerticalProducts";
interface IProps {
  type: string;
  onCloseModal: () => void;
  sliderAction?: "Add" | "Update";
  sliderId?: string;
}
interface Types {
  [Banner: string]: JSX.Element;
  Slider: JSX.Element;
  Simple: JSX.Element;
  Products: JSX.Element;
  ["Vertical Products"]: JSX.Element;
}

const WidgetForm = ({
  type,
  onCloseModal,
  sliderAction = "Add",
  sliderId,
}: IProps) => {
  const widgetTypeForm: Types = {
    Banner: <BannerForm onClose={onCloseModal} />,
    Slider: (
      <SliderForm
        sliderAction={sliderAction}
        sliderId={sliderId}
        onClose={onCloseModal}
      />
    ),
    Simple: <SimpleTypeForm onClose={onCloseModal} />,
    Products: <ProductsForm onClose={onCloseModal} />,
    ["Vertical Products"]: <VerticalProductsForm onClose={onCloseModal} />,
  };
  return <div>{widgetTypeForm[type]}</div>;
};

export default WidgetForm;
