export function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.isConnected) {
      toast.remove();
    }
  }, 3000);
}
