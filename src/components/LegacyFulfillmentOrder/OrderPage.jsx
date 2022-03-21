import { useEffect, useState } from "react";
import { userLoggedInFetch } from "../../App";
import { useAppBridge } from "@shopify/app-bridge-react";

export function OrderPage() {
    const [orders, setOrders] = useState();
    const app = useAppBridge();

    useEffect(async ()=> {
        /// data loading
        const authFetch = userLoggedInFetch(app);
        authFetch('/orders?shop=liz-dev-5.myshopify.com')
        .then(response => response.json()).then(data => {
            setOrders(data.body.orders);
            console.log(data.body.orders);
        })
        // console.log(res);
        // set the res to some sate

    }, [])

    return (
        <div>
        <h1>Order Page</h1>
        {orders && orders.map(order =><span> {order.id}</span>)};
        </div>
    );
}