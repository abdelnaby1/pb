import { IWidget } from "../interfaces";
import Button from "./UI/Button";
interface IProps {
  widget: IWidget;
  openDeleteModal: (id: string) => void;
}
const ProductsWidgetCard = ({ widget, openDeleteModal }: IProps) => {
  const {
    component_type,
    widgetData: { name_en, name_ar, products_ids, cat_id },
  } = widget;
  const onRemove = () => {
    openDeleteModal(widget.id!);
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
      {cat_id && (
        <h3>
          Products Category ID:{" "}
          <span className="text-red-950 textbo font-bold">{cat_id}</span>
        </h3>
      )}
      {products_ids && products_ids.length && (
        <h3>
          ProductsIDs:{" "}
          <span className="text-red-950 textbo font-bold">
            [
            {products_ids.map((id, idx) => {
              return idx === products_ids.length - 1 ? (
                <span key={id}>{`${id}`}</span>
              ) : (
                <span key={id}>{`${id}, `}</span>
              );
            })}
            ]
          </span>
        </h3>
      )}

      <div className="flex items-center justify-between space-x-2">
        <Button variant={"danger"} fullWidth onClick={onRemove}>
          Remove
        </Button>
      </div>
    </div>
  );
};

export default ProductsWidgetCard;
