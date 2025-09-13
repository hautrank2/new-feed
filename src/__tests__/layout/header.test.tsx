import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "~/components/layouts/header";

describe("Header", () => {
  it("renders Sign in button when no session", () => {
    render(<Header session={null} />);

    // Nút Sign in phải xuất hiện
    const signInBtn = screen.getByRole("button", { name: /sign in/i });
    expect(signInBtn).toBeInTheDocument();
  });

  it("renders user info when session exists", () => {
    const fakeSession = {
      user: {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        image: "https://picsum.photos/200",
        username: "john",
      },
      expires: "2099-01-01T00:00:00.000Z",
    };

    render(<Header session={fakeSession} />);

    // Tên user xuất hiện
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Avatar phải có alt = user name
    expect(screen.getByAltText("John Doe")).toBeInTheDocument();

    // Có label để mở menu user
    expect(
      screen.getByRole("button", { name: /open user menu/i })
    ).toBeInTheDocument();
  });
});
