import { Modal, Form, Input, Button, Upload, Select, Avatar, Image} from 'antd';
import {UploadOutlined, UserOutlined} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './createPost.css'
import Loading from '../components/Loading';


const { Option } = Select;

const getSrcFromFile = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
        });
    };

function CreatePost ({visible, onCancel}){
    const [name, setName] = useState("");
    const [photo, setPhoto] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        axios.get(`https://women-connect-app.herokuapp.com/user/` + sessionStorage.user)
        .then ((response) => {
            console.log(response)
            setName(response.data.data.name)
        })
        .catch(error => {
            console.log(error.message)
        })

        axios.get("https://women-connect-app.herokuapp.com/profile/create/" + sessionStorage.user)
        .then ((response) => {
            setPhoto(response.data.data.image)
        })
    })

    const onChange = ({ fileList: newFileList }) => {
        console.log(newFileList)
        setFileList(newFileList);
        setImage(newFileList[0]['originFileObj']);
        console.log(image)
    };

    const [fileList, setFileList] = useState([

    ]);    
    
    const [form] = Form.useForm();
    // form.resetFields();

    return (
        <> 
        <Modal
            data-testid="createPost" 
            title="Create a Story" 
            centered
            okText="Post"
            visible={visible}
            onOk={() => {
                let values = form.getFieldsValue()
                console.log(values)

                let formData = new FormData();
                if (image !== ""){
                    formData.append("file", image)
                }
                if (values["tags"] !== undefined){
                    formData.append("tags", values["tags"])
                }
                formData.append("title", values["title"])
                formData.append("content", values["content"])
                formData.append("posting", values["posting"])
                formData.append("id", sessionStorage.user)

                form.resetFields();
                console.log(formData)
                axios.post("https://women-connect-app.herokuapp.com/post/createPost",formData)
                .then((response) => {
                    console.log(response)
                    window.location.reload(false);
                })
                .catch(error => {
                    console.log(error.message)
                })
            }}
            onCancel={onCancel}
            width={"50%"}
        >
            
            <Form form={form}>
                <div>
                    <Avatar src={<Image preview={false} src={photo === "" ? "https://joeschmoe.io/api/v1/female/jane" : "data:image/png;base64," + photo}/>}
                            icon={<UserOutlined />}
                            size={{
                                lg: 80,
                                xl: 80
                            }}
                            style = {{border: "1px solid gray"}}
                    />
                    <div className='ml-2 text-base inline-block align-top'>
                        <div className='mb-1'>{name}</div>
                        <Form.Item name="posting" initialValue="public">
                            <Select style={{width: 150}} size="medium">
                                <Option value="connection">Connections only</Option>
                                <Option value="public">Public</Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>
                
                <div className='border border-slate-300 rounded my-5 highlight'>
                    <Form.Item name="title" style={{margin:0}}>
                        <input className='success' style={{border:0, fontSize:"18px", marginBottom:"1px", paddingLeft:"10px",paddingTop:"10px", width:"100%"}} placeholder="Title" />
                    </Form.Item>
                    <Form.Item name="content" style={{margin:0}}>
                        <textarea className='success' style={{border:0, width:"100%", paddingLeft:"10px", paddingTop:"5px"}} rows={6} placeholder='What do you want to share?'/>
                    </Form.Item>
                </div>
                
                <h1>Add Image</h1>
                <Form.Item name="photo">
                    <ImgCrop grid quality={6} aspect={1080/566} minZoom={1}>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onChange}
                            maxCount={1}
                        >
                            {fileList.length < 2 && '+ Upload'}
                        </Upload>
                    </ImgCrop>
                </Form.Item>

                <h1>Do you want to add some tags?</h1>
                <Form.Item name="tags" >
                    <Select mode="tags" style={{ width: '100%' }} placeholder="Industry, Jobs etc.">
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
        </>
    )
}

export default CreatePost;
