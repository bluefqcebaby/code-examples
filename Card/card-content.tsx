import { StringGradients } from 'antd/es/progress/progress';
import { FC } from 'react';
import { Status } from 'src/types/marketplace/status';
import { ButtonRow } from './button-row';
import { CardLabel } from './card-label';
import { CourseLabel } from './course-label';

interface Props {
  onCreate?: () => void;
  status?: Status;
  title?: string;
  onDelete?: () => void;
  onEdit?: () => void;
  onToggleVisibilityClick?: () => void;
  courseCount?: number;
}

export const CardContent: FC<Props> = ({
  courseCount,
  status,
  title,
  onDelete,
  onCreate,
  onEdit,
  onToggleVisibilityClick,
}) => {
  const isDraft = status === 1;
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <CardLabel status={status} />
        <CourseLabel courseCount={courseCount} />
      </div>
      <h3 className="mb-6 pt-4 text-left text-2xl font-medium text-black">
        {title}
      </h3>
      <ButtonRow
        onCreate={!isDraft ? onCreate : undefined}
        onDelete={onDelete}
        onEdit={onEdit}
        onToggleVisibility={!isDraft ? onToggleVisibilityClick : undefined}
      />
    </div>
  );
};
