import * as yup from "yup"


export const loginSchema = yup
  .object({
    email: yup.string().required("email is required.").email(),
    password: yup.string().required("password is required.").min(6,"password must be at least 6 characters.")
  })
  .required()

export const addBannerSchema = yup
  .object().shape({
    name_en: yup.string().required("Name in English required"),
    name_ar: yup.string().required("Name in Arabic required"),
    url_en: yup.string().required("Url in Arabic required"),
    url_ar: yup.string().required("Url in Arabic required"),
    ref_type: yup.string().required("Reference Type is required"),
    ref_id: yup.number()
      .typeError('Reference Id must be a number').
      positive("Reference Id must be a valid number").integer("Reference Id must be a valid Id")
  })
  .required()

  export const addSliderSchema = yup
  .object().shape({
    name_en: yup.string().required("Name in English required"),
    name_ar: yup.string().required("Name in Arabic required"),
    url_en: yup.string().required("Url in Arabic required"),
    url_ar: yup.string().required("Url in Arabic required"),
    ref_type: yup.string().required("Reference Type is required"),
    ref_id: yup.number()
      .typeError('Reference Id must be a number').
      positive("Reference Id must be a valid number").integer("Reference Id must be a valid Id")
  })
  .required()

  export const addBrandSchema = yup
  .object().shape({
    name_en: yup.string().required("Name in English required"),
    name_ar: yup.string().required("Name in Arabic required"),
  })
  .required()

export const addProductsSchema = yup
  .object().shape({
    name_en: yup.string().required("Name in English required"),
    name_ar: yup.string().required("Name in Arabic required"),
    cat_id: yup.number().required("Category ID is required").typeError('Reference Id must be a number')
        .positive("Reference Id must be a valid number").integer("Reference Id must be a valid Id")

  })
  .required()
