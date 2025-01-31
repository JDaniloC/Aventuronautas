import { CountContext } from "../contexts/CountContext";
import React, { useContext, useEffect } from "react";

import Link from "next/link";

export function NextStepButton({
  currentStep,
}: {
  currentStep: number;
}): JSX.Element {
  const { verifyGain, resetCount } = useContext(CountContext);

  useEffect(() => {
    if (currentStep === 2) {
      resetCount();
    }
  }, [currentStep]);

  function handleNextTask() {
    verifyGain(currentStep);
  }

  return currentStep === 2 ? (
    <Link href="/">
      <button className="project" type="button">
        Completar missão
      </button>
    </Link>
  ) : (
    <button className="project" type="button" onClick={handleNextTask}>
      Próxima tarefa
    </button>
  );
}
