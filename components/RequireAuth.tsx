"use client"
import { useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect, Suspense } from 'react'

function RequireAuthInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      alert("Please sign in to access this page")
      router.replace(window.location.pathname)
    }
  }, [searchParams])

  return <>{children}</>
}

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <RequireAuthInner>
        {children}
      </RequireAuthInner>
    </Suspense>
  )
}