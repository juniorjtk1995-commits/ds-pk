import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { Button } from "./button.js";

describe("Button", () => {
  it("renders a button with the default variant and size", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveClass("bg-primary", "h-9");
  });

  it("applies variant and size classes", () => {
    render(
      <Button variant="outline" size="sm">
        Edit
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass("border-border", "h-8");
  });

  it("lets a consumer className override variant classes", () => {
    render(<Button className="bg-red-500">Save</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-red-500");
    expect(button).not.toHaveClass("bg-primary");
  });

  it("renders another element through the Base UI render prop", () => {
    render(
      <Button variant="link" nativeButton={false} render={<a href="/docs" />}>
        Docs
      </Button>,
    );
    const link = screen.getByText("Docs");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveClass("text-primary");
  });

  it("calls onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
