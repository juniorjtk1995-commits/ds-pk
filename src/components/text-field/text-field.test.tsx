import { render, screen } from "@testing-library/react";

import { TextField, TextFieldInput } from "./text-field.js";

describe("TextField", () => {
  it("connects the label and description to the input", () => {
    render(<TextField label="Email" description="We never share it." />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("data-slot", "text-field-input");
    expect(input).toHaveAccessibleDescription("We never share it.");
  });

  it("marks required fields with a hidden asterisk", () => {
    render(<TextField label="Email" required />);
    expect(screen.getByLabelText(/Email/)).toBeRequired();
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  });

  it("shows a custom error and marks the field invalid", () => {
    render(<TextField label="Email" error="Enter a valid email." />);
    expect(screen.getByText("Enter a valid email.")).toHaveAttribute(
      "data-slot",
      "text-field-error",
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("pads the input around adornments", () => {
    render(
      <TextField
        label="Search"
        startAdornment={<span>S</span>}
        endAdornment={<span>E</span>}
      />,
    );
    expect(screen.getByLabelText("Search")).toHaveClass("pl-9", "pr-9");
  });

  it("applies input size classes", () => {
    render(<TextFieldInput aria-label="Code" size="lg" />);
    const input = screen.getByLabelText("Code");
    expect(input).toHaveClass("h-10");
    expect(input).toHaveAttribute("data-size", "lg");
  });
});
