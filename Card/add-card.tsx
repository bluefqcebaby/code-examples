import AddIcon from 'src/assets/svg/plus';

export const AddCard = ({ title }: { title: string }) => {
  return (
    <>
      <div className="h-[56px] w-[56px] rounded-full flex items-center justify-center bg-blue200 hover:scale-95 transition">
        <AddIcon />
      </div>
      <p className="mt-4 text-base">{title}</p>
    </>
  );
};
