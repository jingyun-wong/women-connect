import React, { useState } from 'react';
import 'antd/dist/antd.css';
import {  Modal, Form, Select, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import './createPost.css'


const { Option } = Select;
const careers = ["Software engineer", "Data scientist", "Data analyst", "Marketing director", "Human resource coordinator"];
const industries = ["Automotive", "Telecommunication", "Finance", "Foob & Beverage"];

function ProfileCollectionForm({ visible, onCreate, onCancel, about, career, industry }) {
    const [form] = Form.useForm();

    const children = []
    for (let i of careers){
        children.push(<Option key={i}>{i}</Option>);
    }

    const list_of_industry = []
    for (let y of industries){
        list_of_industry.push(<Option key={y}>{y}</Option>);
    }
    
    return (
        <Modal
            data-testid="profile-form"
            className='w-full'
            visible={visible}
            title="Edit Profile"
            okText="Save"
            cancelText="Cancel"
            onCancel={onCancel}
            width={"50%"}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form form={form} layout="vertical" name="form_in_modal">
                {career !== undefined && 
                    <Form.Item name="career" label="Career">
                        <Select mode="tags" defaultValue={career} style={{ width: '100%' }} >
                            {children}
                        </Select>
                    </Form.Item>
                }
                
                <Form.Item name="industry" label="Industry">
                    <Select mode="tags" defaultValue={industry} style={{ width: '100%' }} >
                        {list_of_industry}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
        );
};

function ProfileForm(props){
    const [visible, setVisible] = useState(false);

    const onCreate = (values) => {
        console.log('Received values of form: ', values);

        let userProfile = {
            about: values.about,
            career: values.career,
            industry: values.industry
        }

        axios.put("https://women-connect-app.herokuapp.com/profile/edit/first/" + sessionStorage.user,userProfile)
        .then ((response) => {
            console.log(response)
        })
        .catch(error => {
            console.log(error.message)
        })
        setVisible(false);
        window.location.reload(false);
    };

    return (
        <div >
            <Button shape="circle" className='float-right'
                onClick={() => {
                    setVisible(true);
                }} 
                size="middle"
                icon = {<EditOutlined />}
            />
                
            <ProfileCollectionForm
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
                about = {props.about}
                career = {props.career}
                industry = {props.industry}
            />
        </div>
    );
};

export default ProfileForm;