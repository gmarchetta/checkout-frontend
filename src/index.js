import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import axios from 'axios';

class Basket extends React.Component {
  render() {
    return (
      <div className="basket">
        <h3>Your basket contents:</h3>
        <table className="table">
          <tbody>
            <tr>
              <th width="150">Product name</th>
              <th width="150">Product type</th>
              <th width="150">Price</th>
              <th width="150">Quantity</th>
            </tr>
            {this.props.basket.items.map((item, index) => {
              return <BasketItem key={index} item={item} />
            })}
          </tbody>
        </table>

        <h4>Total amount after discounts: {this.props.basket.totalAmount}</h4>
      </div>
    );
  }
}

class BasketItem extends React.Component {
  render() {
    return (
      <tr>
          <td>{this.props.item.product.productName}</td>
          <td>{this.props.item.product.productType}</td>
          <td>{this.props.item.product.price}</td>
          <td>{this.props.item.quantity}</td>
      </tr>
    );
  }
}

class ProductAppender extends React.Component {
  render() {
    return (
      <div>
        <br/>
        <h3>Add products here!</h3>
        <table>
          <tbody>
            <tr>
              <td width="250">
                Product
              </td>
              <td width="250">
                Quantity
              </td>
              <td width="250">
              </td>
            </tr>
            <tr>
              <td>
                <select ref={this.props.productRef} id='product' name='product' className="custom-select w-90">
                  <option value="1">Lana Pen</option>
                  <option value="2">Lana T-Shirt</option>
                  <option value="3">Lana Coffee Mug</option>
                </select>
              </td>
              <td>
                <input ref={this.props.quantityRef} className="form-control w-90 "/>
              </td>
              <td>
                <button className="btn btn-primary" onClick={() => this.props.onAddProduct(1, 2)}>
                  Add to cart
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      items: [],
      totalAmount: 0
    };
  }

  componentDidMount() {
    axios.post('http://localhost:8080/basket', {})
      .then(res => {
        const basket = res.data;
        const id = basket.id;
        const items = basket.items != undefined? basket.items: [];
        this.setState({id: id, items: items});
        axios.get('http://localhost:8080/basket/' + id + '/total')
          .then(res => {
            const total = res.data;
            this.setState({ totalAmount: total });
          });
      });

  }

  handleAddProduct() {
    const productId = this.productId.value;
    const quantity = this.quantity.value;

    axios.post('http://localhost:8080/basket/' + this.state.id + '/products', {productId, quantity})
      .then(res => {
        const basket = res.data;
        this.setState({ items: basket.basketItems });
        axios.get('http://localhost:8080/basket/' + this.state.id + '/total')
          .then(res => {
            const total = res.data;
            this.setState({ totalAmount: total });
          });
      })
  }

  render() {
    return (
      <div className="ml-4 mt-4">
        <Basket basket={this.state}/>
        <ProductAppender
          basketId={this.state.id}
          onAddProduct={()=>this.handleAddProduct()}
          quantityRef={(quantityInput) => this.quantity = quantityInput}
          productRef={(productSelect) => this.productId = productSelect}
        />
      </div>
    )
  }
}

// ========================================

ReactDOM.render(
  <Checkout />,
  document.getElementById('root')
);
