import BannerForm from "./Banner";
import SliderForm from "./Slider";
import SimpleTypeForm from "./SimpleType";
import ProductsForm from "./Products";
import CategoriesForm from "./Categories";
import { IWidget } from "../../interfaces";
interface IProps {
  type: string;
  onCloseModal: () => void;
  sliderAction?: "Add" | "Update";
  sliderId?: string;
  setWidgets: (widgets: IWidget[]) => void;
  widgets: IWidget[];
}
interface Types {
  [Banner: string]: JSX.Element;
  Slider: JSX.Element;
  Simple: JSX.Element;
  Products: JSX.Element;
  Categories: JSX.Element;
}

const WidgetForm = ({
  type,
  onCloseModal,
  sliderAction = "Add",
  sliderId,
  setWidgets,
  widgets,
}: IProps) => {
  const widgetTypeForm: Types = {
    Banner: (
      <BannerForm
        onClose={onCloseModal}
        setWidgets={setWidgets}
        widgets={widgets}
      />
    ),
    Slider: (
      <SliderForm
        sliderAction={sliderAction}
        sliderId={sliderId}
        onClose={onCloseModal}
      />
    ),
    Simple: (
      <SimpleTypeForm
        onClose={onCloseModal}
        setWidgets={setWidgets}
        widgets={widgets}
      />
    ),
    Products: (
      <ProductsForm
        onClose={onCloseModal}
        setWidgets={setWidgets}
        widgets={widgets}
      />
    ),
    Categories: (
      <CategoriesForm
        onClose={onCloseModal}
        setWidgets={setWidgets}
        widgets={widgets}
      />
    ),
  };
  return <div>{widgetTypeForm[type]}</div>;
};

export default WidgetForm;
