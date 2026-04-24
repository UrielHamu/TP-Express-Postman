class DateTimeHelper {
  isDate = (fecha) => {
    return fecha instanceof Date && !isNaN(fecha.getTime());
  };

  getOnlyDate = (fecha = new Date()) => {
    const copia = new Date(fecha);
    copia.setHours(0, 0, 0, 0);
    return copia;
  };

  getEdadActual = (fechaNacimiento) => {
    if (!this.isDate(fechaNacimiento)) {
      return -1;
    }

    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();
    const mesNacimiento = fechaNacimiento.getMonth();
    const diaNacimiento = fechaNacimiento.getDate();

    if (
      mesActual < mesNacimiento ||
      (mesActual === mesNacimiento && diaActual < diaNacimiento)
    ) {
      edad--;
    }

    return edad;
  };

  getDiasHastaMiCumple = (fechaNacimiento) => {
    if (!this.isDate(fechaNacimiento)) {
      return -1;
    }

    const hoy = this.getOnlyDate(new Date());
    let proximoCumple = new Date(
      hoy.getFullYear(),
      fechaNacimiento.getMonth(),
      fechaNacimiento.getDate()
    );

    proximoCumple = this.getOnlyDate(proximoCumple);

    if (proximoCumple < hoy) {
      proximoCumple.setFullYear(proximoCumple.getFullYear() + 1);
    }

    const diferenciaEnMilisegundos = proximoCumple.getTime() - hoy.getTime();
    return Math.ceil(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));
  };

  getDiaTexto = (fecha, retornarAbreviacion = false) => {
    const diasArray = [
      
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo"
    ];

    const dia = diasArray[fecha.getDay()];

    if (retornarAbreviacion) {
      return dia.substring(0, 3);
    }

    return dia;
  };

  getMesTexto = (fecha, retornarAbreviacion = false) => {
    const mesesArray = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"
    ];

    const mes = mesesArray[fecha.getMonth()];

    if (retornarAbreviacion) {
      return mes.substring(0, 3);
    }

    return mes;
  };
}

export default new DateTimeHelper();