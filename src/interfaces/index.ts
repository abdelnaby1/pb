import { BannerType, InputBannerNameTypes, InputBrandsNameTypes, InputLoginNameTypes, InputProductsNameTypes } from "../types";

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