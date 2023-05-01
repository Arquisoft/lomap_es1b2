import { getByText, render, screen } from "@testing-library/react";
import HomeView from "../HomeView";

test('check that HomeView not logged in is rendering propertly', async () => {
    render(<HomeView />);
    expect(screen.getByTestId("welcome")).toBeInTheDocument();
});

