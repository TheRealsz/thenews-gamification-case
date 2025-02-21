import { useFormik } from "formik";
import { TheNewsIcon } from "../../assets/svg/the-news-icon";
import { initialLoginValues, loginSchema } from "../../schemas/login.schema";

export function Login() {

    const loginForm = useFormik({
        initialValues: initialLoginValues,
        validationSchema: loginSchema,
        onSubmit: (values) => {
            console.log(values)
        }
    })

    return (
        <div className="w-full h-dvh flex justify-center items-center p-10 bg-zinc-200 md:p-0">
            <main className="w-ful flex flex-col items-center justify-center gap-12 sm:w-8/12 md:w-1/2 md:p-10 lg:w-5/12 lg:gap-9 lg:items-start xl:p-24 2xl:p-38">
                <TheNewsIcon width={314} height={72} />
                <div className="w-full flex flex-col items-center gap-8">
                    <p className="text-zinc-900 leading-5 text-center lg:text-left 2xl:text-lg 2xl:leading-6">
                        Bem-vindo(a)! Entre com seu e-mail e acompanhe seu streak de leitura – descubra suas conquistas e mantenha o ritmo!
                    </p>
                    <form onSubmit={loginForm.handleSubmit} className="w-full flex flex-col items-center gap-7 lg:items-end">
                        <div className="w-full flex flex-col lg:gap-0.5 2xl:gap-1">
                            <label htmlFor="email" className="font-medium leading-5 text-zinc-900 2xl:text-lg">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={loginForm.values.email}
                                onChange={loginForm.handleChange}
                                className="w-full h-10 rounded-sm bg-zinc-50 leading-5 py-2.5 px-2 outline-none border border-zinc-300 2xl:h-11 2xl:text-lg" placeholder="email@exemplo.com"
                            />
                            {loginForm.touched.email && loginForm.errors.email ? (
                                <span className="text-red-500 text-xs font-medium pt-1 2xl:text-sm 2xl:pt-0">{loginForm.errors.email}</span>
                            ) : null}
                        </div>
                        <button type="submit" className="w-full h-10 rounded-lg flex items-center justify-center py-2.5 bg-supernova-400 leading-5 font-semibold xl:w-2/5 cursor-pointer hover:bg-supernova-300 transition-colors 2xl:h-11 2xl:text-lg">
                            Entrar
                        </button>
                    </form>
                </div>
            </main>
            <div className="hidden h-dvh md:w-1/2 md:flex lg:w-7/12 bg-supernova-400" />
        </div>
    )
}