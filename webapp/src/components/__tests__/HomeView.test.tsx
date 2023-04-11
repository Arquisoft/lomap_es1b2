import { getByText, render, screen } from "@testing-library/react";
import HomeView from "../HomeView";

test('check that HomeView not logged in is rendering propertly', async () => {
    render(<HomeView />);
    const element = screen.getByText("¡Bienvenido!");
    expect(element).toBeInTheDocument();
});

