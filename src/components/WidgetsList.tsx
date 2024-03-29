import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "../firebase/config";
import { useEffect, useState } from "react";
import BrandsWidgetCard from "./SimpleWidgetCard";
import ProductsWidgetCard from "./ProductsWidgetCard";
import { ISingleSliderWidget, IWidget } from "../interfaces";
import BannerWidgetCard from "./BannerWidgetCard";
import SliderWidgetCard from "./SliderWidgetCard";
import Button from "./UI/Button";
import { Modal } from "./UI/Modal";
import toast from "react-hot-toast";
import {
  removeBannerFromStorage,
  removeSliderrFromStorage,
} from "../firebase/functions";

interface IProps {
  widgets: IWidget[];
  setWidgets: (widgets: IWidget[]) => void;
}
const WidgetsList = ({ widgets, setWidgets }: IProps) => {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [widgetToDeleteId, setWidgetToDeleteId] = useState<string | null>();

  const onCloseDeleteModal = () => {
    setWidgetToDeleteId(null);
    setIsOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (id: string) => {
    setWidgetToDeleteId(id);
    setIsOpenDeleteModal(true);
  };
  const getWidgets = async () => {
    try {
      const widgetsRef = collection(firestore, "widgets");
      const querySnapshot = await getDocs(query(widgetsRef, orderBy("order")));

      const arr: IWidget[] = [];
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        const widget = doc.data() as IWidget;
        widget.id = doc.id;

        arr.push(widget);
      });

      setWidgets(arr);
    } catch (error) {
      console.log(error);
    }
  };

  const removeWidgetHandler = async () => {
    const updatedWidgets = widgets.filter((w) => w.id !== widgetToDeleteId);
    const widgetToDelete = widgets.find((w) => w.id === widgetToDeleteId);

    try {
      if (widgetToDeleteId && widgetToDelete?.component_type === "Banner") {
        //deleteing images
        await removeBannerFromStorage(widgetToDelete.widgetData.url_en!);
        await removeBannerFromStorage(widgetToDelete.widgetData.url_ar!);
        await deleteDoc(doc(firestore, "widgets", widgetToDeleteId));
      } else if (
        widgetToDeleteId &&
        widgetToDelete?.component_type === "Slider"
      ) {
        //deleteing images
        const urls: string[] = [];
        widgetToDelete.widgetData.data?.map((w: ISingleSliderWidget) => {
          urls.push(w.url_en);
          urls.push(w.url_ar);
        });
        await removeSliderrFromStorage(urls);
        await deleteDoc(doc(firestore, "widgets", widgetToDeleteId));
      } else if (widgetToDeleteId) {
        await deleteDoc(doc(firestore, "widgets", widgetToDeleteId));
        setWidgets(updatedWidgets);
      }
      setWidgets(updatedWidgets);
      toast.success("Wisget deleted successfully", {
        duration: 1500,
        position: "top-center",
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fit-content",
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Someting went wrong", {
        duration: 1500,
        position: "top-center",
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fit-content",
        },
      });
    } finally {
      setWidgetToDeleteId(null);
      onCloseDeleteModal();
    }
  };

  useEffect(() => {
    getWidgets();
  }, []);

  const renderWidgets = widgets.map((widget: IWidget) => {
    if (
      widget.component_type.includes("brands") ||
      widget.component_type.includes("featured") ||
      widget.component_type.includes("sale")
    ) {
      return (
        <BrandsWidgetCard
          openDeleteModal={() => onOpenDeleteModal(widget.id!)}
          key={widget.id!}
          widget={widget}
        />
      );
    } else if (widget.component_type.includes("products")) {
      return (
        <ProductsWidgetCard
          openDeleteModal={() => onOpenDeleteModal(widget.id!)}
          key={widget.id!}
          widget={widget}
        />
      );
    }
    if (widget.component_type.includes("Banner")) {
      console.log(widget);

      return (
        <BannerWidgetCard
          openDeleteModal={() => onOpenDeleteModal(widget.id!)}
          key={widget.id!}
          widget={widget}
        />
      );
    }
    if (widget.component_type.includes("Slider")) {
      return (
        <SliderWidgetCard
          openDeleteModal={() => onOpenDeleteModal(widget.id!)}
          key={widget.id!}
          widget={widget}
        />
      );
    }
  });

  return (
    <div className="w-4/5 mt-14 mx-auto space-y-4">
      {renderWidgets}
      <Modal
        isOpen={isOpenDeleteModal}
        closeModal={onCloseDeleteModal}
        title={"Are you sure you want to remove this Widget from your Store?"}
        description={
          "Deleting this Widget will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
        }
      >
        <div className="flex items-center space-x-3">
          <Button variant={"danger"} onClick={removeWidgetHandler}>
            Yes, Delete
          </Button>
          <Button variant={"cancel"} onClick={onCloseDeleteModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default WidgetsList;
