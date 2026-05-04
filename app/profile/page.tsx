'use client'
import { getUser,getUserProperties } from "@/actions"
import BackButton from "@/components/BackButton"
import PropertyCards from "@/components/PropertyCards"
import { PropertyWithImages } from "@/db"
import { Card, Col, Empty, Image, Row } from "antd"
import {useSession} from "next-auth/react"
import { useEffect, useState } from "react"


export default function Profile() {
  const {data:session}=useSession()
  const [properties,setProperties]=useState<PropertyWithImages[]>([])

  useEffect(()=>{
    fetchUserProperties()
  },[session])

  const fetchUserProperties = async () =>{
    if (session?.user){
      const properties = await getUserProperties(+session.user.id)

      if(properties){
        setProperties(properties)
      }
    }
  }
  console.log(properties)
  return (
    <div className="container ">
      <Row gutter={[32,32]}>
        <Col sm={24} lg={8}>
          <h3 className="heading">My Profile</h3>
        
        <BackButton/>
        <Card className="mt-1">
         <Image 
         src={session?.user?.image as string}
          alt="User"
          width={100}
          height={100}
          className="profile-img mt-1"
          >   
         </Image>
         <h3 className="mb-1 mt-1">
          {session?.user.name}
         </h3>
         <p>{session?.user.email}</p>
        </Card>
        </Col>
        <Col sm={24} lg={16}>
        <h1 className="heading">
          My property listing
        </h1>
         {properties.length !== 0 ? (<PropertyCards properties={properties} layout={"horizontal"}></PropertyCards>

         ):(
          <Empty/>
        )}      
         </Col>
      </Row>
      
    </div>
  )
}
