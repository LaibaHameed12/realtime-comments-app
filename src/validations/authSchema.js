// src/validations/authSchema.js
import * as yup from 'yup';

export const registerSchema = yup.object().shape({
    username: yup
        .string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),
    email: yup
        .string()
        .required('Email is required')
        .email('Enter a valid email')
        .lowercase(),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup
        .string()
        .required('Confirm your password')
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .required('Email is required')
        .email('Enter a valid email')
        .lowercase(),
    password: yup.string().required('Password is required'),
});
