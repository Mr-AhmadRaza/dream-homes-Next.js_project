
import { Button, Col, Row } from "antd";
import Image from "next/image";
import about from "@/public/images/about.jpg";
import{db} from "@/db"
import PropertyCards from "@/components/PropertyCards";
import Link from "next/link";
import { rubik } from "@/prisma/fonts";



export default async function Home() {
  const todjpg ="/images/tod.jpg"; // path relative to public/
  const featuredProperties= await db.property.findMany({
    where:{
      isFeatured:true
    },
    include:{images:true,
      
    },
    take:3,
  })

  const PropertiesWithMessageCount = await db.property.findMany({
    include:{
      _count:{
        select:{
          messages:true
        }
      },
      images:true,
    }
  })

 const onDemandProperties = PropertiesWithMessageCount.sort(
  (a,b)=> a._count.messages - b._count.messages
  ).slice(0,3)
  console.log(onDemandProperties)
  console.log(featuredProperties)
  return (
    <>
    <div className="container-about">
      <div className="section">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <Image
              width={500}
              height={400}
              
              alt="about"
              src={about}
              className="about-image  mt-5  expand-1"
              priority
            />
          </Col>
          <Col xs={24} md={12}>
            <h1 className="heading">About Us</h1>
            <p className="paragraph-main">
              We are a trusted property platform dedicated to helping people find the perfect place to call home.
              Our goal is to make buying, selling, and renting properties simple, transparent, and stress-free.
              We offer a wide range of residential and commercial properties to suit every lifestyle and budget.
              With a strong focus on quality, honesty, and customer satisfaction, we guide you at every step.
              Our experienced team combines local market knowledge with modern technology for better results.
              At Dream Homes, your comfort, trust, and future always come first.
            </p>
            <h1 className="title">Our Mission</h1>
            <p className="paragraph">
              Our mission is to simplify the property journey by connecting people with the right homes and spaces.
              We aim to deliver honest guidance, reliable listings, and a smooth user experience.
              Through innovation and market expertise, we help clients make confident property decisions.
              We are committed to building trust, value, and long-term relationships with every customer.
            </p>
            <h1 className="title">Why Choose Us</h1>
            <p className="paragraph">
              We offer trusted listings, transparent processes, and expert local market knowledge.
              Our team focuses on your needs to deliver fast, reliable, and stress-free property solutions.
              With customer-first service and modern technology, we make your property journey simple and secure.
            </p>
          </Col>
        </Row>
      </div>
    </div>

    <div className="section container-padding featured-properties">
      <h1 className="heading">Feature Properties</h1>
      <p className="paragraph mb-1 text-algin">
        Explore our feature properties that are currently available for sale and rent 
      </p>
      <PropertyCards properties={featuredProperties} layout={"vertical"}/>
      <Link href={"/properties"} className="flex-center">
      <Button type="primary" className="view-btn" size="large">View Properties</Button>
       </Link>
    </div>
    <div className="section container">
      <h1 className="heading">Properties On Demands</h1>
      <p className="paragraph mb-1 text-algin">
        Check out the most popular properties that are on demands 
      </p>
      <PropertyCards properties={onDemandProperties} layout={"vertical"}/>
    </div>
    <div className="section container-padding cta">
      <Row gutter={[32,32]}>
        <Col xs={24} md={16}>
        <div className="cta-container">
        <h2>Ready to Find Your   {""} <strong>💖Homes?</strong> </h2>
        <p className={`cta-subtitle ${rubik.className}`}>
          we offer a wide range of properties to suit all your needs.
          <br/>
          whether you're looking for buy,sell or rent we are here to help.
        </p>
        <Link href={"/properties"}>
        
        <Button type="primary" size="large" className="view-btn mt-2">
          Explore Properties 
        </Button>
        </Link>
        </div>
        </Col>
        <Col xs={24} md={8}>
        <Image src={todjpg} alt="tod Jpg" width={0} height={50} sizes="100vw" className="cta-image expand"/>
        </Col>
      </Row>
    </div>
    </>

  );
}