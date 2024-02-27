import { BannerType, InputBannerNameTypes, InputLoginNameTypes } from "../types";

export interface IBanner {
    id: string
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