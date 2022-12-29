import { render, screen } from "@testing-library/svelte";

import Navigation from "./navigation.svelte";

describe("test navigation.svelte", async () => {
  describe("home page navigation", async () => {
    beforeEach(() => {
      render(Navigation, { pathname: "/" });
    });

    it("should not include a link to itself", async () => {
      const item = screen.queryByRole("link", { name: "johnhooks.io" });
      expect(item).not.toBeInTheDocument();
    });

    it("should include a link to the about page", async () => {
      const link = screen.getByRole("link", { name: /about/ });
      expect(link).toBeInTheDocument();
    });
  });
  describe("about page navigation", async () => {
    beforeEach(() => {
      render(Navigation, { pathname: "/about" });
    });

    it("should not include a link to itself", async () => {
      const item = screen.queryByRole("link", { name: "about" });
      expect(item).not.toBeInTheDocument();
    });

    it("should include a link to the home page", async () => {
      const link = screen.getByRole("link", { name: /johnhooks\.io/ });
      expect(link).toBeInTheDocument();
    });
  });
});
