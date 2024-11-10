import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const DynamicForm = ({ fields, onSubmit, colorSchema, loading }) => {
  // Generate initial values for Formik based on field names and initialValue
  const initialValues = fields.reduce((acc, field) => {
    acc[field.name] = field.initialValue || '' // Use initialValue if provided
    return acc
  }, {})

  // Generate Yup validation schema
  const validationSchema = Yup.object(
    fields.reduce((schema, field) => {
      let validator = Yup.string()

      // Required field validation
      if (field.required) {
        validator = validator.required(`${field.name} is required`)
      }

      // String pattern validation
      if (field.pattern) {
        validator = validator.matches(
          new RegExp(field.pattern),
          `${field.name} must match the required pattern`
        )
      }

      // Trim validation
      if (field.trim) {
        validator = validator.trim()
      }

      // Max and Min length or value validation
      if (field.type === 'number') {
        let numValidator = Yup.number()
        if (field.min !== undefined)
          numValidator = numValidator.min(field.min, `${field.name} must be at least ${field.min}`)
        if (field.max !== undefined)
          numValidator = numValidator.max(field.max, `${field.name} must be at most ${field.max}`)
        schema[field.name] = numValidator
      } else {
        if (field.min !== undefined)
          validator = validator.min(
            field.min,
            `${field.name} must be at least ${field.min} characters`
          )
        if (field.max !== undefined)
          validator = validator.max(
            field.max,
            `${field.name} must be at most ${field.max} characters`
          )
      }

      // Lowercase, Uppercase, and AllowSpaces validation
      if (field.lowerCase) {
        validator = validator.matches(
          /^[a-z\s]*$/,
          `${field.name} must contain only lowercase letters`
        )
      }
      if (field.upperCase) {
        validator = validator.matches(
          /^[A-Z\s]*$/,
          `${field.name} must contain only uppercase letters`
        )
      }
      if (false === field.allowSpaces) {
        validator = validator.matches(/^\S*$/, `${field.name} cannot contain spaces`)
      }

      // Special character validation
      if (false === field.allowSpecials) {
        validator = validator.matches(
          /^[A-Za-z0-9\s]*$/,
          `${field.name} cannot contain special characters`
        )
      }
      if (field.ref) {
        validator = validator.oneOf([Yup.ref(field.ref)], `${field.name} must match ${field.ref}`)
      }

      schema[field.name] = validator
      return schema
    }, {})
  )

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  })

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="p-4 rounded"
      style={{ background: colorSchema.formBg }}
    >
      {fields.map((field) => (
        <div key={field.id} className="mb-4">
          <label
            htmlFor={field.id}
            className="block text-sm font-medium"
            style={{ color: colorSchema.inputText }}
          >
            {field.name}
          </label>
          <input
            type={field.type}
            id={field.id}
            name={field.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values[field.name] || ''}
            className="mt-1 p-2 border rounded w-full"
            style={{ borderColor: colorSchema.border }}
            readOnly={field.readonly}
          />
          {formik.touched[field.name] && formik.errors[field.name] ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors[field.name]}</div>
          ) : null}
        </div>
      ))}
      <button
        type="submit"
        className="p-2 mt-4 rounded text-white"
        disabled={loading}
        style={{ background: colorSchema.submitButton }}
      >
        {loading ? 'Handling...' : 'Submit'}
      </button>
    </form>
  )
}

export default DynamicForm
