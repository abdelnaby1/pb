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
      name: 'name_en',
      placeholder: 'Name in English',
      type: 'string',
      validation: { required: true}
    },
    {
      name: 'name_ar',
      placeholder: 'Name in Arabic',
      type: 'string',
      validation: { required: true}
    },
    //      {
    //   name: 'ref_id',
    //   placeholder: 'Reference Id',
    //   type: 'number',
    //   validation: { required: true}
    // },

 
]

    // {
    //   name: 'url_en',
    //   placeholder: 'Url in English',
    //   type: 'string',
    //   validation: { required: true}
    // },
    // {
    //   name: 'url_ar',
    //   placeholder: 'Url in Arabic',
    //   type: 'string',
    //   validation: { required: true}
    // },
    //     {
    //   name: 'ref_type',
    //   placeholder: 'Reference Type',
    //   type: 'string',
    //   validation: { required: true}
    // },
    //    {
    //   name: 'ref_id',
    //   placeholder: 'Reference Id',
    //   type: 'number',
    //   validation: { required: true}
    // },