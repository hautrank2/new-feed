/**
 * @jest-environment jest-environment-jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("../../components/feed/FeedCard/hook", () => {
  const fn = jest.fn();
  return { __esModule: true, useFeedCard: fn };
});

import { useFeedCard } from "../../components/feed/FeedCard/hook";

import { FeedCard } from "../../components/feed/FeedCard";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const {
      src,
      alt = "",
      fill,
      width,
      height,
      style,
      objectFit,
      loader,
      quality,
      placeholder,
      blurDataURL,
      sizes,
      priority,
      unoptimized,
      onLoadingComplete,
      ...rest
    } = props;

    const resolvedSrc = typeof src === "string" ? src : src?.src ?? "";
    const resolvedStyle = {
      ...(style || {}),
      ...(objectFit ? { objectFit } : {}),
    };

    return (
      <img
        src={resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        style={resolvedStyle}
        {...rest}
      />
    );
  },
}));

describe("FeedCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when feed is null", () => {
    // 👇 Quan trọng: dùng CHÍNH reference jest.fn() này để set return
    (useFeedCard as jest.Mock).mockReturnValue({
      feed: undefined, // ép nhánh !feed
      loading: false,
      openComment: null,
      handleOpenComment: jest.fn(),
      handleCloseComment: jest.fn(),
      handleToggleHeart: jest.fn(),
    });

    render(<FeedCard feedId="feed-1" />);

    expect(screen.getByTestId("feed-null")).toBeInTheDocument();
  });

  it("renders user info, title, desc and ImageGrid when feed has data", () => {
    const mockFeed = {
      id: "feed-1",
      title: "Hello world",
      desc: "This is a feed description",
      imgs: ["a", "b"],
      tym: ["u1", "u2", "u3"],
      liked: true,
      createdAt: "2099-01-01T00:00:00.000Z",
      user: {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        image: "https://picsum.photos/200",
        username: "john",
      },
    };

    const handleToggleHeart = jest.fn();
    const handleOpenComment = jest.fn();

    (useFeedCard as jest.Mock).mockReturnValue({
      feed: mockFeed,
      loading: false,
      openComment: null,
      handleOpenComment,
      handleCloseComment: jest.fn(),
      handleToggleHeart,
    });

    render(<FeedCard feedId="feed-1" />);

    // User info
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/)).toBeInTheDocument();

    // Title & desc
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByText("This is a feed description")).toBeInTheDocument();

    // Heart button hiển thị đúng count & trạng thái
    expect(screen.getByTestId("heart-btn")).toHaveTextContent("Heart (3)");
  });
});
