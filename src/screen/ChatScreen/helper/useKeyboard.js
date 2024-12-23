import React from 'react';
import { Keyboard } from 'react-native';

const useKeyboard = () => {
  const [visible, setVisible] = React.useState(false);

  const dismiss = () => {
    Keyboard.dismiss();
    setVisible(false);
  };

  React.useEffect(() => {
    const onKeyboardDidShow = () => {
      setVisible(true);
    };

    const onKeyboardDidHide = () => {
      setVisible(false);
    };

    Keyboard.addListener('keyboardWillShow', onKeyboardDidShow);
    Keyboard.addListener('keyboardWillHide', onKeyboardDidHide);

    return () => {
      Keyboard.removeListener('keyboardWillShow', onKeyboardDidShow);
      Keyboard.removeListener('keyboardWillHide', onKeyboardDidHide);
    };
  }, []);

  return [visible, dismiss];
};

export default useKeyboard;