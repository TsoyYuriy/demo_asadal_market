import React from 'react';
import './order.css';
import {useFormik} from "formik";
import {apiKey, baseApi} from "../api/baseApi";
import axios from "axios";

function Order (props) {

  const product = {
    "photo": "https://9-18ok.ru/upload/iblock/4e3/4e343a845c5e028b5ad4e03afde43093.jpg",
    "currency": "KZT",
    "external_id": "1",
    "description": "Хит продаж - стильная шариковая ручка Berlingo I-10 с удобным пластиковым клипом для фиксации там, где это необходимо, станет лаконичным аксессуаром для учёбы или работы. Цвет деталей корпуса и колпачка соответствует цвету чернил. Мягкий резиновый грип в зоне захвата способствует дополнительному удобству при письме. Качественные чернила обеспечивают чёткое и ровное письмо. Прозрачный корпус позволяет визуально контролировать расход чернил. Диаметр пишущего узла 0,4 мм обеспечивает тонкую, изящную линию на бумаге.",
    "product": {
      "name": "Ручка",
      "price": 200,
      "quantity": 1,
    },
    "phone": ""
  }

  const validate = values => {
    const errors = {};
    if (!values.phone) {
      errors.phone = 'Это обязательно поля';
    } else if (!/^\d{10}$/.test(values.phone)) {
      errors.phone = 'Не правильно введен номер';
    }

    if (!values.product.quantity) {
      errors.product = errors.product || {};
      errors.product.quantity = 'Это обязательно поля';
    } else if (values.product.quantity <= 0) {
      errors.product = errors.product || {};
      errors.product.quantity = 'Кол-во должно быть больше 1';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: product,
    validate,
    onSubmit: async values => {
      try {
        const resp = await axios.post(baseApi,
          {
            "currency": "KZT",
            "external_id": "3",
            "description": "Стильная шариковая ручка Berlingo I-10",
            "attempts": 5,
            "mcc": "5533",
            "capture_method": "HOLD",
            "back_url": "https://asadalpay.com",
            "products": [
              values.product
            ]
          },
          {
            headers: {
              'api-key': apiKey
            }
          }
        )
        window.location.href = resp.data.checkout_url;
      } catch (err) {
        console.log(err)
      }
    }
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className={'form-order'}>
        <div className="img-wrap">
          <img className={'img'} src={product.photo} alt="Image product"/>
        </div>

        <div className="info-product">
          <div className="header">
            <h2 className="product-name">
              {product.product.name}
            </h2>
            <div className="id">ID #{product.external_id}</div>
          </div>


          <div className="price">
            <p>Цена</p>
            <p>{product.product.price} {product.currency}</p>
          </div>

          <label className={'quantity-label'}>
            <p>Кол-во:</p>
            <input type="number" name="product.quantity" value={formik.values.product.quantity} onChange={formik.handleChange}/>
          </label>
          {formik.errors.product?.quantity ? <div className={'error-quantity'}>{formik.errors.product.quantity}</div> : null}

          <label className={'delivery'}>
            <p>Номер для доставки:</p>
            <input
              type="phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              placeholder={'Номер телефона'}/>
          </label>
          {formik.errors.phone ? <div className={'error-phone'}>{formik.errors.phone}</div> : null}


          <div className="description">
            <p>Описание:</p>
            <p>{product.description}</p>
          </div>

          <div className="btn-wrap">
            <button type="submit" className={'btn'}>Оплатить</button>
          </div>
        </div>
      </div>

    </form>

  );
}

export default Order;