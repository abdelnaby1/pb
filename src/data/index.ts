import { IBanner, IBannerInput, ILoginInput } from "../interfaces";

export const bannerTypes: IBanner[] = [
   {
    type: "default",
    id: 1,
  },
  {
    type: "product",
    id: 2,
  },
  {
    type: "category", 
    id: 3,
  }

]

export const LOGIN_FORM: ILoginInput[] = [
     {
        name: 'email',
        placeholder: 'Email',
        type: 'text',
        validation: { required: true, minLength: 8}
    },
        {
        name:'password',
        placeholder: 'Password',
        type: 'password',
        validation: { required: true, minLength: 6 }
    },
]
export const BANNER_FORM: IBannerInput[] = [
        {
        name: 'refId',
        placeholder: 'Reference Id',
        type: 'number',
        validation: { required: true}
    },
]
