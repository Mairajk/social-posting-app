import { useState, useContext } from "react";
import { GlobalContext } from '../../context/context';
import { TextField, Button, Grid } from '@mui/material'
import { useFormik } from "formik"
import * as yup from 'yup';
import axios from 'axios';

const ForgetPassword = () => {

    let { state, dispatch } = useContext(GlobalContext);
    const [isUserFound, setIsUserFound] = useState(false)
    const [message, setMessage] = useState(false)

    //=========================== find user for forget password (formik)   ==============================//   

    const formik = useFormik({
        initialValues: {
            email: "",
        },

        validationSchema:

            yup.object({

                email: yup
                    .string('Enter your email')
                    .required('Email is required')
                    .email("Enter a valid Email ")
                    .min(3, "please enter more then 3 characters ")
                    .max(25, "please enter within 20 characters "),

            }),

        onSubmit: (values, e) => {
            // e.resetForm();
            console.log("values : ", values);

            axios.post(`${state.baseURL}/forget-password/find-account`, {
                email: values.email,
            }, {
                withCredentials: true
            })
                .then((res) => {
                    console.log('response ===>', res);
                    setIsUserFound(true);
                })
                .catch((err) => {
                    console.log('error ===>', err);
                    setMessage(err?.response?.data?.message);
                });
        }
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////


    //======================================== OTP send (formik)   ==========================================//   

    const OTPformik = useFormik({
        initialValues: {
            OTP: "",
            newPassword: "",
        },

        validationSchema:

            yup.object({

                OTP: yup
                    .string('5 digit OTP is required')
                    .required('5 digit OTP is required'),

                newPassword: yup
                    .string('New password is required')
                    .required('New password is required')

            }),

        onSubmit: (values, e) => {
            e.resetForm();
            console.log("values : ", values);

            axios.post(`${state.baseURL}/forget-password/send-email`, {
                OTP: values.OTP,
                newPassword: values.newPassword
            }, {
                withCredentials: true
            })
                .then((res) => {
                    console.log('response ===>', res);
                })
                .catch((err) => {
                    console.log('error ===>', err);
                    setMessage(err?.response?.data?.message);
                });
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div>
            <h1>ForgetPassword</h1>

            {
                (!isUserFound) ?

                    <form action="" onSubmit={formik.handleSubmit}>

                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                        >

                            <TextField
                                margin="dense"
                                variant="outlined"
                                type="email"
                                placeholder="Enter your email"
                                id="email"
                                value={formik.values.email}
                                label='Email'
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />

                            <Button
                                // fullWidth
                                color="primary"
                                variant="contained"
                                type="submit"
                                margin="dense"
                                sx={{ mt: 2 }}
                            >
                                Find your account
                            </Button>

                        </Grid>
                    </form>

                    :

                    <form action="" onSubmit={OTPformik.handleSubmit}>
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                        >

                            <TextField
                                margin="dense"
                                variant="outlined"
                                type="OTP"
                                placeholder="Enter your 5 digit OTP"
                                id="OTP"
                                value={OTPformik.values.OTP}
                                label='OTP'
                                onChange={OTPformik.handleChange}
                                error={OTPformik.touched.OTP && Boolean(OTPformik.errors.OTP)}
                                helperText={OTPformik.touched.OTP && OTPformik.errors.OTP}
                            />

                            <TextField
                                margin="dense"
                                variant="outlined"
                                type="newPassword"
                                placeholder="Enter your new password"
                                id="newPassword"
                                value={OTPformik.values.newPassword}
                                label='New Password'
                                onChange={OTPformik.handleChange}
                                error={OTPformik.touched.newPassword && Boolean(OTPformik.errors.newPassword)}
                                helperText={OTPformik.touched.newPassword && OTPformik.errors.newPassword}
                            />

                            <Button
                                // fullWidth
                                color="primary"
                                variant="contained"
                                type="submit"
                                margin="dense"
                                sx={{ mt: 2 }}
                            >
                                Send OTP
                            </Button>

                        </Grid>
                    </form>
            }
        </div>
    )
}

export default ForgetPassword;