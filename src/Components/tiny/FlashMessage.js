import {  publicUrl } from "../../service/apiRest";
import Swal from "sweetalert2";
export default function FlashMessage(title, text, time=1000, icon="success", location="") {
      Swal.fire({
        title: title,
        text: text,
        icon: icon,
        draggable: true,
        timer: time,
      }).then(() => {
        if(location!==""){
          window.location.href = `${publicUrl}/${location}`;
        }
      });
      ;
    };

