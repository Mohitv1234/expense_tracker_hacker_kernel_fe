// src/components/CustomToast.jsx

import { toaster } from '../components/ui/toaster'

const CustomToast = ({
  title = 'Notification',
  description = '',
  type = 'info',
}) => {
  toaster.create({
    title,
    description,
    type,
    duration: 3000,
    closable: true,
  })
}

export default CustomToast