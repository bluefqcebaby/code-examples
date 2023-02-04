import sx from 'classnames';
import { DragEvent, useState, MouseEvent, FC } from 'react';
import Paperclip from 'src/assets/svg/paperclip';
import Cross from 'src/assets/svg/cross';
import { getStringFromSize } from 'src/helpers/getStringFromSize';
import { useAppDispatch } from 'src/store';
import { setNotification } from 'src/store/slices/appSlice';

interface Props {
  file: File | null;
  setFile: (arg: File) => void;
  label: string;
  error?: string;
}

const acceptedTypes = ['jpeg', 'jpg', 'png'];

const FileInput: FC<Props> = ({ file, setFile, label, error }) => {
  const dispatch = useAppDispatch();
  const [dragStart, setDragStart] = useState(false);
  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const { files } = e.dataTransfer;
    const filename = files[0].name;
    const type = filename.slice(filename.lastIndexOf('.') + 1);
    if (acceptedTypes.includes(type)) {
      setFile(files[0]);
    } else {
      dispatch(
        setNotification({
          value: `Допустимые типы - ${acceptedTypes.join(' | ')}`,
          variant: 'error',
        })
      );
    }
    setDragStart(false);
  };
  const onDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const deleteFile = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setFile(null);
  };
  return (
    <div>
      <p className="mb-2 text-base">{label}</p>
      <label
        className={sx(
          'flex h-[136px] w-full cursor-pointer flex-col items-center justify-center',
          'rounded-lg border border-dashed border-gray300 px-12  text-base transition',
          { 'bg-gray100 opacity-80': dragStart }
        )}
        onDragOver={onDragOver}
        onDragEnter={(e) => (e.stopPropagation(), setDragStart(true))}
        onDragLeave={() => setDragStart(false)}
        onDrop={onDrop}
      >
        <div className="flex items-center gap-2">
          <Paperclip />
          <p>Нажмите или перетяните файл (192х192 px)</p>
        </div>
        {file && (
          <div className="mt-4 flex w-full justify-between rounded-lg bg-gray100 p-4 py-3 px-4 pt-2">
            <div className="flex gap-2">
              <p>{file.name}</p>
              <p className="text-gray400">{getStringFromSize(file.size)}</p>
            </div>
            <button onClick={deleteFile}>
              <Cross />
            </button>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".png, .jpg, .jpeg"
        />
      </label>
      {error && <p className="text-sm text-red">{error}</p>}
    </div>
  );
};
export default FileInput;
