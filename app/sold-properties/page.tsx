'use client'
import { PropertyWithImages } from "@/db"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { getUserProperties } from '@/actions'
import PropertyCards from "@/components/PropertyCards"
import BackButton from "@/components/BackButton"

export default function SoldProperties() {
  const { data: session } = useSession()
  const [soldProperties, setSoldProperties] = useState<PropertyWithImages[]>([])

  useEffect(() => {
    fetchUserProperties()
  }, [session])

  const fetchUserProperties = async () => {
    if (session?.user) {
      const properties = await getUserProperties(+session.user.id)
      // const sold = properties.filter(property => property.isSold)
      setSoldProperties(properties)
    }
  }

  return (
    <div className="container">
      <div className="heading">Sold Properties</div>
      <BackButton/>
      <PropertyCards properties={soldProperties} layout={"vertical"}/>
    </div>
  )
}