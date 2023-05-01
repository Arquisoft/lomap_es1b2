import { getByText, render, screen } from "@testing-library/react";
import AboutUs from "../AboutUs";

describe("AboutUs component", () => {
    it("should render component with expected text content", () => {
      render(<AboutUs />);
  
      const aboutHeading = screen.getByRole("heading", { level: 3 });
      expect(aboutHeading).toHaveTextContent("AboutUs.about");
  
      const team1Role = screen.getByText("AboutUs.team1.role");
      expect(team1Role).toBeInTheDocument();
  
      const team2Role = screen.getByText("AboutUs.team2.role");
      expect(team2Role).toBeInTheDocument();
    });
});

