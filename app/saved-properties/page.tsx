'use client'
import { PropertyWithImages } from "@/db"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { savedProperty, getUser } from '@/actions'
import PropertyCards from "@/components/PropertyCards"
import BackButton from "@/components/BackButton"


export default function SavedProperties() {
    const { data: session } = useSession()
    const [savedProperties, setSavedProperties] = useState<PropertyWithImages[]>([])


    console.log(savedProperties)

    useEffect(() => {
        fetchUserProperties()
    }, [session])

    const fetchUserProperties = async () => {
        if (session?.user) {
            const user = await getUser(+session.user.id)
            if (user) { 
                setSavedProperties(user.savedProperties)
            }
        }
    }
    return (
        <div className="container">
            <div className="heading">Saved Properties</div>
            <BackButton/>
            <PropertyCards properties={savedProperties} layout={"vertical"}/>
        </div>
    )
}
