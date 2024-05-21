import { useLoader } from '../context/LoaderContext'
import { CircularProgress, Modal } from '@mui/material'

const Loader = () => {
  const { isLoading } = useLoader()

  return (
    <Modal open={isLoading}>
      <div className="flex h-screen w-screen items-center justify-center">
        <CircularProgress />
      </div>
    </Modal>
  )
}

export default Loader
