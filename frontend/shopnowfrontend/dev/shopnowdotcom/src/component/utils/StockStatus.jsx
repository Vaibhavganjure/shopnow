import React from 'react'

function StockStatus({inventory}) {
   return (
    <p>
      {inventory > 0 ? (
        <span className="text-success">{inventory} in stock</span>
      ) : (
        <span className="text-danger">Out of stock</span>
      )}
    </p>
  );
};

export default StockStatus
