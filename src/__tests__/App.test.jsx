import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import App from "../App.jsx";

const setup = async () => {
  const user = userEvent.setup();
  render(<App />);
  return { user };
};

beforeEach(() => {
  vi.spyOn(window, "alert").mockImplementation(() => {});
});

afterEach(() => {
  window.alert.mockRestore();
});

it("renders header and switches between views", async () => {
  const { user } = await setup();
  expect(screen.getByText("Point of Sale System")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /sales monitoring/i }));
  expect(screen.getByText("Daily Sales Summary")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /product management/i }));
  expect(screen.getByText("Add New Product")).toBeInTheDocument();
});

it("validates and adds new product", async () => {
  const { user } = await setup();
  await user.click(screen.getByRole("button", { name: /product management/i }));

  await user.click(screen.getByRole("button", { name: /add product/i }));
  expect(window.alert).toHaveBeenCalledWith(
    "Please fill in all required fields",
  );

  await user.type(screen.getByLabelText(/product name/i), "Test Item");
  await user.type(screen.getByLabelText(/price/i), "12.5");
  await user.type(screen.getByLabelText(/barcode/i), "123456");
  await user.type(screen.getByLabelText(/category/i), "Snacks");
  await user.click(screen.getByRole("button", { name: /add product/i }));

  expect(screen.getByText("Test Item")).toBeInTheDocument();
  expect(window.alert).toHaveBeenCalledWith("Product added successfully!");
});

it("adds to cart, updates quantity, and removes item", async () => {
  const { user } = await setup();
  await user.click(screen.getByTestId("product-card-P001"));

  const cartItem = screen.getByTestId("cart-item-P001");
  expect(within(cartItem).getByText("White Bread")).toBeInTheDocument();

  await user.click(screen.getByLabelText(/increase quantity for white bread/i));
  expect(within(cartItem).getByText("2")).toBeInTheDocument();

  await user.click(screen.getByLabelText(/decrease quantity for white bread/i));
  expect(within(cartItem).getByText("1")).toBeInTheDocument();

  await user.click(screen.getByLabelText(/remove white bread/i));
  expect(screen.getByText("Cart is empty")).toBeInTheDocument();
});

it("processes payment and shows receipt", async () => {
  const { user } = await setup();
  await user.click(screen.getByTestId("product-card-P001"));

  await user.click(screen.getByRole("button", { name: /complete payment/i }));
  expect(window.alert).toHaveBeenCalledWith("Insufficient payment amount!");

  const amountInput = screen.getByLabelText(/amount paid/i);
  await user.clear(amountInput);
  await user.type(amountInput, "100");
  await user.click(screen.getByRole("button", { name: /complete payment/i }));

  expect(screen.getByText("Official Receipt")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: /close/i }));
  expect(screen.queryByText("Official Receipt")).not.toBeInTheDocument();
});

it("shows sales monitoring stats after a transaction", async () => {
  const { user } = await setup();
  await user.click(screen.getByTestId("product-card-P001"));

  const amountInput = screen.getByLabelText(/amount paid/i);
  await user.clear(amountInput);
  await user.type(amountInput, "100");
  await user.click(screen.getByRole("button", { name: /complete payment/i }));
  await user.click(screen.getByRole("button", { name: /close/i }));

  await user.click(screen.getByRole("button", { name: /sales monitoring/i }));
  expect(screen.getByText("Recent Transactions")).toBeInTheDocument();
  expect(screen.getAllByText(/₱/i).length).toBeGreaterThan(0);
});
