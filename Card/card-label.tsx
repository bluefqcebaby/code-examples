import { Status } from 'src/types/marketplace/status';
import sx from 'classnames';

const labels: Record<Status, string> = {
  1: 'Черновик',
  2: 'Снято с публикации',
  3: 'Опубликовано',
};

export const CardLabel = ({ status }: { status: Status }) => {
  return (
    <div
      className={sx('rounded-lg px-2 pt-1 pb-[6px] text-sm', {
        'bg-green text-[#215318]': status === 3,
        'bg-yellow100 text-[#6B4920]': status === 1,
        'bg-gray300 text-[#515151]': status === 2,
      })}
    >
      {labels[status]}
    </div>
  );
};
