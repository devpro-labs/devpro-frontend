import Modal from '../ui/modal'
import { OtpInput } from '../ui/otp-input'
import { Button } from '../ui/button'

const OtpVerification = (
  {
    title,
    isOpen,
    onClose,
    otp,
    setOtp,
    email,
    onSubmit
  }: {
    title: string,
    isOpen: boolean,
    onClose: () => void,
    otp: string,
    setOtp: (otp: string) => void
    email: string
    onSubmit?: () => void
  }
) => {
  return (
    <div>
      <Modal
        title={title}
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="mt-4 text-gray-600 dark:text-gray-300">
          <p className="mb-3">
            We sent a 6-digit code to <span className="font-medium text-gray-900 dark:text-white">{email}</span>
          </p>
          <p className="mb-6">Please enter it below to continue.</p>

          <div className="flex justify-center gap-3 mb-6">
            <OtpInput setOtp={setOtp} otp={otp} length={6} />
            <Button onClick={onSubmit} variant="link" className="self-end">
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default OtpVerification

