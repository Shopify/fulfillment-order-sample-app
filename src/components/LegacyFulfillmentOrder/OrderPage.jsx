import { useEffect, useState } from "react";
import { userLoggedInFetch } from "../../App";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Card, Layout } from "@shopify/polaris";
import { OrderList } from "./OrderList";

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
        <Layout.Section>
        <Card>
            {orders && <OrderList orders={orders} />}
            </Card>
        </Layout.Section>
    );

   
}