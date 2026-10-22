import { FC } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { getIngredients, getIngredientsLoading } from '@slices';
import { NotFound404 } from '../../pages/not-fount-404';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const openedAsModal = Boolean(location.state?.background);
  const ingredients = useSelector(getIngredients);
  const loading = useSelector(getIngredientsLoading);
  const ingredientData = ingredients.find((item) => item._id === id) || null;

  if (loading || !ingredients.length) {
    return <Preloader />;
  }

  if (!ingredientData) {
    if (openedAsModal) {
      return <Navigate to={location.pathname} replace state={null} />;
    }
    return <NotFound404 />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
