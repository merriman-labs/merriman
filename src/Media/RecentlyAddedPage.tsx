import React, { useState } from 'react';
import { FaAngleDoubleDown } from 'react-icons/fa';
import { RecentItems } from '../components/Home/RecentItems';

export const RecentlyAddedPage = () => {
  const [count, setCount] = useState(24);
  return (
    <>
      <RecentItems items={count} />
      <button className="btn btn-block btn-outline-info" onClick={() => setCount(count + 12)}><FaAngleDoubleDown /> Load More</button>
    </>
  );
};
