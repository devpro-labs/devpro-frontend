"use client"

import { fetchProblems } from '@/components/problems/api'
import Problems from '@/components/problems/problems'
import { Header } from '@/components/ui/header'
import { Response } from '@/lib/const/response'
import { useAuth } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'

const page =  () => {

  const {getToken} = useAuth();

  const problems = useQuery({
    queryKey: ['problems'],
    queryFn: () => {
      return getToken().then((token) => fetchProblems(token??""));
    }
  }) 

  const res:Response|undefined = problems.data;
  

  return (
    <div> 
      <Header />
      <Problems data={res?.DATA?.problems ?? []} />
    </div>
  )
}

export default page