import sx from 'classnames';
import { FC } from 'react';
import * as UI from '@Components';
import PlusBlack from 'src/assets/svg/plus-black';
import Pencil from 'src/assets/svg/pencil';
import TrashCan from 'src/assets/svg/trash';
import Eye from 'src/assets/svg/eye';

interface Props {
  onEdit?: () => void;
  onDelete?: () => void;
  onCreate?: () => void;
  onToggleVisibility?: () => void;
}

export const ButtonRow: FC<Props> = ({
  onEdit,
  onDelete,
  onCreate,
  onToggleVisibility,
}) => {
  return (
    <div className="flex gap-2 mt-auto">
      {onCreate && (
        <UI.Button onClick={onCreate} styles="w-full">
          <PlusBlack />
          Cоздать курс
        </UI.Button>
      )}
      {onEdit && (
        <UI.Button
          onClick={onEdit}
          styles={sx({ 'w-full': onCreate === undefined })}
        >
          <Pencil />
          {!onCreate && 'Редактировать'}
        </UI.Button>
      )}
      {onToggleVisibility && (
        <UI.Button onClick={onToggleVisibility}>
          <Eye />
        </UI.Button>
      )}
      {onDelete && (
        <UI.Button onClick={onDelete}>
          <TrashCan />
        </UI.Button>
      )}
    </div>
  );
};
