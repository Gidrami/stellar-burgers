import { ConstructorPageUI } from '@ui-pages';
import { FC } from 'react';
import { useSelector } from '../../services/store';
import { getIngredientsLoading } from '@slices';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(getIngredientsLoading);

  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};
