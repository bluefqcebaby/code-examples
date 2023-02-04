import { FC } from 'react';
import { Status } from 'src/types/marketplace/status';
import sx from 'classnames';
import { AddCard } from './add-card';
import { CardContent } from './card-content';

interface Props {
  create?: boolean;
  onClick?: () => void;
  status?: Status;
  title?: string;
  onDelete?: () => void;
  onEdit?: () => void;
  onToggleVisibilityClick?: () => void;
  courseCount?: number;
  onCreate?: () => void;
}

const Card: FC<Props> = ({
  create = false,
  onClick,
  status,
  title,
  onCreate,
  onDelete,
  onEdit,
  onToggleVisibilityClick,
  courseCount,
}) => {
  return (
    <div
      className={sx(
        'min-h-[200px] cursor-pointer rounded-xl',
        create
          ? 'flex flex-col items-center justify-center border border-blue300 bg-blue100'
          : 'relative bg-gray100 p-5'
      )}
      onClick={onClick}
    >
      {create ? (
        <AddCard title={title} />
      ) : (
        <CardContent
          courseCount={courseCount}
          status={status}
          title={title}
          onCreate={onCreate}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleVisibilityClick={onToggleVisibilityClick}
        />
      )}
    </div>
  );
};

export default Card;
