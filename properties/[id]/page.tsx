import { getPropertyById } from '@/actions';
import { Breadcrumb, Card, Carousel, Col, Flex, Row, Divider } from 'antd';
import Image from 'next/image';
import { HomeOutlined, KeyOutlined, LayoutOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import React from 'react';
import Contact from '@/components/Contact';
import BackButton from '@/components/BackButton';
import FloatIcons from '@/components/FloatIcons';

interface PropertyPageProps {
    params: { id: string } | Promise<{ id: string }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
    // 1️⃣ Ensure params is resolved
    const resolvedParams = await params;

    // 2️⃣ Convert id to number safely
    const id = Number(resolvedParams.id);
    if (isNaN(id)) {
        return <div>Invalid property ID</div>;
    }

    // 3️⃣ Fetch property
    const property = await getPropertyById(id);
    if (!property) {
        return <div>Property not found</div>;
    }

    return (
        <div className="container">
            <h1 className="heading">Property Details</h1>

            <Breadcrumb
            
                className="flex-center mb-1"
                items={[
                    { title: "Home", href: "/" },
                    { title: "Properties", href: "/properties" },
                    { title: "Property Details" },
                ]}
                
            />
<BackButton></BackButton>
            {/* 4️⃣ Carousel */}
            <Carousel autoplay arrows>
                {property.images.map((image) => (
                    <div key={image.id} className="image-container">
                        <Image
                            src={image.url}
                            alt="property image"
                            width={1200} // give a proper width
                            height={500} // height fixed
                            sizes="100vw"
                            style={{ objectFit: 'cover' }} // next/image v13+
                            className="image-br"
                            priority
                        />
                    </div>
                ))}
            </Carousel>
            <Row gutter={[16, 16]} className='my'>
                <Col xs={24} md={16}>
                    <Card>
                        <div className='card-header'>
                            <h2 className='heading'>{property?.name}</h2>
                            <p className='card-header-price'>
                                ${property?.price.toLocaleString()}
                                {property?.type === "RENT" && "/month"}
                            </p>
                        </div>
                        <p className="paragrah mb-1">
                            {property?.street},{property?.city},{property?.state},{""}
                            {property?.zipcode}
                        </p>
                    </Card>
                    <Card className="m-1">
                        <Flex justify="space-around" align="center" wrap>
                            <div className="card-item flex flex-col items-center mx-2">
                                <KeyOutlined className="card-icon mb-1" />
                                <p className="icon-text">{property?.type}</p>
                            </div>

                            <Divider orientation="vertical" className='icon-divider' />

                            <div className="card-item flex flex-col items-center mx-2">
                                <HomeOutlined className="card-icon mb-1" />
                                <p className="icon-text">{property?.propertyType}</p>
                            </div>

                            <Divider orientation="vertical" className='icon-divider' />

                            <div className="card-item flex flex-col items-center mx-2">
                                <KeyOutlined className="card-icon mb-1" />
                                <p className="icon-text">{property?.bhk.split("-").join("")}</p>
                            </div>

                            <Divider orientation="vertical" className='icon-divider' />

                            <div className="card-item flex flex-col items-center mx-2">
                                <LayoutOutlined className="card-icon mb-1" />
                                <p className="icon-text">{property?.area} SQFT</p>
                            </div>

                            <Divider orientation="vertical" className='icon-divider' />

                            <div className="card-item flex flex-col items-center mx-2">
                                <UsergroupAddOutlined className="card-icon mb-1" />
                                <p className="icon-text">{property?.preferredTenants}</p>
                            </div>
                        </Flex>
                    </Card>
                    <Card className='mt-1'>
                        <h3>Description</h3>
                        <p>{property?.description}</p>

                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Contact property={property} />
                </Col>
            </Row>
            {property && <FloatIcons property={property}/>}
        </div>
    );
}
