import React, { Component } from 'react';
import ProductInCart from './ProductInCart';
import Button from '../../../components/Button';
import './CartList.scss';

export default class CartList extends Component {
  state = {
    productInCart: [],
    isAllChecked: true,
  };

  componentDidMount() {
    const url = '/data/cart.json';
    fetch(url)
      .then(res => res.json())
      .then(data =>
        this.setState({
          productInCart: data.cart_info,
        })
      );
  }

  handleBoxStatusCheck = () => {
    const { productInCart } = this.state;

    const isAllChecked = productInCart.every(product => !!product.is_checked);

    this.setState({ isAllChecked });
  };

  handleAllCheckedBox = e => {
    const { productInCart, isAllChecked } = this.state;

    productInCart.forEach(product => (product.is_checked = e.target.checked));
    this.setState({
      productInCart,
      isAllChecked: !isAllChecked,
    });
  };

  handleCheckBox = e => {
    const { productInCart } = this.state;

    productInCart.forEach(product => {
      if (product.name === e.target.value) {
        product.is_checked = e.target.checked;
      }
    });

    this.setState({ productInCart });

    this.handleBoxStatusCheck();
  };

  clearCart = () => {
    const { productInCart } = this.state;

    productInCart.length &&
      this.setState({
        productInCart: [],
      });
  };

  calculateTotalPriceInCart = () => {
    const { productInCart } = this.state;
    return productInCart.reduce((acc, cur) => acc + cur.total_price, 0);
  };

  render() {
    const { productInCart, isAllChecked } = this.state;

    return (
      <section className="cartList">
        <div className="cartListProduct">제품</div>
        {productInCart.length ? (
          <table className="cartTable">
            <thead className="cartTableHead">
              <tr>
                <th>
                  <input
                    onChange={this.handleAllCheckedBox}
                    type="checkbox"
                    id="checkbox"
                    value="checkedAll"
                    checked={isAllChecked}
                  />
                </th>
                <th colspan="2">제품정보</th>
                <th>수량</th>
                <th>금액</th>
                <th>합계금액</th>
                <th>배송비</th>
              </tr>
            </thead>
            <tbody className="cartTableBody">
              {productInCart.map(product => {
                return (
                  <ProductInCart
                    product={product}
                    key={product.id}
                    handleCheckBox={this.handleCheckBox}
                    productCount={productInCart.length}
                    calculateTotalPriceInCart={this.calculateTotalPriceInCart}
                  />
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="emptyCart">장바구니에 담겨있는 상품이 없습니다.</div>
        )}

        <div className="totalPriceInCart">
          <span>
            총 <strong>{productInCart.length} </strong>개의 금액
          </span>
          <span className="totalPriceInCart price">
            <strong>
              {new Intl.NumberFormat('ko-KR', {
                style: 'currency',
                currency: 'KRW',
              }).format(this.calculateTotalPriceInCart())}
            </strong>
          </span>
          <span>+</span>
          <span>배송비 </span>
          <span>
            <strong>무료</strong>
          </span>
          <span>=</span>
          <span>
            <strong>총 주문금액</strong>
          </span>
          <span className="totalOrderPrice">
            <strong>
              {new Intl.NumberFormat('ko-KR', {
                style: 'currency',
                currency: 'KRW',
              }).format(this.calculateTotalPriceInCart())}
            </strong>
          </span>
        </div>

        <button type="button" className="resetCartBtn" onClick={this.clearCart}>
          장바구니 비우기
        </button>
        <div className="btnWrapperInCart">
          <Button name="쇼핑 계속하기" info="shoppingMore" />
          <Button name="주문하기" info="order" />
        </div>
      </section>
    );
  }
}
