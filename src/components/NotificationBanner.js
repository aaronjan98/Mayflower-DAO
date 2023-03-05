import { useState } from 'react'

const NotificationBanner = () => {
  const [showBanner, setShowBanner] = useState(true)

  const handleCloseBanner = () => {
    setShowBanner(false)
  }

  return (
    showBanner && (
      <div className="notification-banner">
        <span className="close-btn" onClick={handleCloseBanner}>
          &times;
        </span>
        <span>
          To be able to create and vote on proposals, you'll need to become an
          investor by requesting MAY tokens at aaronjanovitch@gmail.com
        </span>
      </div>
    )
  )
}

export default NotificationBanner
