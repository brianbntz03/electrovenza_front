import Swal from "sweetalert2";
export default function FlashMessage(title, text, time=1000, icon="success") {
      Swal.fire({
        title: title,
        text: text,
        icon: icon,
        draggable: true,
        timer: time,
      });
    };