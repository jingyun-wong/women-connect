import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Form, Input, Upload, Button, Image, Avatar, Spin } from 'antd';
import { EditFilled, EditOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import axios from 'axios';
import './createPost.css'
import ImgCrop from 'antd-img-crop';
import Loading from './Loading'


function ProfileCreateForm({ visible, onCreate, onCancel, name, profile, about}) {
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState("");
    const [fileList, setFileList] = useState( profile !== "" ? [
        {
            uid: '1',
            name: 'No Pic Yet',
            status: 'done',
            response: 'Good upload',
            url: "data:image/png;base64," + profile 
        }
    ]: '')

    const onChange = ({ fileList: newFileList }) => {
        console.log(newFileList)
        setFileList(newFileList);
        setImage(newFileList[0]['originFileObj']);
        console.log(image)
    };

    const [form] = Form.useForm();

    const uploadButton = (
        <div>
            <EditOutlined style={{ fontSize: '24px'}}/>
        </div>
        );
    
    return (
        <Modal
            className='w-full'
            visible={visible}
            title="Edit Profile"
            okText="Save"
            cancelText="Cancel"
            onCancel={onCancel}
            width={"50%"}
            okButtonProps={{
                disabled: loading,
            }}
            cancelButtonProps={{
                disabled: loading,
            }}
            onOk={() => {
                setLoading(true)
                let values = form.getFieldsValue()
                console.log(values)
                let formData = new FormData();
                if (image !== ""){
                    formData.append("file", image)
                }
                formData.append("name", values["name"])
                formData.append("about",values["about"])
                formData.append("id", sessionStorage.user)
                form.resetFields();

                axios.post("https://women-connect-app.herokuapp.com/profile/edit/name",formData)
                .then((response) => {
                    console.log(response)
                    window.location.reload(false);
                })
                .catch(error => {
                    console.log(error.message)
                })
            }}
        >   
            {loading === false ?
            <Form form={form} name="profile">
                <h1>Name:</h1> 
                <Form.Item 
                    name="name" 
                    initialValue={name}
                    style={{width:"40%"}}
                >
                    <Input/>
                </Form.Item>

                <h1>About:</h1>
                <Form.Item name="about" initialValue={about}>
                    <TextArea />
                </Form.Item>

                <h1>Profile Picture:</h1> 
                <div className='text-center p-5'>
                    <div className='m-5'>
                        <Form.Item name="profilePic">
                            <ImgCrop grid rotate quality={1} minZoom={0.5} cropSize={{width:300, height:300}}>
                                <Upload
                                    name='photo'
                                    listType='picture-card'
                                    maxCount={1}
                                    fileList={fileList}
                                    onChange={onChange}
                                    style={{border:0}}
                                >
                                    {uploadButton}
                                </Upload>
                            </ImgCrop>
                        </Form.Item>
                    </div>
                </div>
                
            </Form> : 
            <div className='h-24'>
                <Spin 
                    tip="Saving your changes..."
                    size="medium"
                    style={{margin:"auto auto", "padding":"100px" ,height:"200px", position:"absolute",top:0, bottom: 0, left: 0, right: 0}}
                >
                </Spin>
            </div>}
        </Modal>
    );
};

function ProfilePic(props){
    const [visible, setVisible] = useState(false);

    console.log(props.name, props.profile, props.about)

    const onCreate = (values) => {
        setVisible(false);
        console.log('Received values of form: ', values);
    };

    return (
        <div>
            <Button 
                className='float-right'
                onClick={() => {
                    setVisible(true);
                }} 
                icon={<EditFilled style={{fontSize:"24px"}}/>}
                size="large"
                style={{border:0, backgroundColor:"rgb(241 245 249)"}}
            />
            
            <ProfileCreateForm
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
                name = {props.name}
                profile = {props.profile}
                about = {props.about}
            />
        </div>
    );
};

export default ProfilePic;