import { IWidget } from "../interfaces";
import Button from "./UI/Button";
interface IProps {
  widget: IWidget;
  openDeleteModal: (id: string) => void;
}
const CategoriesWidgetCard = ({ widget, openDeleteModal }: IProps) => {
  const {
    component_type,
    widgetData: { name_en, name_ar, categories_ids },
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
      {categories_ids && (
        <h3>
          Categories IDs:{" "}
          <span className="text-red-950 textbo font-bold">
            [
            {categories_ids.map((id, idx) => {
              return idx === categories_ids.length - 1 ? (
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

export default CategoriesWidgetCard;
