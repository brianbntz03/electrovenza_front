import Swal from "sweetalert2";
export default async function FlashMessageConfirm(title, text, time=3000) {
      
      return Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "Cancelar",
        draggable: true,
      }).then((result) => {
        if (result.isConfirmed) {
          return true;
        }else{
            return false;
        }
      });
      ;
    };