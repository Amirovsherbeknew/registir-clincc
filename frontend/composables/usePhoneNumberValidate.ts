export const usePhoneNumberValidate = () => {
    return (rule: any, value: string, callback: Function) => {
      if (!value || value.replace(/\D/g, '').length !== 12) {
        callback(new Error('Telefon raqam 12 raqamdan iborat bo‘lishi kerak'));
      } else {
        callback();
      }
    };
  };
  