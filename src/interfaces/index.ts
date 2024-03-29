import { BannerType, InputBannerNameTypes, InputBrandsNameTypes, InputLoginNameTypes, InputProductsNameTypes, InputSliderNameTypes } from "../types";

export interface IBanner {
    id: number
    type: BannerType 
}

export interface ILoginInput{
    name: InputLoginNameTypes;
    placeholder: string;
    type: string;
    validation:{
        required?: boolean;
        minLength?: number;
        pattern?: RegExp
    }
}

export interface IBannerInput{
    name: InputBannerNameTypes;
    placeholder: string;
    type: string;
    validation:{
        required?: boolean;
        minLength?: number;
        pattern?: RegExp
    }
}
export interface ISLIDERInput{
    name: InputSliderNameTypes;
    placeholder: string;
    type: string;
    validation:{
        required?: boolean;
        minLength?: number;
        pattern?: RegExp
    }
}

export interface IBrandInput{
    name: InputBrandsNameTypes;
    placeholder: string;
    type: string;
    validation:{
        required?: boolean;
        minLength?: number;
        pattern?: RegExp
    }
}
export interface IProductsInput{
    name: InputProductsNameTypes;
    placeholder: string;
    type: string;
    validation:{
        required?: boolean;
        minLength?: number;
        pattern?: RegExp
    }
}


export interface IFireBaseBanner{
    id:string
    userId: string;
    url: string;
    typeId: number;
    refId: number | null
}

// export interface IWidget{
//     name_en:string;
//     name_ar:string
//     component_type: string;
//     url_en?: string;
//     url_ar?: string;
//     ref_type?: string;
//     refId?: number
// }
export interface IProductsWidget{
    id:string;
    name_en:string;
    name_ar:string;
    component_type:string
    cat_id: string;
}
export interface IBrandsWidget{
    id:string;
    name_en:string;
    name_ar:string;
    component_type:string
}
export interface IBannerWidget{
    id:string;
    name_en:string;
    name_ar:string;
    url_en:string;
    url_ar:string;
    ref_type:string
    refId?:string
    component_type:string
}
export interface ISingleSliderWidget{
    name_en:string;
    name_ar:string;
    url_en:string;
    url_ar:string;
    ref_type:string
    ref_id?:string
}


export interface IWidgetData {
  name_en: string;
  name_ar: string;
  products_ids?: string[];
  categories_ids?: string[];
  cat_id?: number;
  url_en?: string;
  url_ar?: string;
  ref_type?: string;
  ref_id?: number;
  data?: ISingleSliderWidget[]
}
export interface IWidget {
  id?: string;
  component_type: string;
  order?: number;
  widgetData: IWidgetData;
}