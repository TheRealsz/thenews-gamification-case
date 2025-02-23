import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "../pages/login";
import { Home } from "../pages/home";
import { NotFound } from "@/pages/not-found";

export function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/:email" element={<Home />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}