"use client"
import { searchResults } from '@/actions'
import { PropertyWithImages } from '@/db'
import { PropertyType } from '@prisma/client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Properties from '../properties/page'
import PropertyCards from '@/components/PropertyCards'
import BackButton from '@/components/BackButton'


export default function SearchResults(){

  const searchParams=useSearchParams()
  const propertyType=searchParams.get("propertyType") as string 
  const location =searchParams.get("location") as string
  const [properties,setProperties]=useState<PropertyWithImages[]>([])

  useEffect(()=>{
    const fetchProperties = async()=>{
      try {
        const properties=await searchResults(propertyType, location)
        if(properties) setProperties(properties)
      } catch (error) {
       console.log("Error fetching properties:",error)
        
      }
    }
    fetchProperties()
  },[propertyType,location])
  
  console.log(properties)

  return (
    <div className='container'>
      <h1 className='heading'>
        {properties.length || 0} properties in {location} for {propertyType}
      </h1>
      <BackButton/>
      <PropertyCards properties={properties} layout={"vertical"}/>
    </div>
  )
}

