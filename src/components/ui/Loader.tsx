
import { Atom } from 'react-loading-indicators'

const Loader = () => {
  return (
     <div className="fixed inset-0 z-9999 flex items-center justify-center backdrop-blur-md bg-black/30">
      <Atom
        color="#211c36"
        size="medium"
        text=""
        textColor="#212cf9"
      />
    </div>
  )
}

export default Loader