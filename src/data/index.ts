import { IBanner, ILoginInput } from "../interfaces";

export const bannerTypes: IBanner[] = [
  {
    id: "1",
    type: "product",
  
  },
  {
    id: "2",
    type: "category", 
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
