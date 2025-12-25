
import { Atom } from 'react-loading-indicators'

const Loader = () => {
  return (
     <div className="fixed inset-0 z-9999 flex items-center justify-center backdrop-blur-md bg-black/30">
      <Atom
        color="#93C5FD"
        size="medium"
        text=""
        textColor="#93C5FD"
      />
    </div>
  )
}

export default Loader