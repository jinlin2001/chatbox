declare var bootstrap: any;
const container = document.querySelector('.toast-container');

function showToast(msg: string) {
  const toast = document.createElement('div');
  toast.className =
    'toast align-items-center fw-bold bg-warning m-0 border-0 rounded-0';
  toast.innerHTML = `<div class="d-flex"><div class="toast-body text-break">${msg}</div><button type="button" class="btn-close btn-close-white m-auto" data-bs-dismiss="toast"></button>
  </div>`;
  container!.appendChild(toast);
  new bootstrap.Toast(toast).show();
}
export { showToast };
