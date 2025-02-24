import { useFormik } from "formik";
import { TheNewsIcon } from "../../assets/svg/the-news-icon";
import { initialLoginValues, loginSchema } from "../../schemas/login.schema";
import { useNavigate } from "react-router";
import { useUser } from "@/contexts/user-context";
import axios from "axios";
import { toast } from "react-toastify";
import api from "@/service/api";
import { useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Login() {
    const navigate = useNavigate()
    const { setUser } = useUser()
    const [loading, setLoading] = useState(false);

    async function getUserInformation(email: string) {
        setLoading(true);
        if (email === "admin@thenews.com") {
            navigate("/admin/users")
            return
        }
        try {
            const response = await api.get(`/user?email=${email}`);
            setUser(response.data)
            navigate(`/${email}`);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                console.error("Axios error:", e.response?.data || e.message);
                toast.error(e.response?.data?.message || "Aconteceu um erro inesperado, tente novamente mais tarde");
            } else {
                console.error("Unexpected error:", e);
                toast.error("Aconteceu um erro inesperado, tente novamente mais tarde");
            }
        } finally {
            setLoading(false);
        }
    }

    const loginForm = useFormik({
        initialValues: initialLoginValues,
        validationSchema: loginSchema,
        onSubmit: (values) => {
            getUserInformation(values.email)
        }
    })

    return (
        <div className="w-full h-dvh flex justify-center items-center p-10 bg-zinc-200 md:p-0">
            <main className="w-ful flex flex-col items-center justify-center gap-12 sm:w-8/12 md:w-1/2 md:p-10 lg:w-5/12 lg:gap-9 lg:items-start xl:p-24 2xl:p-38">
                <TheNewsIcon width={314} height={72} />
                <div className="w-full flex flex-col items-center gap-8">
                    <p className="text-zinc-900 leading-6 text-center lg:text-left 2xl:text-lg ">
                        Bem-vindo(a)! Entre com seu e-mail e acompanhe seu streak de leitura – descubra suas conquistas e mantenha o ritmo!
                    </p>
                    <form onSubmit={loginForm.handleSubmit} className="w-full flex flex-col items-center gap-7 lg:items-end">
                        <div className="w-full flex flex-col lg:gap-0.5 2xl:gap-1">
                            <label htmlFor="email" className="font-medium leading-6 text-zinc-900 2xl:text-lg">Email</label>
                            <Input
                                type="email"
                                name="email"
                                value={loginForm.values.email}
                                onChange={loginForm.handleChange}
                                className="bg-zinc-50 outline-none focus-visible:ring-0 focus-visible:border-none h-10 2xl:h-11 2xl:text-lg"
                                placeholder="email@exemplo.com"
                            />
                            {loginForm.touched.email && loginForm.errors.email ? (
                                <span className="text-red-500 text-xs font-medium pt-1 2xl:text-sm 2xl:pt-0">{loginForm.errors.email}</span>
                            ) : null}
                        </div>
                        <button type="submit" className="w-full h-10 rounded-lg flex gap-1 items-center justify-center py-2.5 bg-supernova-400 leading-6 font-medium xl:w-2/5 cursor-pointer hover:bg-supernova-300 transition-colors disabled:opacity-70 2xl:h-11 2xl:text-lg" disabled={loading}>
                            {loading && <LoaderCircleIcon className="animate-spin" />}
                            Entrar
                        </button>
                    </form>
                </div>
            </main>
            <div className="hidden h-dvh md:w-1/2 md:flex lg:w-7/12 bg-supernova-400" />
        </div>
    )
}