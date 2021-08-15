import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateCart } from "../actions/cart";

const CartItem = ({ item }) => {
  const { name, image_url, price, quantity } = item;
  const dispatch = useDispatch();
  const handleClickAdd = () => {
    item.quantity = quantity + 1;
    dispatch(updateCart(item));
  };
  const handleClickRemove = () => {
    item.quantity = quantity - 1;
    dispatch(updateCart(item));
  };
  return (
    <tr>
      <td>
        <i class="far fa-times-circle"></i>
      </td>
      <td>
        <img src={image_url} alt="image thumbnail" />
      </td>
      <td>{name}</td>
      <td>{price}</td>
      <td>
        <i
          class="fa fa-minus-circle"
          aria-hidden="true"
          onClick={handleClickRemove}
        ></i>
        {quantity}
        <i
          class="fa fa-plus-circle"
          aria-hidden="true"
          onClick={handleClickAdd}
        ></i>
      </td>
      <td>{quantity * price}</td>
    </tr>
  );
};

export default CartItem;
