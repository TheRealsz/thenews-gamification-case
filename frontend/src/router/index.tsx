import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "../pages/login";
import { Home } from "../pages/home";

export function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/:email" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}