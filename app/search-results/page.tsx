"use client"

import { searchResults } from '@/actions'
import { PropertyWithImages } from '@/db'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState, Suspense } from 'react'
import PropertyCards from '@/components/PropertyCards'
import BackButton from '@/components/BackButton'

// 👇 Inner component (uses useSearchParams)
function SearchResultsInner() {
  const searchParams = useSearchParams()

  const propertyType = searchParams.get("propertyType") || ""
  const location = searchParams.get("location") || ""

  const [properties, setProperties] = useState<PropertyWithImages[]>([])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await searchResults(propertyType, location)
        if (data) setProperties(data)
      } catch (error) {
        console.log("Error fetching properties:", error)
      }
    }

    if (propertyType && location) {
      fetchProperties()
    }
  }, [propertyType, location])

  return (
    <div className='container'>
      <h1 className='heading'>
        {properties.length} properties in {location} for {propertyType}
      </h1>

      <BackButton />
      <PropertyCards properties={properties} layout={"vertical"} />
    </div>
  )
}

// 👇 Main component (Suspense wrapper)
export default function SearchResults() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResultsInner />
    </Suspense>
  )
}