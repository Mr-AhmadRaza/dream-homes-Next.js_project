'use client'

import React, { createContext, useContext } from "react"
import { message } from "antd"

const MessageContext = createContext(
  {} as {
    showMessage: (
      content: string,
      variant: "success" | "error" | "info"
    ) => void
  }
)

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  // ✅ use useMessage to get a proper message instance with context
  const [messageApi, contextHolder] = message.useMessage()

  const showMessage = (
    content: string,
    variant: "success" | "error" | "info"
  ) => {
    switch(variant) {
      case "success":
        messageApi.success(content)
        break
      case "error":
        messageApi.error(content)
        break
      case "info":
        messageApi.info(content)
        break
    }
  }

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {contextHolder} {/* must include this */}
      {children}
    </MessageContext.Provider>
  )
}

export const useMessage = () => useContext(MessageContext)
