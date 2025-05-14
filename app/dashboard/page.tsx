import { getServerSession } from 'next-auth'
import React from 'react'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

type Props = {}

const Dashboard = async (props: Props) => {
    const session = await getServerSession(authOptions as any)
    if(!session){
        redirect('/login')
    }
  return (
    <div>
      <div className="text-xl">This is Dashboard Page</div>
    </div>
  )
}

export default Dashboard