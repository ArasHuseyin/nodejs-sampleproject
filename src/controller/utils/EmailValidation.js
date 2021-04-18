 function validateEmail(email) {
    const pattern = /\S+@\S+\.\S+/;;
    
    return pattern.test(email);
  };

  export {validateEmail}