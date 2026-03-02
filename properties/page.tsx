'use client'
import React, { useEffect, useState } from 'react'
import { Col, Row, Form, Select, Breadcrumb, Radio, Checkbox, Divider, Flex, Button } from 'antd'
import { getProperties } from '@/actions'
import { PropertyWithImages } from '@/db'
import PropertyCards from '@/components/PropertyCards'
import Card from 'antd/es/card/Card'
import { FilterValues } from '@/types'
import { LoadingOutlined } from '@ant-design/icons'
import { useMessage } from '@/context/MessageContext'
import BackButton from '@/components/BackButton'



export default function Properties() {

    const [sortOrder, setSortOrder] = useState("latest")
    const [properties, setProperties] = useState<PropertyWithImages[]>([])
    const [filters, setFilters] = useState<FilterValues>({})
    const [propertyCount, setPropertyCount] = useState<number>(10)
    const [loading, setLoading] = useState(false)
    const [filterForm] = Form.useForm()
    const { showMessage } = useMessage()

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true)
                const properties = await getProperties(filters, sortOrder, propertyCount)
                setProperties(properties)
            } catch (error) {
                console.log("Error fetching properties", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProperties()
    }, [filters, sortOrder, propertyCount])
    console.log(filters)
    return (
        <div className='container'>
            <h1 className='heading'>Properties 🏠</h1>

            <Breadcrumb className='flex-center' items={[
                {
                    title: "Home", href: "/"
                },
                {
                    title: "Properties"
                },
            ]}>
            </Breadcrumb>
            <div className='sticky-container mt-1'>
                <Row gutter={[16, 16]} wrap>
                    <Col xs={24} md={8} className='aticky-column'>
                        <BackButton></BackButton>
                        <Card title="Filters">
                            <Form
                                form={filterForm}
                                onFinish={(values) => setFilters(values)}>
                                <Form.Item name={"type"}>
                                    <Radio.Group buttonStyle='solid'>
                                        <Radio.Button value={"RENT"}>Rent</Radio.Button>
                                        <Radio.Button value={"SALE"}>Sale</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item name={"apartment_type"}>
                                    <Radio.Group buttonStyle='solid'>
                                        <Radio.Button value={"APARTMENT"}>Apartment</Radio.Button>
                                        <Radio.Button value={"INDEPENDENT"}>{""}Independent</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item name={"bhk"}>
                                    <Checkbox.Group>
                                        <Checkbox value={"ONE_RK"}>1RK</Checkbox>
                                        <Checkbox value={"ONE_BHK"}>1BHK</Checkbox>
                                        <Checkbox value={"TWO_BHK"}>2BhK</Checkbox>
                                        <Checkbox value={"THREE_BHK"}>3BHK</Checkbox>
                                        <Checkbox value={"FOURTH_BHK"}>4BhK</Checkbox>
                                    </Checkbox.Group>
                                </Form.Item>
                                <Form.Item label="Price" name={"price"} >
                                    <Select className='w-full' placeholder="Select price range "
                                        options={[
                                            { label: "10,000-20,000", value: "10000-20000" },
                                            { label: "20,000-30,000", value: "20000-30000" },
                                            { label: "40,000-50,000", value: "40000-50000" },
                                            { label: "50,000-1L", value: "50,000-100000" },
                                            { label: "1L - 5L", value: "100000-500000" },
                                            { label: "5L- 10L", value: "500000-100000" },
                                            { label: "10L- 20L", value: "10,0000-200000" },
                                        ]}
                                    ></Select>
                                </Form.Item>
                                <Form.Item label="Area" name={"area"} >
                                    <Select className='w-full' placeholder="Select the area "
                                        options={[
                                            { label: "0-500", value: "0-500" },
                                            { label: "500-1000", value: "500-1000" },
                                            { label: "1000-1500", value: "1000-1500" },
                                            { label: "1500-2000", value: "2000-2500" },
                                            { label: "2500 - 3000", value: "2500-3000" },
                                            { label: "3000-4000", value: "3000-4000" },
                                            { label: "4000-5000", value: "4000-5000" },
                                        ]}
                                    ></Select>
                                </Form.Item>
                                <Form.Item name={"preferred_tenants"}>
                                    <Radio.Group buttonStyle='solid'>
                                        <Radio.Button value={"FAMILY"}>Family</Radio.Button>
                                        <Radio.Button value={"Bhachelor"}>Bhachelor</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Divider />
                                <Flex justify='flex-end' gap={8}>
                                    <Button onClick={() => filterForm.resetFields()}>Reset</Button>
                                    <Button type='primary' htmlType='submit'>Apply</Button>
                                </Flex>
                            </Form>

                        </Card>
                    </Col>
                    <Col xs={24} md={16} className='scrollable-column'>
                        <Form
                            className="mb-1"
                            initialValues={{ sortBy: "latest" }}
                        >
                            <Form.Item label="Sort By" name="sortBy">
                                <Select
                                    placeholder="Sort By"
                                    style={{ width: 350 }}
                                    onChange={(value) => setSortOrder(value)}
                                    options={[
                                        { label: "Latest", value: "latest" },
                                        { label: "Price: Low to High", value: "asc" },
                                        { label: "Price: High to Low", value: "desc" },
                                    ]}
                                />
                            </Form.Item>
                        </Form>
                        <PropertyCards layout={"horizontal"} properties={properties} />
                        {loading && <LoadingOutlined className={"loading"} />}
                        <Button
                            type="primary" className='mt-1'
                            block
                            onClick={() => setPropertyCount((prev) => prev + 10)}>
                            Load More</Button>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
