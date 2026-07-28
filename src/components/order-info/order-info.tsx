import { FC, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { getFeedOrders, getIngredients, getUserOrders } from '@slices';
import { getOrderByNumberApi } from '@api';
import { NotFound404 } from '../../pages/not-fount-404';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();
  const orderNumber = Number(number);
  const openedAsModal = Boolean(location.state?.background);

  const ingredients = useSelector(getIngredients);
  const feedOrders = useSelector(getFeedOrders);
  const userOrders = useSelector(getUserOrders);

  const orderFromStore =
    feedOrders.find((order) => order.number === orderNumber) ||
    userOrders.find((order) => order.number === orderNumber) ||
    null;

  const [orderData, setOrderData] = useState<TOrder | null>(orderFromStore);
  const [isLoading, setIsLoading] = useState(!orderFromStore);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (orderFromStore) {
      setOrderData(orderFromStore);
      setIsLoading(false);
      setNotFound(false);
      return;
    }

    if (!number || Number.isNaN(orderNumber)) {
      setOrderData(null);
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getOrderByNumberApi(orderNumber)
      .then((response) => {
        if (response.success && response.orders.length) {
          setOrderData(response.orders[0]);
          setNotFound(false);
        } else {
          setOrderData(null);
          setNotFound(true);
        }
      })
      .catch(() => {
        setOrderData(null);
        setNotFound(true);
      })
      .finally(() => setIsLoading(false));
  }, [orderFromStore, orderNumber, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (notFound || !orderData) {
    // Если открыли как модалку — убираем background, чтобы 404 был на всю страницу
    if (openedAsModal) {
      return <Navigate to={location.pathname} replace state={null} />;
    }
    return <NotFound404 />;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
