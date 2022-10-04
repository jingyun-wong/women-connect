import { Spin } from 'antd';
import React from 'react';

function Loading(){
    return(
        <div className='h-screen w-full text-center relative'>
            <Spin 
                tip="Loading..."
                size="large"
                style={{margin:"auto auto", height:"100px", position:"absolute",top:0, bottom: 0, left: 0, right: 0}}
            ></Spin>
        </div>
    )
}

export default Loading;