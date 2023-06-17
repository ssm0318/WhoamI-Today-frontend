import { useState } from 'react';

const useTogglesShowPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return {
    showPassword,
    toggleShowPassword,
  };
};

export default useTogglesShowPassword;
