import { morph } from 'src/helpers/morph';

export const CourseLabel = ({ courseCount }: { courseCount: number }) => {
  return (
    <p className="text-sm text-gray400">
      {courseCount} {morph(courseCount, ['курс', 'курса', 'курсов'])}
    </p>
  );
};
