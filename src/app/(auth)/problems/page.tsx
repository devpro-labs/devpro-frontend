"use client"

import Problems from '@/components/problems/problems'
import { Header } from '@/components/ui/header'
import { useAuth, useClerk } from '@clerk/nextjs';
import { useEffect } from 'react';


const page = () => {

  const {getToken} = useAuth();

  async function fetchData() {

    const token = await getToken({
      template: "devpro-jwt"
    });

    const res = await fetch('http://localhost:8081/api/user/me', { method: 'GET', credentials: 'include',
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token ?? ''}`
      }
     });
    return res.json()
  }

  useEffect(() => {
    fetchData().then(data => {
      console.log(data);
    });
  }, []);

  return (
    <div>
      <Header />
      <Problems />
    </div>
  )
}

export default page