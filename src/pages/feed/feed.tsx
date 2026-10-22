import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds, getFeedOrders, getFeedsLoading } from '@slices';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getFeedOrders);
  const loading = useSelector(getFeedsLoading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (loading && !orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
