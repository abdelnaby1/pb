import React from "react";
interface IProps {
  setWidgetType: (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => void;
}

const WidgetsTypes = ({ setWidgetType }: IProps) => {
  return (
    <div className="grid grid-cols-2 gap-1 md:flex items-center justify-between">
      <p
        className="bg-slate-400 rounded-md p-1 cursor-pointer"
        onClick={setWidgetType}
      >
        Banner
      </p>
      <p
        className="bg-slate-400 rounded-md p-1 cursor-pointer"
        onClick={setWidgetType}
      >
        Slider
      </p>
      <p
        className="bg-slate-400 rounded-md p-1 cursor-pointer"
        onClick={setWidgetType}
      >
        Simple
      </p>
      <p
        className="bg-slate-400 rounded-md p-1 cursor-pointer"
        onClick={setWidgetType}
      >
        Products
      </p>
      <p
        className="bg-slate-400 rounded-md p-1 cursor-pointer"
        onClick={setWidgetType}
      >
        Categories
      </p>
    </div>
  );
};

export default WidgetsTypes;
