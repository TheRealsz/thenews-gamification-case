import * as yup from 'yup';

export const initialLoginValues = {
    email: '',
};

export const loginSchema = yup.object().shape({
    email: yup.string().email().required("O email é obrigatório"),
});

