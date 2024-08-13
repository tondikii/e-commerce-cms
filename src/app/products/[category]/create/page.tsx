"use client"

import { OBJECT_CATEGORIES_BY_ROUTE } from '@/constant';
import { Typography } from '@mui/joy';
import { useParams } from 'next/navigation';
import type { FC } from 'react';

interface Props {}

const CreateProductPage: FC<Props> = ({}) => {
  const {category}: {category:string}= useParams();
  const { name: categoryLabel}: {id: number, name: string} = OBJECT_CATEGORIES_BY_ROUTE[category] || "";
    return (
      <Typography>{categoryLabel}</Typography>
    );
}
export default CreateProductPage;