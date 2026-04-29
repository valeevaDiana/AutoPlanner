import { useState, useEffect } from "react";

interface UseModalPositionProps {
  position: { top: number; left: number };
  modalWidth: number;
  modalHeight: number;
}

export const useModalPosition = ({
  position,
  modalWidth,
  modalHeight,
}: UseModalPositionProps) => {
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    const calculateAdjustedPosition = () => {
      const { top, left } = position;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const offsetX = modalWidth / 2;
      const offsetY = modalHeight / 2;

      let adjustedLeft = left;
      if (left - offsetX < 10) {
        adjustedLeft = offsetX + 10;
      } else if (left + offsetX > windowWidth - 10) {
        adjustedLeft = windowWidth - offsetX - 10;
      }

      let adjustedTop = top;
      if (top - offsetY < 10) {
        adjustedTop = offsetY + 10;
      } else if (top + offsetY > windowHeight - 10) {
        adjustedTop = windowHeight - offsetY - 10;
      }

      return { top: adjustedTop, left: adjustedLeft };
    };

    setAdjustedPosition(calculateAdjustedPosition());
  }, [position, modalWidth, modalHeight]);

  return adjustedPosition;
};
