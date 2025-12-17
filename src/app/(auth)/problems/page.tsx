"use client"

import Problems from '@/components/problems/problems'
import { Header } from '@/components/ui/header'
import { useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'


const page = () => {
  // const {getToken} = useAuth()

  // async function main() {
  //   const token = await getToken()
  //   const api = await fetch('http://localhost:9000/api/problems/string',
  //     {
  //       headers:{
  //         "Authorization": `Bearer ${token}`
  //       }
  //     }
  //   )

  //   const data = await api.json()
  //   console.log(data)
  // }

  // useEffect(() => {
  //   main()
  // }, [])

  return (
    <div>
      <Header />
      <Problems />
    </div>
  )
}

export default page