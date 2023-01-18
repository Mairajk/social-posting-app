
import axios from 'axios';
import {
    TextField, Button, Grid
} from '@mui/material'
import { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';

import { GlobalContext } from '../../../../context/context';

const Search = () => {

    let { state, dispatch } = useContext(GlobalContext);

    const [load, setLoad] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingData, setEditingData] = useState({});


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

    const searchHandler = (e) => {
        e.preventDefault();

        axios.get(`${state.baseURL}/posts/${searchText}`, {
            withCredentials: true
        })
            .then((res) => {
                setSearchData([])
                setSearchData(res.data.data);
                // e.reset();
                console.log('searchData ====>', searchData);
                console.log('response "all products" =========>: ', res.data);
            })
            .catch((err) => {
                console.log('Error: ', err);
            })

        console.log(searchData, '<<<=================');

    };

    return (
        <div className='searchDiv'>

            <form action="" className='searchForm' on onSubmit={searchHandler}>

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
                                            (!isEditing && eachPost._id !== editingData._id) ?

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
                                                :
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

                                        }
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                    : null
            }

        </div >
    )
}

export default Search



