import {
  DocumentData,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "../firebase/config";
import { useEffect, useState } from "react";
import BrandsWidgetCard from "./BrandsWidgetCard";
import ProductsWidgetCard from "./ProductsWidgetCard";
import {
  IBannerWidget,
  IBrandsWidget,
  IProductsWidget,
  ISingleSliderWidget,
  ISliderWidget,
} from "../interfaces";
import BannerWidgetCard from "./BannerWidgetCard";
import SliderWidgetCard from "./SliderWidgetCard";
import Button from "./UI/Button";
import { Modal } from "./UI/Modal";
import toast from "react-hot-toast";
import {
  removeBannerFromStorage,
  removeSliderrFromStorage,
} from "../firebase/functions";

const WidgetsList = () => {
  const [widgets, setWidgets] = useState<{ id: string; data: DocumentData }[]>(
    []
  );
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

      const arr: { id: string; data: DocumentData }[] = [];
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        const widget = {
          id: doc.id,
          data: doc.data(),
        };
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
      if (
        widgetToDeleteId &&
        widgetToDelete?.data.component_type === "Banner"
      ) {
        //deleteing images
        await removeBannerFromStorage(widgetToDelete.data.url_en);
        await removeBannerFromStorage(widgetToDelete.data.url_ar);
        await deleteDoc(doc(firestore, "widgets", widgetToDeleteId));
        setWidgets(updatedWidgets);
      } else if (
        widgetToDeleteId &&
        widgetToDelete?.data.component_type === "Slider"
      ) {
        //deleteing images
        const urls: string[] = [];
        widgetToDelete.data.data.map((w: ISingleSliderWidget) => {
          urls.push(w.url_en);
          urls.push(w.url_ar);
        });
        await removeSliderrFromStorage(urls);
        await deleteDoc(doc(firestore, "widgets", widgetToDeleteId));
        setWidgets(updatedWidgets);
      } else if (widgetToDeleteId) {
        await deleteDoc(doc(firestore, "widgets", widgetToDeleteId));
        setWidgets(updatedWidgets);
      }
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

  const renderWidgets = widgets.map((widget) => {
    if (widget.data.component_type === "Brands") {
      const brandsWidget: IBrandsWidget = {
        id: widget.id,
        component_type: widget.data.component_type,
        name_ar: widget.data.name_ar,
        name_en: widget.data.name_en,
      };
      return (
        <BrandsWidgetCard
          openDeleteModal={() => onOpenDeleteModal(widget.id)}
          key={widget.id}
          widget={brandsWidget}
        />
      );
    }
    if (widget.data.component_type.includes("Products")) {
      const productsWidget: IProductsWidget = {
        id: widget.id,
        component_type: widget.data.component_type,
        name_ar: widget.data.name_ar,
        name_en: widget.data.name_en,
        cat_id: widget.data.cat_id,
      };
      return (
        <ProductsWidgetCard
          openDeleteModal={() => onOpenDeleteModal(widget.id)}
          key={widget.id}
          widget={productsWidget}
        />
      );
    }
    if (widget.data.component_type.includes("Banner")) {
      const bannerWidget: IBannerWidget = {
        id: widget.id,
        component_type: widget.data.component_type,
        name_ar: widget.data.name_ar,
        name_en: widget.data.name_en,
        url_en: widget.data.url_en,
        url_ar: widget.data.url_ar,
        ref_type: widget.data.ref_type,
      };
      return (
        <BannerWidgetCard
          openDeleteModal={() => onOpenDeleteModal(widget.id)}
          key={widget.id}
          widget={bannerWidget}
        />
      );
    }
    if (widget.data.component_type.includes("Slider")) {
      const sliderWidget: ISliderWidget = {
        id: widget.id,
        component_type: widget.data.component_type,
        data: widget.data.data,
      };
      return (
        <SliderWidgetCard
          openDeleteModal={() => onOpenDeleteModal(widget.id)}
          key={widget.id}
          widget={sliderWidget}
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
