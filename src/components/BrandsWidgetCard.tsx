import React from "react";
import { IBrandsWidget } from "../interfaces";
import Button from "./UI/Button";
interface IProps {
  widget: IBrandsWidget;
  //   openEditModal: () => void;
  //   setProductToEditIdx: (value: number) => void;
  //   idx: number;
  //   openDeleteModal: () => void;
}
const BrandsWidgetCard = ({ widget }: IProps) => {
  const { name_en, name_ar, component_type } = widget;
  const onRemove = () => {
    // openDeleteModal();
    // setProductToEditIdx(idx);
  };
  return (
    <div className="mx-auto md:mx-0 border rounded-md p-2 flex flex-col">
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

      <div className="flex items-center justify-between space-x-2">
        <Button variant={"danger"} fullWidth onClick={onRemove}>
          Remove
        </Button>
      </div>
    </div>
  );
};

export default BrandsWidgetCard;
