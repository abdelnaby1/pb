import { DocumentData } from "firebase/firestore";
import { IWidget } from "../interfaces";
import Button from "./UI/Button";
import Image from "./UI/Image";
interface IProps {
  widget: IWidget;
  //   openEditModal: () => void;
  //   setProductToEditIdx: (value: number) => void;
  //   idx: number;
  //   openDeleteModal: () => void;
}
const WidgetCard = ({ widget }: IProps) => {
  const { name_en, name_ar, url_en, url_ar, component_type, ref_type, refId } =
    widget;

  const onRemove = () => {
    openDeleteModal();
    setProductToEditIdx(idx);
  };
  console.log(widget);

  return (
    <div className="max-w-sm md:max-w-lg mx-auto md:mx-0 border rounded-md p-2 flex flex-col">
      <Image imageUrl={url_en} alt={name_en} className="rounded-md mb-2" />
      <Image imageUrl={url_ar} alt={name_ar} className="rounded-md mb-2" />
      <h3>{component_type}</h3>
      {/* <div className="flex items-center justify-between">
        <span className="text-lg text-indigo-600 font-semibold">
          ${numberWithCommas(price)}
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold">{category.name}</span>
          <Image
            imageUrl={category.imageURL}
            alt={category.name}
            className="w-10 h-10 rounded-full mb-2 object-cover"
          />
        </div>
      </div> */}
      <div className="flex items-center justify-between space-x-2">
        {/* <Button className="bg-indigo-700" width="w-full" onClick={onEdit}>
          Edit
        </Button> */}
        <Button className="bg-red-700" fullWidth onClick={onRemove}>
          Remove
        </Button>
      </div>
    </div>
  );
};

export default WidgetCard;
