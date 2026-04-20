class ValidacionesHelper {
  getIntegerOrDefault = (value, defaultValue) => {
    const numero = parseInt(value);
    return isNaN(numero) ? defaultValue : numero;
  };

  getStringOrDefault = (value, defaultValue) => {
    if (value === undefined || value === null) {
      return defaultValue;
    }

    return String(value);
  };

  getDateOrDefault = (value, defaultValue) => {
    if (value === undefined || value === null) {
      return defaultValue;
    }

    const fecha = new Date(value);

    if (isNaN(fecha.getTime())) {
      return defaultValue;
    }

    return fecha;
  };

  getBooleanOrDefault = (value, defaultValue) => {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const texto = value.toLowerCase();

      if (texto === "true") {
        return true;
      }

      if (texto === "false") {
        return false;
      }
    }

    return defaultValue;
  };

  isEmail = (value) => {
    if (value === undefined || value === null) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };
}

export default new ValidacionesHelper();