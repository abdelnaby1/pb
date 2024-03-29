import * as yup from "yup"


export const loginSchema = yup
  .object({
    email: yup.string().required("email is required.").email(),
    password: yup.string().required("password is required.").min(6,"password must be at least 6 characters.")
  })
  .required()

export const addBannerSchema = yup.object().shape({
  component_type: yup.string().required("Component Type required"),
  widgetData: yup.object().shape({
    name_en: yup.string().required("Name in English required"),
    name_ar: yup.string().required("Name in Arabic required"),
    url_en: yup.string(),
    url_ar: yup.string(),
    ref_type: yup.string(),
    ref_id: yup.number()
      .typeError('Reference Id must be a number').
      positive("Reference Id must be a valid number").integer("Reference Id must be a valid Id")
  }),
}).required()

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

  export const addSimpeSchema = yup
  .object().shape({
    name_en: yup.string().required("Name in English required"),
    name_ar: yup.string().required("Name in Arabic required"),
    component_type: yup.string().required("Type required"),

  })
  .required()

export const addProductsSchema = yup
  .object().shape({
    name_en: yup.string().required("Name in English required"),
    name_ar: yup.string().required("Name in Arabic required"),
    component_type: yup.string().required("Type required"),
    cat_id: yup.number().optional().typeError('Category Id must be a number')
        .positive("Reference Id must be a valid number").integer("Reference Id must be a valid Id"),
    products_ids: yup.array()
      })
  .required()

  export const addCategoriesSchema = yup
  .object().shape({
    name_en: yup.string().required("Name in English required"),
    name_ar: yup.string().required("Name in Arabic required"),
    component_type: yup.string().required("Type required"),
    categories_ids: yup.array().required("Categories Ids required").min(1,"Categories Ids should be at lteast includes 1 Category")
      })
  .required()
