import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "../pages/login";
import { Home } from "../pages/home";
import { NotFound } from "@/pages/not-found";
import { UsersStatistic } from "@/pages/admin/users";
import { AdminLayout } from "@/pages/admin/layout";
import { NewslettersInformation } from "@/pages/admin/newsletter";

export function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/:email" element={<Home />} />
                <Route path="/admin/users" element={<AdminLayout><UsersStatistic /></AdminLayout>} />
                <Route path="/admin/newsletters" element={<AdminLayout><NewslettersInformation /></AdminLayout>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}