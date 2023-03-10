import { useState, useContext } from "react";
import { GlobalContext } from "../../context/context";
import { TextField, Button, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate, redirect } from "react-router-dom";

const ForgetPassword = () => {
  let { state, dispatch } = useContext(GlobalContext);
  const [isUserFound, setIsUserFound] = useState(false);
  const [message, setMessage] = useState(false);
  const [user, setUser] = useState("");

  const navigate = useNavigate();
  //=========================== find user for forget password (formik)   ==============================//

  const formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: yup.object({
      email: yup
        .string("Enter your email")
        .required("Email is required")
        .email("Enter a valid Email ")
        .min(3, "please enter more then 3 characters ")
        .max(25, "please enter within 20 characters "),
    }),

    onSubmit: async (values, e) => {
      // e.resetForm();
      console.log("values : ", values);
      setUser(values);

      axios
        .post(
          `${state.baseURL}/forget-password/send-otp`,
          {
            email: values.email,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log("response ===>", res);
          console.log("user ===========>", user);
          setIsUserFound(true);
        })
        .catch((err) => {
          console.log("error ===>", err);
          setMessage(err?.response?.data?.message);
        });
    },
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  //======================================== OTP send (formik)   ==========================================//

  const OTPformik = useFormik({
    initialValues: {
      OTP: "",
      newPassword: "",
    },

    validationSchema: yup.object({
      OTP: yup
        .string("5 digit OTP is required")
        .required("5 digit OTP is required"),

      newPassword: yup
        .string("New password is required")
        .required("New password is required"),
    }),

    onSubmit: (values, e) => {
      e.resetForm();
      console.log("values : ", values);

      axios
        .post(
          `${state.baseURL}/forget-password/verify-otp`,
          {
            email: user.email,
            OTP: values.OTP,
            newPassword: values.newPassword,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log("response ===>", res);

          dispatch({
            type: "USER_LOGIN",
            payload: null,
          });

          dispatch({
            type: "SET_USER",
            payload: res.data.data,
          });

          navigate("/");
          console.log("redirect");
        })
        .catch((err) => {
          console.log("error ===>", err);
          setMessage(err?.response?.data?.message);
        });
    },
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div>
      <h1>ForgetPassword</h1>

      {!isUserFound ? (
        <div>
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
                label="Email"
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
                Send OTP
              </Button>
            </Grid>
          </form>
        </div>
      ) : (
        <div>
          <form action="" onSubmit={OTPformik.handleSubmit}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <h3>{user.email}</h3>

              <TextField
                margin="dense"
                variant="outlined"
                type="OTP"
                placeholder="Enter your 5 digit OTP"
                id="OTP"
                value={OTPformik.values.OTP}
                label="OTP"
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
                label="New Password"
                onChange={OTPformik.handleChange}
                error={
                  OTPformik.touched.newPassword &&
                  Boolean(OTPformik.errors.newPassword)
                }
                helperText={
                  OTPformik.touched.newPassword && OTPformik.errors.newPassword
                }
              />

              <Button
                // fullWidth
                // onClick={() => {
                //   redirect("/");
                //   console.log("redirect");
                // }}
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
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
