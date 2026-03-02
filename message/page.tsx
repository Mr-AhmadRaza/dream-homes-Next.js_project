'use client'
import {getUser} from "@/actions"
import BackButton from "@/components/BackButton"
import { MessageType } from "@/db"
import { Message } from "@prisma/client"
import { Avatar, Breadcrumb, Card, message } from "antd"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"


export default function MessagePage() {
    const {data:session}=useSession()
    const [messages,setMessages]=useState<MessageType[]>([])

    useEffect(()=>{
        async function fetchMessages(){
            try {
                const user=await getUser(parseInt(session?.user?.id!))
                if(user){
                    setMessages(user.receivedMessages)
                }
                console.log(user)
            } catch (error) {
                console.log("Error fetching user",error)
                
            }
        }
        fetchMessages()
    },[session])

    console.log(messages)
  return (
    <div className="container-sm">
        <h1 className="heading">Messages</h1>
        <Breadcrumb
        className="flex-center mb-1"
        items={[
            {
                title:"Home",
                href:'/',
            },
            {
                title:"Message"
            },
        ]}
        >
         <BackButton/>
         </Breadcrumb>
      <p className="message-count">
        You have {messages.filter((message)=>message.isRead === false).length}{""}
        unread messages
      </p>
      
      <div className="card-item">
        {messages.map((message)=>(
            <Card className={!message.isRead ? "read w-full":"w-full"}>
                <div className="flex-align-center">
                    <div className="flex-justify-conter">
                    <Avatar className="msg-avatar" src={message.sender.image}></Avatar>
                    <div>
                        <div className="username">{message.sender.username}</div>
                        <div className="email">{message.sender.email}</div>
                        <p>
                            Property:<strong>{message.property.name}</strong>
                        </p>
                    </div>
                    </div>  
                    <p className="created-at">{message.createdAt.toDateString()}
                    </p>            
                </div>
                <p className="mt-1">{message.message}</p>
            </Card>
        ))}
      </div>
    </div>
  )
}
