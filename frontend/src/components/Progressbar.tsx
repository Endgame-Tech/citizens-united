import { CheckIcon } from "@heroicons/react/24/outline";

type ProgressProps = {
  currentNumber: number;
};
export default function Progressbar({ currentNumber }: ProgressProps) {
  const maxNumber: number = 4;
  const checkpoints = Array.from({ length: maxNumber }, (_, i) => i + 1);

  return (
    <div className="flex justify-start mb-6 w-full gap-12 text-sm">
      {checkpoints.map((checkpoint) => {
        return checkpoint < currentNumber ? (
              <div
                key={checkpoint}
                className={`w-6 h-6 rounded-full grid place-content-center bg-accent-green`}
              >
                <CheckIcon className=" size-4 text-white"/>
              </div>
            ) :checkpoint === currentNumber ?  (
              <div
                key={checkpoint}
                className={`w-6 h-6 rounded-full grid justify-center items-center bg-accent-green text-white`}
              >
                {checkpoint}
              </div>
        ):(
            <div
            key={checkpoint}
            className={`w-6 h-6 rounded-full grid place-content-center bg-gray-200`}
          >
            {checkpoint}
          </div>
        )
          
      })}
    </div>
  );
}
