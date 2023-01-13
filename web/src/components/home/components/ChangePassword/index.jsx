import { useState, useContext } from "react";
import { GlobalContext } from '../../../../context/context';


import { useFormik } from "formik"
import * as yup from 'yup';
import axios from 'axios';
import { TextField, Button, Grid } from '@mui/material'

const ChangePassword = () => {

    const [messageResult, setMessageResult] = useState('');

    let { state, dispatch } = useContext(GlobalContext);

    const formik = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            // confirmNewPassword: "",
        },

        validationSchema:

            yup.object({

                currentPassword: yup
                    .string('Enter your email')
                    .required('Enter your current password'),

                newPassword: yup
                    .string("Please enter your new Password")
                    .required("Please enter your new password")

            }),

        onSubmit: (values, e) => {
            console.log("values : ", values);

            const updatePassword = () => {

                axios.post(`${state.baseURL}/update-password`, {
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword
                }, {
                    withCredentials: true
                })
                    .then((res) => {

                        setMessageResult(res?.data?.message);
                        console.log('response ===>', res);
                        e.resetForm();
                    })
                    .catch((err) => {
                        console.log('error ===>', err);

                        setMessageResult(err?.response?.data?.error);
                    });
            };

            updatePassword();
        }
    });


    return (
        <div>
            <h1>ChangePassword</h1>

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
                        type="password"
                        placeholder="Enter your current password"
                        id="currentPassword"
                        value={formik.values.currentPassword}
                        label='Current Password'
                        onChange={formik.handleChange}
                        error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                        helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                    />

                    <TextField
                        margin="dense"
                        variant="outlined"
                        type="password"
                        placeholder="Enter your new password"
                        id="newPassword"
                        value={formik.values.newPassword}
                        label='New Password'
                        onChange={formik.handleChange}
                        error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                        helperText={formik.touched.newPassword && formik.errors.newPassword}
                    />

                    <Button type="submit">Update Password</Button>

                </Grid>

            </form>

            <p>{messageResult}</p>
        </div>
    )
};

export default ChangePassword;