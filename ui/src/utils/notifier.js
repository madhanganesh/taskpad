import { toast } from 'react-toastify';

class Notifier {
  config = {
    position: 'top-right',
    autoClose: true,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  };

  showError(message) {
    toast.error(message, this.config);
  }

  showWarning(message) {
    toast.warn(message);
  }

  showSystemError() {
    this.showError(
      'Unfortunately Taskpad encountered an error. Please retry and if problem persists contact the owner.'
    );
  }
}

const notifier = new Notifier();
export default notifier;
