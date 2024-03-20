import { IProductsWidget } from "../interfaces";
import Button from "./UI/Button";
interface IProps {
  widget: IProductsWidget;
  openDeleteModal: (id: string) => void;
}
const ProductsWidgetCard = ({ widget, openDeleteModal }: IProps) => {
  const { name_en, name_ar, component_type, cat_id } = widget;
  const onRemove = () => {
    openDeleteModal(widget.id);
  };
  return (
    <div className=" mx-auto md:mx-0 border rounded-md p-2 flex flex-col">
      <h3>
        Widget Type:{" "}
        <span className="text-red-950 textbo font-bold">
          {component_type.replace("_", " ")}
        </span>
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
        Products Category ID:{" "}
        <span className="text-red-950 textbo font-bold">{cat_id}</span>
      </h3>

      <div className="flex items-center justify-between space-x-2">
        <Button variant={"danger"} fullWidth onClick={onRemove}>
          Remove
        </Button>
      </div>
    </div>
  );
};

export default ProductsWidgetCard;
