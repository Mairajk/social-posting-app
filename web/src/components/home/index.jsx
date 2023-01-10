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




const Home = () => {

    let { state, dispatch } = useContext(GlobalContext);

    const [isPosting, setIsPosting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);
    const [responsePosts, setResponsePosts] = useState([]);
    const [load, setLoad] = useState(false);
    const [editingData, setEditingData] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState([]);


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
                    .string("Please enter your description")
            }),

        onSubmit: (values) => {
            console.log("values : ", values);
            console.log("Hello");

            const cloudinaryData = new FormData();
            cloudinaryData.append("file", values.image);
            cloudinaryData.append("upload_preset", "social-app_posts-photos");

            cloudinaryData.append("cloud_name", "dzy6qrpp5");
            console.log(cloudinaryData);
            axios.post(`https://api.cloudinary.com/v1_1/dzy6qrpp5/image/upload`,
                cloudinaryData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })

                .then(res => {
                    axios.post(`${state.baseURL}/post`, {
                        postText: values.postText,
                        image: res?.data?.url
                    }, {
                        withCredentials: true
                    })
                        .then((response) => {
                            // console.log(`response : ${response}`);///// return [object Object]
                            console.log('`response : `', response.data);
                            console.log(`data added`);
                            setResponseMessage(response.data.message)
                            setIsPosting(false);
                            setTimeout(() => {
                                setResponseMessage(null)
                            }, 10000);
                            setLoad(!load);

                            // console.log('responsePosts:====> ' ,responsePosts);
                        })
                        .catch((err) => {
                            console.log(`Error : ===>`, err);
                        })
                })
                .catch(err => {
                    console.log(err);
                });
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

    const search = (e) => {
        e.preventDefault();

        axios.get(`${state.baseURL}/posts/${searchText}`, {
            withCredentials: true
        })
            .then((res) => {
                setSearchData([])
                setSearchData(res.data.data);
                e.reset();
                console.log('searchData ====>', searchData);
                console.log('response "all products" =========>: ', res.data);
            })
            .catch((err) => {
                console.log('Error: ', err);
            })

        console.log(searchData, '<<<=================');
    };


    return (
        <div>
            <h1>This is Home </h1>

            <form action="" className='searchForm' on onSubmit={search}>

                <TextField
                    variant='outlined'
                    type="search"
                    placeholder='Search products'
                    value={searchText}
                    name=""
                    id=""
                    onChange={(e) => {
                        setSearchText(e.target.value)
                    }}
                />
                <Button type='submit'> Search </Button>
            </form>

            <Button
                className='postBtn'
                onClick={() => {
                    setIsPosting(true);
                }}>
                Post
            </Button>

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
                                    }} />
                                <i className='imgIcon'><ImageIcon /></i>
                            </label>

                            <div className="inputDiv">
                                <TextField
                                    variant='outlined'
                                    type="text"
                                    label='Post'
                                    placeholder="Write your post here..."
                                    id="description"
                                    value={postFormik.values.description}
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

            {
                (searchData.length) ?
                    <div className='mainSearch'>
                        <h3> Search Results :</h3>
                        <Button onClick={() => {
                            setSearchData([]);
                        }}>x</Button>

                        <div className="searchResult">

                            {searchData.map((eachPost, i) => {

                                return (
                                    <div className="eachPost" key={i}>

                                        <p> {moment(eachPost.date).fromNow()}</p>

                                        {
                                            (isEditing && eachPost._id === editingData._id) ?

                                                <div className="editingProduct">

                                                    <form onSubmit={updateFormik.handleSubmit}>

                                                        <div className="inputDiv">
                                                            <TextField
                                                                variant='outlined'
                                                                type="text"
                                                                id="Post"
                                                                label='Description'
                                                                value={updateFormik.values.description}
                                                                placeholder="Write something here..."
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
                                                    <p className="productname">{eachPost.name}</p>
                                                    <p className="productPrize">{eachPost.price}</p>
                                                    <p className="productDescription">{eachPost.description}</p>

                                                    <Button
                                                        className="editing"
                                                        onClick={() => {
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
                            })}

                        </div>
                    </div>
                    : null
            }
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
                                                        id="description"
                                                        varient="outlined"
                                                        value={updateFormik.values.description}
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
                                            <p className="productname">{eachPost.name}</p>
                                            <p className="productPrize">{eachPost.price}</p>
                                            <p className="productDescription">{eachPost.description}</p>

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