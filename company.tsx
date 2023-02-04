import { useNavigate } from 'react-router-dom';
import { routes } from 'src/consts';
import { Template } from '../views/Template';
import Card from '../views/Card';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchAllCompanies } from 'src/store/slices/marketplaceSlice';

const Companies = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const companies = useAppSelector((store) => store.marketplace.companies);
  const searchValue = useAppSelector((store) => store.marketplace.searchValue);
  const activeFilter = useAppSelector(
    (store) => store.marketplace.selectedFilter
  );
  const filteredCompanies = useMemo(() => {
    const searchCompanies = companies.filter((elem) =>
      elem.title.includes(searchValue)
    );
    
    if (activeFilter === 'all') {
      return searchCompanies;
    }

    return searchCompanies.filter(
      (elem) => elem.publicationStatus.id === activeFilter
    );
  }, [companies, activeFilter, searchValue]);
  const createCourse = () => {
    navigate('/' + routes.marketplace.createCompany);
  };
  useEffect(() => {
    dispatch(fetchAllCompanies());
  }, []);

  return (
    <Template>
      <Card create title="Создать компанию" onClick={createCourse} />
      {filteredCompanies?.map((elem) => (
        <Card
          title={elem.title}
          courseCount={elem.numberOfCourses}
          status={elem.publicationStatus.id}
          onCreate={() => console.log('create')}
          onEdit={() => console.log('edit')}
          onClick={() => console.log('click')}
          onToggleVisibilityClick={() => console.log('toggle')}
          onDelete={() => console.log('delete')}
        />
      ))}
    </Template>
  );
};

export default Companies;
