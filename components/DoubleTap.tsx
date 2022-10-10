import React, {useRef} from 'react';
import {TouchableWithoutFeedback} from 'react-native';

interface IPropps {
  delay?: number;
  onDoubleTap: () => void;
  children: React.ReactNode;
}

export default function DoubleTap({
  delay = 300,
  onDoubleTap,
  children,
}: IPropps) {
  const lastTap = useRef<number | null>(null);

  const handleDoubleTap = () => {

    const now = Date.now();
    if (lastTap.current && now - lastTap.current < delay) {
      onDoubleTap();
    } else {
      lastTap.current = now;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      {children}
    </TouchableWithoutFeedback>
  );
}
