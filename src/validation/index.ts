import * as yup from "yup"


export const loginSchema = yup
  .object({
    email: yup.string().required("email is required.").email(),
    password: yup.string().required("password is required.").min(6,"password must be at least 6 characters.")
  })
  .required()

  export const addBannerSchema = yup
  .object({
    refId: yup.number()
      .typeError('Reference Id must be a number').
      positive("Reference Id must be a valid number").integer()
  })
  .required()