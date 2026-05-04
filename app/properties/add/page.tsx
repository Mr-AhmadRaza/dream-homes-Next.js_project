"use client"
import { postProperty, } from '@/actions'
import { Property } from '@prisma/client'
import { Card, Form, Input, InputNumber, Radio, Space, Button, DatePicker, Upload, UploadFile } from 'antd'
import { useSession } from 'next-auth/react'
import dayjs from "dayjs"
import { PlusOutlined } from "@ant-design/icons"
import { useState } from 'react'
import type { GetProp, UploadProps} from 'antd';
import type { RcFile } from "antd/es/upload";
import { useMessage } from '@/context/MessageContext'




type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export default function AddProperty() {
  const { data: session } = useSession()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const {showMessage}=useMessage()
  console.log(fileList)


  const onFinish = async (values: Property) => {
    const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

  try {
    const base64Images = await Promise.all(
      fileList.map((file)=>{
        const fileToConvert=file.originFileObj as RcFile
        return getBase64(fileToConvert)
      })
    )
    const cleanValues = {
      ...values,
      price: Number(values.price),
      area: Number(values.area),
      availableFrom: values.availableFrom
        ? dayjs(values.availableFrom).toDate() // 👈 CHANGE HERE
        : new Date(), // 👈 null nahi
    }

    const response = await postProperty(
      cleanValues, 
      session?.user?.id as string,
      base64Images
    )
    if(response){
      showMessage("Properties created successfuly","success")
      console.log(response)
    }
    
  } catch (error) {
    showMessage("something went wrong","error")
    console.log("Error creating property", error)
  }
}



  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handlePreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
 
  return (
    <div className='formContainer'>
      <h1 className="heading">List Your Property</h1>
      <p className="paragraph mb-1 text-center">
        List your property for free and reach to our potential buyers and sellers.
      </p>
      <Form
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}>
        <Card>
          <Form.Item
            label="Type"
            name={"type"}
            rules={[
              {
                required: true,
                message: "Please input the property type",
              },
            ]}>
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value={"RENT"}>Rent</Radio.Button>
              <Radio.Button value={"SALE"}>Sale</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Name"
            name={"name"}
            rules={[
              {
                required: true,
                message: "Please input the property name",
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name={"description"}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="City"
            name={"city"}
            rules={[
              {
                required: true,
                message: "Please input the property city",
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Street"
            name={"street"}
            rules={[
              {
                required: true,
                message: "Please input the property street",
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="State"
            name={"state"}
            rules={[
              {
                required: true,
                message: "Please input the property state",
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name={"price"}
            rules={[
              {
                required: true,
                message: "Please input the property price",
              },
            ]}>
            <Space.Compact>
              <Button disabled>Rs</Button>
              <InputNumber style={{ width: "100%" }} />
            </Space.Compact>
          </Form.Item>
          <Form.Item
            label="BHK"
            name={"bhk"}
            rules={[
              {
                required: true,
                message: "Please input the property bhk",
              },
            ]}>
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value={"ONE_RK"}>1RK</Radio.Button>
              <Radio.Button value={"ONE_BHK"}>1BHK</Radio.Button>
              <Radio.Button value={"TWO_BHK"}>2BhK</Radio.Button>
              <Radio.Button value={"THREE_BHK"}>3BHK</Radio.Button>
              <Radio.Button value={"FOUR_BHK"}>4BhK</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Area"
            name={"area"}
            rules={[
              {
                required: true,
                message: "Please input the property area",
              },
            ]}>

            <Space.Compact style={{ width: "100%" }}>
              <InputNumber style={{ width: "100%" }} />
              <Button disabled>sqft</Button>
            </Space.Compact>
          </Form.Item>
          <Form.Item
            label="Parking"
            name={"parking"}
            rules={[
              {
                required: true,
                message: "Please input the property parking",
              },
            ]}>
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value={"YES"}>Yes</Radio.Button>
              <Radio.Button value={"NO"}>No</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item label={"Upload Iamges"} valuePropName='fileList'>
            <Upload
              multiple
              listType="picture-card"
              beforeUpload={() => false}
              onChange={onChange}
              onPreview={handlePreview}
              fileList={fileList}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item
            label="Preferred Tenants"
            name={"preferredTenants"}
            rules={[
              {
                required: true,
                message: "Please input the property prefered tenants",
              },
            ]}>
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value={"FAMILY"}>Family</Radio.Button>
              <Radio.Button value={"BACHELORS"}>Bachelor</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Property Type"
            name={"propertyType"}
            rules={[
              {
                required: true,
                message: "Please input the property property type",
              },
            ]}>
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value={"APARTMENT"}>Apartment</Radio.Button>
              <Radio.Button value={"INDEPENDENTS"}>Independent</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Zipcode"
            name="zipcode"
            rules={[
              { required: true, message: "Please input zipcode" }
            ]}
          >
            <Input />
          </Form.Item>


          <Form.Item
            label="Available From"
            name="availableFrom"
            rules={[
              {
                required: true,
                message: "Please input the property available from",
              },
            ]}
          >
            <DatePicker style={{ width: "50%" }} />
          </Form.Item>

          <Space>
            <Button type='primary' htmlType='submit'>Submit</Button>
            <Button >Reset</Button>
          </Space>


        </Card>
      </Form>
    </div>
  )
}
