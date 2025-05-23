import { useToast } from 'native-base';

export const useCustomToast = () => {
  const toast = useToast();

  const showSuccess = (message: string) => {
    toast.show({
      title: message,
      placement: "top",
      bg: "success.500",
      color: "white",
    });
  };

  const showError = (message: string) => {
    toast.show({
      title: message,
      placement: "top",
      bg: "error.500",
      color: "white",
    });
  };

  const showInfo = (message: string) => {
    toast.show({
      title: message,
      placement: "top",
      bg: "info.500",
      color: "white",
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
  };
}; 