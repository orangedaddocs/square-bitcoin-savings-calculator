import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("CalculatorPage", () => {
  beforeEach(() => {
    window.location.hash = "#/";
  });

  it("defaults to repeat visits", () => {
    render(<App />);

    expect(screen.getByRole("tab", { name: "Repeat visits" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Repeat customers" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByLabelText("Order total")).toHaveValue("13");
  });

  it("opens repeat customers with seven people a day prepared", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("tab", { name: "Repeat customers" }));

    expect(screen.getByRole("tab", { name: "Repeat visits" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Repeat customers" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByLabelText("People paying with Bitcoin")).toHaveValue("7");
    expect(screen.getByRole("button", { name: "People a day" })).toHaveClass("active");
  });

  it("keeps repeat visits with the original visit frequency controls", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("tab", { name: "Repeat visits" }));

    expect(screen.getByRole("tab", { name: "Repeat visits" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Repeat customers" })).toHaveAttribute("aria-selected", "false");
    expect(screen.queryByRole("tab", { name: "One purchase" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Monthly" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Weekly" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2x/week" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Daily" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "People a day" })).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Numbers" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "QR" })).toHaveAttribute("aria-selected", "false");
    expect(screen.queryByRole("img", { name: "QR code for Why Turn On Bitcoin" })).not.toBeInTheDocument();
  });

  it("shows repeat customer people choices and the QR code without switching tabs", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("tab", { name: "Repeat customers" }));

    expect(screen.getByRole("button", { name: "People a day" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "People a week" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "People a month" })).toBeInTheDocument();
    expect(screen.queryByText(/^people$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\/ month/)).not.toBeInTheDocument();
    expect(screen.queryByText("Uses calendar days and 7-day weeks across a year.")).not.toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: /QR/i })).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "QR code for Why Turn On Bitcoin" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Open the page/i })).toBeInTheDocument();
  });

  it("places repeat controls after order total and before total saved", () => {
    const { container } = render(<App />);

    fireEvent.click(screen.getByRole("tab", { name: "Repeat customers" }));

    const workspace = container.querySelector(".workspace");
    const inputPanel = container.querySelector(".input-panel");
    const results = container.querySelector(".results");
    const peopleControls = container.querySelector(".people-volume-panel");
    const qrPanel = container.querySelector(".qr-panel");

    expect(workspace).toBeInTheDocument();
    expect(inputPanel).toBeInTheDocument();
    expect(results).toBeInTheDocument();
    expect(peopleControls).toBeInTheDocument();
    expect(qrPanel).toBeInTheDocument();
    expect(screen.queryByText("Card fee")).not.toBeInTheDocument();
    expect(screen.queryByText("Bitcoin fee - 2026")).not.toBeInTheDocument();
    expect(screen.queryByText("Bitcoin fee - 2027")).not.toBeInTheDocument();

    const children = Array.from(workspace!.children);
    expect(children.indexOf(inputPanel!)).toBeLessThan(children.indexOf(peopleControls!));
    expect(children.indexOf(peopleControls!)).toBeLessThan(children.indexOf(results!));
    expect(children.indexOf(peopleControls!)).toBeLessThan(children.indexOf(qrPanel!));
  });

  it("shows the coffee regular proof on the Why Bitcoin page", () => {
    window.location.hash = "#/why-bitcoin";
    render(<App />);

    expect(
      screen.getByText(
        "A regular who buys that coffee every day adds up to about $67 over the next 12 full months."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("And where the math gets really interesting: if")).not.toHaveClass("article-accent");
    expect(screen.getByText("seven people a day")).toHaveClass("article-accent");
    expect(screen.getByText("$13 each")).toHaveClass("article-accent");
    expect(screen.getByText("$1,000 a year in fees")).toHaveClass("article-accent");
  });
});
