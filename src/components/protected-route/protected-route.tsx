import { FC } from 'react';

type Props = {
  children: JSX.Element;
};

export const ProtectedRoute: FC<Props> = ({ children }) => children;