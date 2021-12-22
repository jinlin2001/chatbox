declare var bootstrap: any;
const modal = new bootstrap.Modal(document.querySelector('.modal'));
export const confirm_leave = document.getElementById('modal-btn');
export function showModal() {
  modal.show();
}
export function hideModal() {
  modal.hide();
}
