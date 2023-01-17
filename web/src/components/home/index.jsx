import './index.css';

import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import ImageIcon from '@mui/icons-material/Image';
import { GlobalContext } from '../../context/context';

import {
    TextField, Button, Grid
} from '@mui/material'

import { useState, useEffect, useContext } from 'react';
import Search from './components/Search';



const Home = () => {

    let { state, dispatch } = useContext(GlobalContext);

    const [isPosting, setIsPosting] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);
    const [responsePosts, setResponsePosts] = useState([]);
    const [load, setLoad] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingData, setEditingData] = useState({});


    useEffect(() => {

        axios.get(`${state.baseURL}/posts`, {
            withCredentials: true
        })
            .then((res) => {
                console.log('response "all posts" =========>: ', res.data);
                setResponsePosts(res.data.data.reverse());
                console.log('responsePosts :', responsePosts);
            })
            .catch((err) => {
                console.log('Error: ', err);
            })

    }, [load])

    const deletePost = (id) => {

        console.log(' This is deletePost');
        console.log(id);

        axios.delete(`${state.baseURL}/post/${id}`, {
            withCredentials: true
        })
            .then((res) => {
                console.log('delete response =====>', res);
                setLoad(!load);
            })
            .catch((err) => {
                console.log('delete Error =====>', err);
            })
    }

    const editPost = (post) => {
        setIsEditing(!isEditing);
        setEditingData(post);

        updateFormik.setFieldValue('postText', post.postText);
    }

    const postFormik = useFormik({
        initialValues: {
            postText: '',
            image: null
        },

        validationSchema:

            yup.object({
                postText: yup
                    .string("Please enter your "),

            }),

        onSubmit: (values) => {
            console.log("values : ", values);
            console.log("Hello");

            let fileInput = document.querySelector('#image');

            console.log('file ===>', fileInput);

            // axios.post(`${state.baseURL}/post`, {
            //     postText: values.postText,
            // }, {
            //     withCredentials: true
            // })
            //     .then((response) => {
            //         console.log('response : ', response.data);
            //         console.log(`data added`);
            //         setResponseMessage(response.data.message)
            //         setIsPosting(false);
            //         setTimeout(() => {
            //             setResponseMessage(null)
            //         }, 10000);
            //         setLoad(!load);

            //         // console.log('responsePosts:====> ' ,responsePosts);
            //     })
            //     .catch((err) => {
            //         console.log(`Error : ===>`, err);
            //     })
        }
    });

    const updateFormik = useFormik({
        initialValues: {
            postText: editingData.postText,
            image: null
        },

        validationSchema:

            yup.object({

                postText: yup
                    .string("Please enter your description")
            }),

        onSubmit: (updateValues) => {

            console.log("updateValues : ======>>>  ", updateValues);
            console.log("this is editing handler");
            setIsEditing(false);

            console.log(' This is update Post');
            console.log(editingData._id);

            axios.put(`${state.baseURL}/post/${editingData._id}`, {
                postText: updateValues.postText
            }, {
                withCredentials: true
            })
                .then((res) => {
                    console.log('edit response =====>', res);
                    setLoad(!load);
                })
                .catch((err) => {
                    console.log('edit Error =====>', err);
                })
        }
    });


    return (
        <div>
            <h1>This is Home </h1>

            <Button
                className='postBtn'
                onClick={() => {
                    setIsPosting(true);
                }}>
                Post
            </Button>

            <Search />

            <div className="postingForm">
                {
                    (isPosting) ?

                        <form className='addForm' onSubmit={postFormik.handleSubmit} >

                            <label htmlFor="image" className='imgUpload'>
                                <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    className='fileInput'
                                    onChange={(e) => {
                                        postFormik.setFieldValue("image", e.currentTarget.files[0]);
                                    }}
                                />
                                <i className='imgIcon'><ImageIcon /></i>
                            </label>

                            <div className="inputDiv">
                                <TextField
                                    variant='outlined'
                                    type="text"
                                    label='Post'
                                    placeholder="Write your post here..."
                                    id="postText"
                                    value={postFormik.values.postText}
                                    onChange={postFormik.handleChange}
                                    error={postFormik.touched.description && Boolean(postFormik.errors.description)}
                                    helperText={postFormik.touched.description && postFormik.errors.description}
                                />
                            </div>


                            <Button type="submit">Save</Button>
                        </form>

                        : null
                }
                <h3>{responseMessage}</h3>
            </div>

            <div className="products">
                {
                    responsePosts.map((eachPost, i) => {
                        // console.log('eachPost:===>', eachPost);

                        return (
                            <div className="eachPost" key={i}>

                                <p> {moment(eachPost.date).fromNow()}</p>

                                <img src={eachPost.image} alt="" />

                                {
                                    (isEditing && eachPost._id === editingData._id) ?

                                        <div className="editingPost">
                                            <form onSubmit={updateFormik.handleSubmit}>

                                                <div className="inputDiv">
                                                    <TextField
                                                        type="text"
                                                        label='Post'
                                                        placeholder="Write something here..."
                                                        id="postText"
                                                        varient="outlined"
                                                        value={updateFormik.values.postText}
                                                        onChange={updateFormik.handleChange}
                                                        error={updateFormik.touched.description && Boolean(updateFormik.errors.description)}
                                                        helperText={updateFormik.touched.description && updateFormik.errors.description}
                                                    />
                                                </div>

                                                <Button type="submit" >Save</Button>
                                            </form>

                                            <Button onClick={() => {
                                                setIsEditing(false);
                                            }}>Cancel</Button>
                                        </div>

                                        :

                                        <div>
                                            <p className="productDescription">{eachPost.postText}</p>

                                            <Button
                                                className="editing"
                                                onClick={() => {
                                                    // setIsEditing(true);
                                                    // setEditingId(eachPost.id)
                                                    editPost(eachPost);
                                                    console.log('editingData ===> ', editingData);
                                                }}
                                            >
                                                Edit
                                            </Button>

                                            <Button className="delete"
                                                onClick={() => {
                                                    deletePost(eachPost._id);
                                                }}>
                                                Delete
                                            </Button>
                                        </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
};


export default Home;