"use client"
import { getPropertyById, editProperty } from '@/actions'
import type { PropertyInput } from '@/actions'
import { Property } from '@prisma/client'
import { Card, Form, Input, InputNumber, Radio, Space, Button, DatePicker, Upload, UploadFile, Alert } from 'antd'
import { useSession } from 'next-auth/react'
import dayjs from "dayjs"
import { PlusOutlined } from "@ant-design/icons"
import { useEffect, useState } from 'react'
import type { GetProp, UploadProps } from 'antd';
import type { RcFile } from "antd/es/upload";
import { useMessage } from '@/context/MessageContext'
import { PropertyWithImagesAndOwner } from '@/db'
import { useParams } from 'next/navigation'
import BackButton from '@/components/BackButton'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
type FormValues = Omit<Property, 'availableFrom'> & {
  availableFrom: dayjs.Dayjs | null
}

export default function EditProperty() {
  const { data: session } = useSession()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [propertyDetails, setPropertyDetails] =
    useState<PropertyWithImagesAndOwner | null>(null)
  const { showMessage } = useMessage()
  const [form] = Form.useForm();
  const params = useParams()
  const id = params?.id

  const fetchPropertyDetails = async () => {
    try {
      if (!id) return
      const property = await getPropertyById(Number(id))
      if (property) {
        setPropertyDetails(property)
        const existingImages = property?.images?.map((img, index) => ({
          uid: "_" + index,
          name: `image${index + 1}.jpg`,
          status: "done",
          url: img.url
        })) as UploadFile[]
        setFileList(existingImages)
      }
    } catch (error) {
      showMessage("Something went wrong", "error")
    }
  }

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  useEffect(() => {
    if (propertyDetails) {
      form.setFieldsValue({
        ...propertyDetails,
        availableFrom: propertyDetails.availableFrom
          ? dayjs(propertyDetails.availableFrom)
          : null
      });
    }
  }, [propertyDetails, form]);

  const onFinish = async (values: FormValues) => {
    if (!propertyDetails) return;

    const getBase64 = (file: FileType): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    try {
      const base64Images = await Promise.all(
        fileList.map((file) => {
          if (file.url) {
            return Promise.resolve(file.url)
          } else {
            const fileToConvert = file.originFileObj as RcFile
            return getBase64(fileToConvert)
          }
        })
      )

      const cleanValues = {
        ...values,
        price: Number(values.price),
        area: Number(values.area),
        availableFrom: values.availableFrom
          ? values.availableFrom.toDate()
          : new Date(),
      }

      const response = await editProperty(
        cleanValues as unknown as PropertyInput,
        propertyDetails.id,
        base64Images
      )
      if (response) {
        showMessage("Property edited successfully", "success")
      }
    } catch (error) {
      showMessage("Something went wrong", "error")
      console.log("Error editing property", error)
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

  if (!propertyDetails) {
    return <div className='container'>Loading...</div>
  }

  if (session && +session.user.id !== propertyDetails.ownerId) {
    return (
      <div className='container'>
        <Alert message="You are not allowed to edit this property" type="error" />
      </div>
    )
  }

  return (
    <div className='formContainer'>
      <h1 className="heading">Edit Property</h1>
      <BackButton />
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}>
        <Card>
          <Form.Item
            label="Type"
            name={"type"}
            rules={[{ required: true, message: "Please input the property type" }]}>
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value={"RENT"}>Rent</Radio.Button>
              <Radio.Button value={"SALE"}>Sale</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Name"
            name={"name"}
            rules={[{ required: true, message: "Please input the property name" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name={"description"}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="City"
            name={"city"}
            rules={[{ required: true, message: "Please input the property city" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Street"
            name={"street"}
            rules={[{ required: true, message: "Please input the property street" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="State"
            name={"state"}
            rules={[{ required: true, message: "Please input the property state" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name={"price"}
            rules={[{ required: true, message: "Please input the property price" }]}>
            <Space.Compact style={{ width: "100%" }}>
              <Button disabled>Rs</Button>
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  Number(value?.replace(/Rs\s?|(,*)/g, ""))
                }
              />
            </Space.Compact>
          </Form.Item>
          <Form.Item
            label="BHK"
            name={"bhk"}
            rules={[{ required: true, message: "Please input the property bhk" }]}>
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value={"ONE_RK"}>1RK</Radio.Button>
              <Radio.Button value={"ONE_BHK"}>1BHK</Radio.Button>
              <Radio.Button value={"TWO_BHK"}>2BHK</Radio.Button>
              <Radio.Button value={"THREE_BHK"}>3BHK</Radio.Button>
              <Radio.Button value={"FOUR_BHK"}>4BHK</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Area"
            name={"area"}
            rules={[{ required: true, message: "Please input the property area" }]}>
            <Space.Compact style={{ width: "100%" }}>
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  Number(value?.replace(/Rs\s?|(,*)/g, ""))
                }
              />
              <Button disabled>sqft</Button>
            </Space.Compact>
          </Form.Item>
          <Form.Item
            label="Parking"
            name={"parking"}
            rules={[{ required: true, message: "Please input the property parking" }]}>
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value={"YES"}>Yes</Radio.Button>
              <Radio.Button value={"NO"}>No</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label={"Upload Images"} valuePropName='fileList'>
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
            rules={[{ required: true, message: "Please input preferred tenants" }]}>
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value={"FAMILY"}>Family</Radio.Button>
              <Radio.Button value={"BACHELORS"}>Bachelor</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Property Type"
            name={"propertyType"}
            rules={[{ required: true, message: "Please input property type" }]}>
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value={"APARTMENT"}>Apartment</Radio.Button>
              <Radio.Button value={"INDEPENDENTS"}>Independent</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Zipcode"
            name="zipcode"
            rules={[{ required: true, message: "Please input zipcode" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Available From"
            name="availableFrom"
            rules={[{ required: true, message: "Please input available from date" }]}>
            <DatePicker style={{ width: "50%" }} />
          </Form.Item>
          <Space>
            <Button type='primary' htmlType='submit'>Submit</Button>
            <Button onClick={() => form.resetFields()}>Reset</Button>
          </Space>
        </Card>
      </Form>
    </div>
  )
}