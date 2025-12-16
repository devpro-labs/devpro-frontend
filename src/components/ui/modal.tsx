import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'

const Modal = (
  {title, isOpen, onClose, children} : {
    title: string,
    isOpen: boolean,
    onClose: () => void,
    children: React.ReactNode
  }
) => {
  return (
    <div>
      <Dialog  open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:w-125 w-[90%] bg-white dark:bg-black'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Modal