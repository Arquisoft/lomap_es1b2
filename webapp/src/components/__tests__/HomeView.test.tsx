import { getByText, render, screen } from "@testing-library/react";
import HomeView from "../HomeView";

test('check that HomeView not logged in is rendering propertly', async () => {
    const { getByText } = render(<HomeView />);
    expect(getByText("HomeView.welcome")).toBeInTheDocument();
});

