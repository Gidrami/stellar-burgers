import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders, getUserOrders, getUserOrdersLoading } from '@slices';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getUserOrders);
  const loading = useSelector(getUserOrdersLoading);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
