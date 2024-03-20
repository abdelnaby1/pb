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

export interface IWidget{
    name_en:string;
    name_ar:string
    component_type: string;
    url_en?: string;
    url_ar?: string;
    ref_type?: string;
    refId?: number
    timestamp:string
}
export interface IProductsWidget{
    name_en:string;
    name_ar:string;
    component_type:string
    cat_id: string;
    timestamp?:string
}
export interface IBrandsWidget{
    name_en:string;
    name_ar:string;
    component_type:string
    timestamp?:string
}
export interface IBannerWidget{
    name_en:string;
    name_ar:string;
    url_en:string;
    url_ar:string;
    ref_type:string
    refId?:string
    component_type:string
    timestamp?:string
}