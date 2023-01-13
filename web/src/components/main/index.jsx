import { useState, useContext, useEffect } from "react";
import { GlobalContext } from '../../context/context';
import axios from 'axios';
import Signup from "../signup";
import Login from "../login";
import { Routes, Route, Link, Navigate } from "react-router-dom";


import Home from "../home";
import Profile from "../profile";
import Gallery from "../gallery";
import ChangePassword from "../home/components/ChangePassword";
import ForgetPassword from "../forgetPassword";


///================ Styling ===================================



////=====================================================





const Main = () => {

    let { state, dispatch } = useContext(GlobalContext);

    useEffect(() => {

        const getProfile = async () => {

            try {
                let res = await axios.get(`${state.baseURL}/profile`,
                    // {},
                    {
                        withCredentials: true
                    })

                console.log("useEffect ===>: ", res);

                dispatch({
                    type: 'USER_LOGIN'
                })
                dispatch({
                    type: 'SET_ADMIN',
                    payload: res.data.isAdmin
                });
                dispatch({
                    type: 'SET_USER',
                    payload: res.data.userProfile
                });

            } catch (error) {

                console.log("axios error: ", error);

                // dispatch({
                //     type: 'USER_LOGOUT'
                // })
            }
        }
        getProfile();

    }, [])


    return (
        <div className="page">
            <div className="header">
                <h1>Posting App</h1>

                {
                    (state?.isLogin) ?
                        <nav>
                            <ul>
                                <li><Link to={`/`}>Home</Link></li>
                                <li><Link to={`/profile`}>Profile</Link></li>
                                <li><Link to={`/gallery`}>Gallery</Link></li>
                                <li><Link to={`/change-password`}>Change Password</Link></li>
                                <li
                                    onClick={() => {
                                        axios.post(`${state.baseURL}/logout`, {}, {
                                            withCredentials: true
                                        })
                                            .then((res) => {
                                                console.log('logout respone ===>', res);
                                                dispatch({
                                                    type: 'USER_LOGOUT',
                                                    payload: null
                                                });
                                            })
                                            .catch((err) => {
                                                console.log('logout error ===>', err);
                                            })
                                    }}>
                                    <Link to={`/`}>Logout</Link></li>
                            </ul>
                        </nav>
                        :
                        <nav>
                            <ul>

                                <li>
                                    <Link to={`/signup`}>Signup</Link></li>

                                <li>
                                    <Link to={`/`}>Already have an account</Link></li>

                            </ul>

                        </nav>
                }

            </div>

            {
                (state?.isLogin) ?

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/change-password" element={<ChangePassword />} />
                        <Route path="*" element={<Navigate to={`/`} replace={true} />} />
                    </Routes>

                    :

                    <Routes>

                        <Route path="/signup" element={<Signup />} />
                        <Route path="/" element={<Login />} />
                        <Route path="/forget-password" element={<ForgetPassword />} />
                        <Route path="*" element={<Navigate to={`/`} replace={true} />} />

                    </Routes>
            }

        </div>
    );
}



export default Main;






// ======================================> Imports <========================================================

//============================================================================

// import * as React from 'react';
// import { styled } from '@mui/system';
// import TabsUnstyled from '@mui/base/TabsUnstyled';
// import TabsListUnstyled from '@mui/base/TabsListUnstyled';
// import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
// import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
// import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';

//============================================================================



// ======================================> Functionality <========================================================



    // return (
    //     <TabsUnstyled defaultValue={0}>
    //         <TabsList>
    //             <Tab>Home</Tab>
    //             <Tab>Profile</Tab>
    //             <Tab>Gallery</Tab>
    //         </TabsList>
    //         <TabPanel value={0}><Home /></TabPanel>
    //         <TabPanel value={1}><Profile /></TabPanel>
    //         <TabPanel value={2}><Gallery /></TabPanel>
    //     </TabsUnstyled>

    // )





// ====================================> Style <=========================================================== 
// const blue = {
//     50: '#F0F7FF',
//     100: '#C2E0FF',
//     200: '#80BFFF',
//     300: '#66B2FF',
//     400: '#3399FF',
//     500: '#007FFF',
//     600: '#0072E5',
//     700: '#0059B2',
//     800: '#004C99',
//     900: '#003A75',
// };

// const grey = {
//     50: '#f6f8fa',
//     100: '#eaeef2',
//     200: '#d0d7de',
//     300: '#afb8c1',
//     400: '#8c959f',
//     500: '#6e7781',
//     600: '#57606a',
//     700: '#424a53',
//     800: '#32383f',
//     900: '#24292f',
// };

// const Tab = styled(TabUnstyled)`
//     font-family: IBM Plex Sans, sans-serif;
//     color: #fff;
//     cursor: pointer;
//     font-size: 0.875rem;
//     font-weight: 600;
//     background-color: transparent;
//     width: 100%;
//     padding: 10px 12px;
//     margin: 6px 6px;
//     border: none;
//     border-radius: 7px;
//     display: flex;
//     justify-content: center;
  
//     &:hover {
//       background-color: ${blue[400]};
//     }
  
//     &:focus {
//       color: #fff;
//       outline: 3px solid ${blue[200]};
//     }
  
//     &.${tabUnstyledClasses.selected} {
//       background-color: #fff;
//       color: ${blue[600]};
//     }
  
//     &.${buttonUnstyledClasses.disabled} {
//       opacity: 0.5;
//       cursor: not-allowed;
//     }
//   `;

// const TabPanel = styled(TabPanelUnstyled)(
//     ({ theme }) => `
//     width: 100%;
//     font-family: IBM Plex Sans, sans-serif;
//     font-size: 0.875rem;
//     padding: 20px 12px;
//     background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
//     border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
//     border-radius: 12px;
//     opacity: 0.6;
//     `,
// );

// const TabsList = styled(TabsListUnstyled)(
//     ({ theme }) => `
//     min-width: 400px;
//     background-color: ${blue[500]};
//     border-radius: 12px;
//     margin-bottom: 16px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     align-content: space-between;
//     box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
//     `,
// );
