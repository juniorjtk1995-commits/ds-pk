import * as React from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils.js"

const textFieldInputVariants = cva(
  "w-full min-w-0 rounded-md border border-input bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 py-1",
        default: "h-9 px-3 py-1",
        lg: "h-10 px-3 py-2",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type TextFieldInputProps = Omit<InputPrimitive.Props, "size"> &
  VariantProps<typeof textFieldInputVariants>

/** Bare styled input. Works alone or inside `TextFieldRoot`. */
function TextFieldInput({
  className,
  size = "default",
  ...props
}: TextFieldInputProps) {
  return (
    <InputPrimitive
      data-slot="text-field-input"
      data-size={size}
      className={cn(textFieldInputVariants({ size, className }))}
      {...props}
    />
  )
}

function TextFieldRoot({ className, ...props }: FieldPrimitive.Root.Props) {
  return (
    <FieldPrimitive.Root
      data-slot="text-field"
      className={cn("group/text-field flex w-full flex-col gap-2", className)}
      {...props}
    />
  )
}

function TextFieldLabel({ className, ...props }: FieldPrimitive.Label.Props) {
  return (
    <FieldPrimitive.Label
      data-slot="text-field-label"
      className={cn(
        "flex items-center gap-1 text-sm leading-none font-medium select-none group-data-invalid/text-field:text-destructive group-data-disabled/text-field:cursor-not-allowed group-data-disabled/text-field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function TextFieldDescription({
  className,
  ...props
}: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Description
      data-slot="text-field-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function TextFieldError({ className, ...props }: FieldPrimitive.Error.Props) {
  return (
    <FieldPrimitive.Error
      data-slot="text-field-error"
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    />
  )
}

type TextFieldProps = Omit<TextFieldInputProps, "name" | "disabled"> & {
  label?: React.ReactNode
  description?: React.ReactNode
  /** Custom error message. Setting it marks the field invalid. */
  error?: React.ReactNode
  /** Icon or element shown inside the input, before the text. */
  startAdornment?: React.ReactNode
  /** Icon or element shown inside the input, after the text. */
  endAdornment?: React.ReactNode
  name?: string
  disabled?: boolean
  invalid?: boolean
  validate?: FieldPrimitive.Root.Props["validate"]
  validationMode?: FieldPrimitive.Root.Props["validationMode"]
  rootClassName?: string
}

/**
 * All-in-one text field: label, input, description and error message.
 *
 * @example
 * <TextField
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   startAdornment={<MailIcon />}
 *   required
 * />
 */
function TextField({
  label,
  description,
  error,
  startAdornment,
  endAdornment,
  name,
  disabled,
  invalid,
  validate,
  validationMode,
  rootClassName,
  className,
  required,
  ...inputProps
}: TextFieldProps) {
  const hasError = error != null && error !== false && error !== ""

  return (
    <TextFieldRoot
      name={name}
      disabled={disabled}
      invalid={invalid ?? (hasError ? true : undefined)}
      validate={validate}
      validationMode={validationMode}
      className={rootClassName}
    >
      {label && (
        <TextFieldLabel>
          {label}
          {required && (
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
          )}
        </TextFieldLabel>
      )}
      <div
        data-slot="text-field-control"
        className="relative flex items-center"
      >
        {startAdornment && (
          <span className="pointer-events-none absolute left-3 flex items-center text-muted-foreground [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            {startAdornment}
          </span>
        )}
        <TextFieldInput
          required={required}
          className={cn(
            startAdornment && "pl-9",
            endAdornment && "pr-9",
            className
          )}
          {...inputProps}
        />
        {endAdornment && (
          <span className="absolute right-3 flex items-center text-muted-foreground [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            {endAdornment}
          </span>
        )}
      </div>
      {description && (
        <TextFieldDescription>{description}</TextFieldDescription>
      )}
      {hasError ? (
        <TextFieldError match>{error}</TextFieldError>
      ) : (
        <TextFieldError />
      )}
    </TextFieldRoot>
  )
}

export {
  TextField,
  TextFieldRoot,
  TextFieldLabel,
  TextFieldInput,
  TextFieldDescription,
  TextFieldError,
  textFieldInputVariants,
}
export type { TextFieldProps, TextFieldInputProps }
