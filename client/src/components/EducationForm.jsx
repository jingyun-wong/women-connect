import React, { useState, useEffect, useRef } from 'react';
import 'antd/dist/antd.css';
import { Modal, Form, Input, DatePicker, Button } from 'antd';
import { EditOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import axios from 'axios';
import './createPost.css'


const { RangePicker } = DatePicker;

function EducationCreationForm({ visible, onCancel, educations, careers}) {
    const [form] = Form.useForm();
    const myRef = useRef(null)

    const scrollToBottom = () => {
        myRef.current.scrollIntoView({ behavior: "smooth" });
    };

    

    let choice = "Education";
    if (educations === undefined){
        choice = "Career";
    }

    return (
        <Modal
            className='w-full'
            visible={visible}
            title={"Edit " + choice}
            okText="Save"
            cancelText="Cancel"
            onCancel={onCancel}
            width={"50%"}
            style={{ height: 'calc(100vh - 100px)' }}
            bodyStyle={{overflowY: 'scroll'}}
            onOk={() => {
                let values = form.getFieldValue()
                console.log(values)
                let value = values[choice.toLowerCase()]
                console.log(value)
                axios.put("https://women-connect-app.herokuapp.com/profile/edit/second/" + sessionStorage.user, value)
                .then ((response) => {
                    console.log(response)
                    visible = false;
                    window.location.reload(false);
                })
                .catch(error => {
                    console.log(error.message)
                })
            }}
        >
            <div>
            <div ref={myRef}></div> 

            <Form form={form} layout="vertical" style={{overflow:"scroll"}}>
            {choice === "Education" ?
                <Form.List name="education" initialValue={educations}>
                    {(fields, { add, remove }) => (
                        <>
                        {fields.map(({ key, name}) => (
                            <div key={key} className={` border border-zinc-300 p-5 mb-5 ${ key < educations.length ? "signup" : "bg-white"}`}>
                                
                                <Form.Item 
                                    name={[name, 'school']} 
                                    label="School"
                                    style={{width:"50%"}} 
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your school!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Name of Univeristy/Polytechnic/ITE"/>
                                </Form.Item>

                                <Form.Item  
                                    name={[name, 'course']} 
                                    label="Course" 
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your course!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Course" />
                                </Form.Item>

                                <Form.Item name={[name, 'period']} label="Period of Study" >
                                    <RangePicker />
                                </Form.Item>
                                <Form.Item name={[name, 'desc']} label="Description">
                                    <TextArea rows={4} />
                                </Form.Item> 
                                {fields.length > 1 ? (
                                <MinusCircleOutlined  onClick={() => remove(name)} className="block"/>) 
                                : null}
                            </div>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => {add("",0); scrollToBottom();}} block icon={<PlusOutlined />}>
                                    Add Education
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            : 
                <Form.List name="career" initialValue={careers}>
                    {(fields, { add, remove }) => (
                        <>
                        {fields.map(({ key, name}) => (
                            <div key={key} className={`p-5 mb-5 ${ key < careers.length ? "signup" : "bg-white"}`}>
                                <Form.Item name={[name, 'company']} label="Company Name">
                                    <Input placeholder="Name of Company"  />
                                </Form.Item>
                                <Form.Item  name={[name, 'job']} label="Job Title">
                                    <Input placeholder="Job Title" />
                                </Form.Item>
                                <Form.Item name={[name, 'period']} label="Period">
                                    <RangePicker />
                                </Form.Item>
                                <Form.Item name={[name, 'desc']} label="Description">
                                    <TextArea rows={4} />
                                </Form.Item> 
                                {fields.length > 1 ? (
                                <MinusCircleOutlined  onClick={() => remove(name)} className="block"/>) 
                                : null}
                            </div>
                        ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => {add("",0); scrollToBottom();}} block icon={<PlusOutlined />}>
                                    Add Career
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>}
            </Form>
            </div>
        </Modal>
    );
};

function EducationForm(props){
    const [visible, setVisible] = useState(false);
    const onCreate = (values) => {
        console.log('Received values of form: ', values);
    };

    return (
        <div>
            <Button shape="circle" className='float-right'
                onClick={() => {
                    setVisible(true);
                }} 
                icon = {<EditOutlined />}
                size="middle"
            />

            <EducationCreationForm
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
                educations = {props.educations}
                careers = {props.careers}
            />
        </div>
    );
};

export default EducationForm;